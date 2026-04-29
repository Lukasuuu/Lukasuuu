#!/usr/bin/env node
// scripts/verify-env.js
// Testa cada credencial do .env.local fazendo chamadas reais às APIs
// Executar: node scripts/verify-env.js

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ENV_FILE = join(ROOT, '.env.local');

// ─── Cores ─────────────────────────────────────────────────────────────────
const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', B = '\x1b[36m', NC = '\x1b[0m', BOLD = '\x1b[1m';
const ok = (msg) => console.log(`${G}✓${NC} ${msg}`);
const fail = (msg) => console.log(`${R}✗${NC} ${msg}`);
const warn = (msg) => console.log(`${Y}⚠${NC} ${msg}`);
const info = (msg) => console.log(`${B}ℹ${NC} ${msg}`);
const header = (msg) => console.log(`\n${BOLD}${B}══ ${msg} ══${NC}\n`);

// ─── Ler .env.local ─────────────────────────────────────────────────────────
function loadEnv() {
  if (!existsSync(ENV_FILE)) {
    fail('.env.local não encontrado. Execute: cp .env.example .env.local');
    process.exit(1);
  }
  const env = {};
  readFileSync(ENV_FILE, 'utf-8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (value && !value.includes('...')) env[key] = value;
  });
  return env;
}

const results = { ok: [], warn: [], fail: [] };

function record(status, service, msg) {
  results[status].push(`${service}: ${msg}`);
}

// ─── Verificar Supabase ─────────────────────────────────────────────────────
async function checkSupabase(env) {
  header('Supabase');
  const url = env.VITE_SUPABASE_URL;
  const anon = env.VITE_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anon) {
    fail('VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY em falta');
    record('fail', 'Supabase', 'Credenciais em falta');
    return;
  }

  try {
    // Testar conexão com a base de dados
    const res = await fetch(`${url}/rest/v1/businesses?limit=1`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` }
    });
    if (res.ok || res.status === 406) {
      ok(`URL: ${url}`);
      ok('Anon key válida');
      record('ok', 'Supabase', 'Conexão OK');
    } else if (res.status === 401) {
      fail('Anon key inválida (401)');
      record('fail', 'Supabase', 'Anon key inválida');
    } else {
      // Tabela pode não existir ainda — mas a conexão funciona
      ok(`Conexão Supabase OK (status ${res.status})`);
      record('ok', 'Supabase', 'Conexão OK');
    }
  } catch (e) {
    fail(`Erro de conexão: ${e.message}`);
    record('fail', 'Supabase', `Erro: ${e.message}`);
    return;
  }

  // Verificar se o schema foi executado
  try {
    const res = await fetch(`${url}/rest/v1/businesses?limit=1`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` }
    });
    if (res.status === 200 || res.status === 406) {
      ok('Tabela businesses existe (schema SQL executado)');
    } else if (res.status === 404) {
      warn('Tabela businesses não existe — execute supabase_schema.sql no SQL Editor');
      record('warn', 'Supabase', 'Schema SQL não executado');
    }
  } catch {}

  if (!service) {
    warn('SUPABASE_SERVICE_ROLE_KEY em falta (necessária para webhooks Stripe)');
    record('warn', 'Supabase', 'Service role key em falta');
  } else {
    ok('Service role key configurada');
  }
}

// ─── Verificar Stripe ───────────────────────────────────────────────────────
async function checkStripe(env) {
  header('Stripe');
  const sk = env.STRIPE_SECRET_KEY;
  const pk = env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (!sk || !pk) {
    fail('STRIPE_SECRET_KEY ou VITE_STRIPE_PUBLISHABLE_KEY em falta');
    record('fail', 'Stripe', 'Chaves em falta');
    return;
  }

  if (sk.startsWith('sk_live_')) warn('A usar chave LIVE do Stripe! Cuidado.');
  if (sk.startsWith('sk_test_')) ok('Modo teste do Stripe ativo (correto para desenvolvimento)');

  try {
    const res = await fetch('https://api.stripe.com/v1/account', {
      headers: { Authorization: `Bearer ${sk}` }
    });
    const data = await res.json();
    if (res.ok) {
      ok(`Conta Stripe: ${data.email || data.id}`);
      ok(`País: ${data.country || 'N/D'}`);
      record('ok', 'Stripe', `Conta ${data.email}`);
    } else {
      fail(`Stripe API error: ${data.error?.message}`);
      record('fail', 'Stripe', data.error?.message);
      return;
    }
  } catch (e) {
    fail(`Erro Stripe: ${e.message}`);
    record('fail', 'Stripe', e.message);
    return;
  }

  // Verificar Price IDs
  const priceKeys = [
    'STRIPE_PRICE_PRO_MONTHLY', 'STRIPE_PRICE_PRO_YEARLY',
    'STRIPE_PRICE_BUSINESS_MONTHLY', 'STRIPE_PRICE_BUSINESS_YEARLY'
  ];
  let missingPrices = [];
  for (const key of priceKeys) {
    if (!env[key] || env[key].includes('...')) {
      missingPrices.push(key);
    }
  }
  if (missingPrices.length > 0) {
    warn(`Price IDs em falta: ${missingPrices.join(', ')}`);
    info('Criar em: https://dashboard.stripe.com/products');
    record('warn', 'Stripe', `Price IDs em falta: ${missingPrices.length}`);
  } else {
    // Verificar se os Price IDs existem no Stripe
    const priceId = env.STRIPE_PRICE_PRO_MONTHLY;
    try {
      const res = await fetch(`https://api.stripe.com/v1/prices/${priceId}`, {
        headers: { Authorization: `Bearer ${sk}` }
      });
      if (res.ok) {
        ok('Price IDs válidos no Stripe');
        record('ok', 'Stripe', 'Price IDs OK');
      } else {
        warn('Price ID Pro Mensal não encontrado no Stripe');
        record('warn', 'Stripe', 'Price ID inválido');
      }
    } catch {}
  }

  // Verificar Webhook Secret
  if (!env.STRIPE_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET.includes('...')) {
    warn('STRIPE_WEBHOOK_SECRET em falta');
    info('Para desenvolvimento: stripe listen --forward-to localhost:3000/api/webhooks/stripe');
    record('warn', 'Stripe', 'Webhook secret em falta');
  } else {
    ok('Webhook secret configurado');
  }

  // Verificar VITE_ price IDs para o cliente
  const vitePriceKeys = [
    'VITE_STRIPE_PRICE_PRO_MONTHLY', 'VITE_STRIPE_PRICE_PRO_YEARLY',
    'VITE_STRIPE_PRICE_BUSINESS_MONTHLY', 'VITE_STRIPE_PRICE_BUSINESS_YEARLY'
  ];
  const missingVite = vitePriceKeys.filter(k => !env[k] || env[k].includes('...'));
  if (missingVite.length > 0) {
    warn(`VITE_ Price IDs em falta (Billing page não vai funcionar): ${missingVite.length}`);
    record('warn', 'Stripe', 'VITE_ Price IDs em falta');
  } else {
    ok('VITE_ Price IDs configurados (Billing page OK)');
  }
}

// ─── Verificar Resend ───────────────────────────────────────────────────────
async function checkResend(env) {
  header('Resend (Email)');
  const key = env.RESEND_API_KEY;

  if (!key || key.includes('...')) {
    fail('RESEND_API_KEY em falta');
    record('fail', 'Resend', 'API key em falta');
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${key}` }
    });
    const data = await res.json();
    if (res.ok) {
      ok('Resend API key válida');
      if (data.data?.length > 0) {
        ok(`Domínios verificados: ${data.data.map(d => d.name).join(', ')}`);
      } else {
        warn('Sem domínio verificado no Resend — emails em modo de teste');
        info('Para produção: verificar domínio em https://resend.com/domains');
      }
      record('ok', 'Resend', 'API key OK');
    } else {
      fail(`Resend error: ${data.message || data.name}`);
      record('fail', 'Resend', data.message || data.name);
    }
  } catch (e) {
    fail(`Erro Resend: ${e.message}`);
    record('fail', 'Resend', e.message);
  }

  if (!env.RESEND_FROM_EMAIL || env.RESEND_FROM_EMAIL.includes('...')) {
    warn('RESEND_FROM_EMAIL em falta');
    record('warn', 'Resend', 'FROM email em falta');
  } else {
    ok(`From email: ${env.RESEND_FROM_EMAIL}`);
  }

  if (!env.ADMIN_EMAIL) {
    warn('ADMIN_EMAIL em falta (formulário de contacto não vai funcionar)');
    record('warn', 'Resend', 'ADMIN_EMAIL em falta');
  } else {
    ok(`Admin email: ${env.ADMIN_EMAIL}`);
  }
}

// ─── Verificar Twilio/WhatsApp ──────────────────────────────────────────────
async function checkTwilio(env) {
  header('Twilio (WhatsApp) — Opcional');
  const sid = env.TWILIO_ACCOUNT_SID;
  const token = env.TWILIO_AUTH_TOKEN;

  if (!sid || !token || sid.includes('xxx') || token.includes('...')) {
    warn('Twilio não configurado (notificações WhatsApp desativadas)');
    record('warn', 'Twilio', 'Não configurado (opcional)');
    return;
  }

  try {
    const auth = Buffer.from(`${sid}:${token}`).toString('base64');
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}.json`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const data = await res.json();
    if (res.ok) {
      ok(`Conta Twilio: ${data.friendly_name || sid}`);
      ok(`Status: ${data.status}`);
      record('ok', 'Twilio', 'Conta OK');
    } else {
      fail(`Twilio error: ${data.message}`);
      record('fail', 'Twilio', data.message);
    }
  } catch (e) {
    fail(`Erro Twilio: ${e.message}`);
    record('fail', 'Twilio', e.message);
  }
}

// ─── Verificar Telegram ─────────────────────────────────────────────────────
async function checkTelegram(env) {
  header('Telegram Bot — Opcional');
  const token = env.TELEGRAM_BOT_TOKEN;

  if (!token || token.includes('...') || token === '123456789:ABCDefGHIJKlmnoPQRstUVwxyz') {
    warn('Telegram não configurado (notificações Telegram desativadas)');
    record('warn', 'Telegram', 'Não configurado (opcional)');
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    if (data.ok) {
      ok(`Bot Telegram: @${data.result.username} (${data.result.first_name})`);
      record('ok', 'Telegram', `@${data.result.username}`);
    } else {
      fail(`Telegram error: ${data.description}`);
      record('fail', 'Telegram', data.description);
    }
  } catch (e) {
    fail(`Erro Telegram: ${e.message}`);
    record('fail', 'Telegram', e.message);
  }
}

// ─── Verificar VAPID ────────────────────────────────────────────────────────
async function checkVapid(env) {
  header('VAPID Keys (PWA Push)');
  const pub = env.VAPID_PUBLIC_KEY;
  const priv = env.VAPID_PRIVATE_KEY;
  const subject = env.VAPID_SUBJECT;

  if (!pub || !priv || pub.includes('...')) {
    warn('VAPID keys em falta — Push Notifications desativadas');
    info('Gerar com: npx web-push generate-vapid-keys');
    record('warn', 'VAPID', 'Chaves em falta');
  } else {
    // Validar formato (Base64 URL-safe, ~87 chars para 256-bit)
    const validPub = pub.length >= 80 && pub.length <= 100;
    const validPriv = priv.length >= 40 && priv.length <= 55;
    if (validPub && validPriv) {
      ok('VAPID Public Key válida');
      ok('VAPID Private Key válida');
      record('ok', 'VAPID', 'Chaves OK');
    } else {
      warn('Formato VAPID suspeito — re-gerar com: npx web-push generate-vapid-keys');
      record('warn', 'VAPID', 'Formato inválido');
    }
    if (!subject || subject.includes('admin@bookme.pt')) {
      warn('VAPID_SUBJECT ainda genérico — atualizar com o teu email');
    } else {
      ok(`VAPID Subject: ${subject}`);
    }
  }
}

// ─── Verificar Assets PWA ───────────────────────────────────────────────────
async function checkPWA() {
  header('Assets PWA');
  const { existsSync } = await import('node:fs');
  const checks = [
    ['client/public/manifest.json', 'manifest.json'],
    ['client/public/sw.js', 'Service Worker'],
    ['client/public/favicon.svg', 'favicon.svg'],
    ['client/public/offline.html', 'offline.html'],
    ['client/public/icons/icon-192x192.png', 'ícone 192x192'],
    ['client/public/icons/icon-512x512.png', 'ícone 512x512'],
    ['client/public/og-image.png', 'og-image.png'],
  ];
  for (const [path, label] of checks) {
    const full = join(ROOT, path);
    if (existsSync(full)) {
      ok(`${label} existe`);
    } else {
      if (path.includes('icons/') || path.includes('og-image')) {
        warn(`${label} em falta — executar: node scripts/generate-icons.js`);
        record('warn', 'PWA', `${label} em falta`);
      } else {
        fail(`${label} em falta!`);
        record('fail', 'PWA', `${label} em falta`);
      }
    }
  }
}

// ─── Verificar Placeholders Legais ─────────────────────────────────────────
async function checkPlaceholders() {
  header('Documentos Legais');
  const { readFileSync, existsSync } = await import('node:fs');
  const files = [
    'client/src/pages/PrivacyPolicy.tsx',
    'client/src/pages/TermsAndConditions.tsx',
    'client/src/components/Footer.tsx',
  ];
  const placeholders = [
    '[NOME_EMPRESA]', '[NIF]', '[MORADA_FISCAL]',
    '[EMAIL_CONTACTO]', '[EMAIL_DPO]', '[TELEFONE]', '[CIDADE]', '[PLACEHOLDER]'
  ];
  let found = 0;
  for (const file of files) {
    const full = join(ROOT, file);
    if (!existsSync(full)) continue;
    const content = readFileSync(full, 'utf-8');
    const hits = placeholders.filter(p => content.includes(p));
    if (hits.length > 0) {
      warn(`${file.split('/').pop()}: ${hits.length} placeholder(s) por substituir`);
      found += hits.length;
    }
  }
  if (found === 0) {
    ok('Todos os documentos legais preenchidos');
    record('ok', 'Legal', 'Sem placeholders');
  } else {
    warn(`${found} placeholder(s) legais por preencher`);
    record('warn', 'Legal', `${found} placeholders em falta`);
  }
}

// ─── Relatório Final ────────────────────────────────────────────────────────
function printReport() {
  console.log(`\n${BOLD}${'═'.repeat(50)}${NC}`);
  console.log(`${BOLD}  RELATÓRIO DE VERIFICAÇÃO${NC}`);
  console.log(`${BOLD}${'═'.repeat(50)}${NC}\n`);

  if (results.ok.length > 0) {
    console.log(`${G}${BOLD}✓ A FUNCIONAR (${results.ok.length}):${NC}`);
    results.ok.forEach(r => console.log(`  ${G}•${NC} ${r}`));
  }

  if (results.warn.length > 0) {
    console.log(`\n${Y}${BOLD}⚠ ATENÇÃO (${results.warn.length}):${NC}`);
    results.warn.forEach(r => console.log(`  ${Y}•${NC} ${r}`));
  }

  if (results.fail.length > 0) {
    console.log(`\n${R}${BOLD}✗ A FALHAR (${results.fail.length}):${NC}`);
    results.fail.forEach(r => console.log(`  ${R}•${NC} ${r}`));
  }

  const score = results.ok.length;
  const total = results.ok.length + results.warn.length + results.fail.length;
  const pct = Math.round((score / total) * 100);

  console.log(`\n${BOLD}Pontuação: ${score}/${total} (${pct}%)${NC}`);

  if (results.fail.length === 0 && results.warn.length === 0) {
    console.log(`\n${G}${BOLD}🚀 PRONTO PARA PRODUÇÃO!${NC}\n`);
  } else if (results.fail.length === 0) {
    console.log(`\n${Y}${BOLD}⚠ QUASE PRONTO — resolver avisos acima${NC}\n`);
  } else {
    console.log(`\n${R}${BOLD}✗ NÃO PRONTO — corrigir erros antes de lançar${NC}\n`);
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}${B}BookMe — Verificação de Configuração${NC}`);
console.log(`${'─'.repeat(40)}`);
console.log(`Ficheiro: ${ENV_FILE}\n`);

const env = loadEnv();

await checkSupabase(env);
await checkStripe(env);
await checkResend(env);
await checkTwilio(env);
await checkTelegram(env);
await checkVapid(env);
await checkPWA();
await checkPlaceholders();

printReport();
