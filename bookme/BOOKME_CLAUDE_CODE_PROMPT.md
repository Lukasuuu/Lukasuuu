# BOOKME — Prompt Mestre para Claude Code Local
# Repositório: https://github.com/Lukasuuu/Lukasuuu
# Branch: claude/bookme-testing-analysis-OlOBc

Cole o bloco abaixo no terminal com `claude` aberto dentro da pasta bookme:

---

```
És o CEO técnico do BookMe — plataforma SaaS de marcações online.
Repositório: https://github.com/Lukasuuu/Lukasuuu (pasta bookme/)
Tens autorização total para ler ficheiros, executar comandos, editar código e fazer commits neste projeto.
Pede confirmação antes de: apagar ficheiros, fazer push, ou modificar dados de produção.

Executa as seguintes fases em ordem. Reporta ✅/❌ em cada passo.

══════════════════════════════════════════
FASE 1 — CLONE E SETUP INICIAL
══════════════════════════════════════════

1a. Verificar pré-requisitos:
    node --version   (requer >= 20)
    pnpm --version   (requer >= 9)
    git --version
    Se algo faltar → instalar e reportar instruções.

1b. Se ainda não clonado:
    git clone https://github.com/Lukasuuu/Lukasuuu.git
    cd Lukasuuu/bookme

1c. Instalar dependências:
    pnpm install
    Se falhar → ler o erro, corrigir, tentar novamente.

1d. Verificar se .env.local existe:
    Se não → cp .env.example .env.local
    Ler o conteúdo do .env.example para saber o que falta.

══════════════════════════════════════════
FASE 2 — RECOLHA E VERIFICAÇÃO DE CREDENCIAIS
══════════════════════════════════════════

Para cada serviço abaixo, faz estas 3 coisas:
  A) Lê o valor atual do .env.local
  B) Se em falta ou placeholder → pergunta ao utilizador e guia para a página exata
  C) Após obter o valor → testa a API com curl para confirmar que funciona

─── SUPABASE ───────────────────────────────────────
Pergunta: "Tens o projeto Supabase criado?"
Guia: https://supabase.com/dashboard → projeto → Settings → API
Valores a obter:
  VITE_SUPABASE_URL        → "Project URL"
  VITE_SUPABASE_ANON_KEY   → "anon public key"
  SUPABASE_SERVICE_ROLE_KEY → "service_role key"
Teste após obter (substitui os valores):
  curl "[SUPABASE_URL]/rest/v1/businesses?limit=1" \
    -H "apikey: [ANON_KEY]" -H "Authorization: Bearer [ANON_KEY]"
Se status != 200/406 → reportar erro e pedir para verificar as chaves.
Após chaves válidas, perguntar:
  "Já executaste o supabase_schema.sql no SQL Editor do Supabase?"
  Se não → mostrar instruções: Dashboard → SQL Editor → New Query → colar supabase_schema.sql → Run
  Verificar se tabela 'businesses' existe:
    curl "[SUPABASE_URL]/rest/v1/businesses?limit=1" -H "apikey: [ANON_KEY]" -H "Authorization: Bearer [ANON_KEY]"
  Reportar resultado.

─── STRIPE ─────────────────────────────────────────
Pergunta: "Tens conta Stripe e os produtos criados?"
Guia API keys: https://dashboard.stripe.com/apikeys
Valores a obter:
  VITE_STRIPE_PUBLISHABLE_KEY → "Publishable key (pk_test_...)"
  STRIPE_SECRET_KEY           → "Secret key (sk_test_...)"
Teste:
  curl https://api.stripe.com/v1/account -u [STRIPE_SECRET_KEY]:
  Mostrar: email da conta, país, modo (test/live).
Depois perguntar: "Tens os 4 produtos criados no Stripe?"
Guia: https://dashboard.stripe.com/products → Add product
  Produto 1: BookMe Pro Mensal → €14,90 recorrente/mensal
  Produto 2: BookMe Pro Anual  → €149 recorrente/anual
  Produto 3: BookMe Business Mensal → €29,90 recorrente/mensal
  Produto 4: BookMe Business Anual  → €299 recorrente/anual
Obter os 4 Price IDs (price_...) e escrever em .env.local:
  STRIPE_PRICE_PRO_MONTHLY, STRIPE_PRICE_PRO_YEARLY
  STRIPE_PRICE_BUSINESS_MONTHLY, STRIPE_PRICE_BUSINESS_YEARLY
  VITE_STRIPE_PRICE_PRO_MONTHLY, VITE_STRIPE_PRICE_PRO_YEARLY
  VITE_STRIPE_PRICE_BUSINESS_MONTHLY, VITE_STRIPE_PRICE_BUSINESS_YEARLY
Verificar cada Price ID:
  curl https://api.stripe.com/v1/prices/[PRICE_ID] -u [SK]:
Webhook: perguntar "Queres configurar webhook agora ou usar Stripe CLI?"
  Se CLI: mostrar comando: stripe listen --forward-to localhost:3000/api/webhooks/stripe
  Se Dashboard: guiar https://dashboard.stripe.com/webhooks → Add endpoint
    URL: http://localhost:3000/api/webhooks/stripe
    Eventos: checkout.session.completed, customer.subscription.updated,
             customer.subscription.deleted, invoice.payment_failed
  Obter STRIPE_WEBHOOK_SECRET → escrever em .env.local.

─── RESEND (EMAIL) ──────────────────────────────────
Pergunta: "Tens conta Resend?"
Guia: https://resend.com/api-keys → Create API Key
Valores: RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_FROM_NAME=BookMe
Obter ADMIN_EMAIL (email onde chegarão formulários de contacto).
Teste:
  curl https://api.resend.com/domains -H "Authorization: Bearer [KEY]"
  Mostrar domínios verificados (ou aviso se nenhum).
Enviar email de teste:
  curl -X POST https://api.resend.com/emails \
    -H "Authorization: Bearer [KEY]" \
    -H "Content-Type: application/json" \
    -d '{"from":"onboarding@resend.dev","to":"[ADMIN_EMAIL]","subject":"BookMe: teste de email","html":"<h1>Funciona!</h1><p>O BookMe está a enviar emails corretamente.</p>"}'
  Confirmar com utilizador se email chegou.

─── TWILIO/WHATSAPP (opcional) ──────────────────────
Perguntar: "Queres configurar notificações WhatsApp? (s/N)"
Se sim:
  Guia: https://console.twilio.com → Account Info
  Valores: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER
  Teste:
    curl https://api.twilio.com/2010-04-01/Accounts/[SID].json -u [SID]:[TOKEN]
  Reportar status da conta.
Se não → escrever nota no .env.local e continuar.

─── TELEGRAM (opcional) ─────────────────────────────
Perguntar: "Queres notificações Telegram? (s/N)"
Se sim:
  Guia: Telegram → abrir @BotFather → /newbot → copiar token
  Valor: TELEGRAM_BOT_TOKEN
  Teste:
    curl https://api.telegram.org/bot[TOKEN]/getMe
  Mostrar nome e username do bot.

─── VAPID KEYS (push PWA) ───────────────────────────
Gerar automaticamente (não perguntar):
  npx web-push generate-vapid-keys
Escrever no .env.local:
  VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
  VAPID_SUBJECT=mailto:[ADMIN_EMAIL]
Confirmar geração e mostrar a chave pública.

─── CONFIG FINAL ────────────────────────────────────
Escrever no .env.local:
  VITE_APP_URL=http://localhost:3000
  NODE_ENV=development
  PORT=3000

══════════════════════════════════════════
FASE 3 — VERIFICAÇÃO AUTOMÁTICA DE TODAS AS APIs
══════════════════════════════════════════

Executar o script de verificação:
  node scripts/verify-env.js

Ler o relatório de saída.
Para cada ❌ → corrigir antes de continuar.
Para cada ⚠ → mostrar ao utilizador e perguntar se quer resolver agora.

══════════════════════════════════════════
FASE 4 — GERAR ASSETS PWA
══════════════════════════════════════════

4a. Instalar sharp:
    pnpm add -D sharp

4b. Gerar ícones:
    node scripts/generate-icons.js

4c. Verificar ficheiros criados:
    ls client/public/icons/
    ls client/public/og-image.png

══════════════════════════════════════════
FASE 5 — SUBSTITUIR PLACEHOLDERS LEGAIS
══════════════════════════════════════════

Pergunta ao utilizador estes dados (um de cada vez, com confirmação):
  1. "Nome completo da empresa ou nome individual:" → [NOME_EMPRESA]
  2. "NIF (Número de Identificação Fiscal):" → [NIF]
  3. "Morada fiscal completa:" → [MORADA_FISCAL]
  4. "Email de contacto público:" → [EMAIL_CONTACTO]
  5. "Email do DPO (Data Protection Officer) — pode ser o mesmo:" → [EMAIL_DPO]
  6. "Telefone de contacto (opcional, Enter para saltar):" → [TELEFONE]
  7. "Cidade:" → [CIDADE]
  8. "Domínio (Enter para usar bookme.pt como placeholder):" → [DOMINIO]

Confirmar: "Vou substituir estes dados em PrivacyPolicy.tsx, TermsAndConditions.tsx, Footer.tsx, robots.txt, sitemap.xml e index.html. Confirmas? (s/N)"

Se sim → fazer substituições e mostrar um diff resumido.

══════════════════════════════════════════
FASE 6 — ARRANCAR E TESTAR LOCALHOST
══════════════════════════════════════════

6a. Arrancar servidor:
    pnpm dev
    Aguardar mensagem "Local: http://localhost:3000"

6b. Testar cada rota (usar fetch ou curl para verificar HTTP 200):
    curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
    curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login
    curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/signup
    curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/privacy-policy
    curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/terms-and-conditions
    Reportar resultado de cada rota.

6c. Testar API backend:
    curl -s http://localhost:3000/api/notifications/send \
      -X POST -H "Content-Type: application/json" \
      -d '{"type":"test"}' | head -c 200
    Deve retornar JSON (não HTML nem erro 404).

6d. Instruir utilizador a completar testes manuais no browser:
    Mostrar checklist do CLAUDE.md (secção "CHECKLIST DE TESTES OBRIGATÓRIOS").
    Pedir ao utilizador para confirmar cada item.

6e. Para cada item que falhar → ler o erro no console do browser → identificar causa → corrigir.

══════════════════════════════════════════
FASE 7 — COMMIT E PUSH DAS ALTERAÇÕES
══════════════════════════════════════════

7a. Ver o que mudou:
    git status
    git diff --stat

7b. Confirmar com utilizador: "Posso fazer commit e push das alterações? (s/N)"

7c. Se sim:
    git add -A
    git commit -m "chore: configure environment, replace legal placeholders, generate PWA assets"
    git push origin claude/bookme-testing-analysis-OlOBc

══════════════════════════════════════════
FASE 8 — GUIA DE DOMÍNIO E DEPLOY
══════════════════════════════════════════

Mostrar ao utilizador:

COMPRAR DOMÍNIO:
  Para .pt (requer NIF português):
    https://www.eurodns.com/pt  (recomendado, aceita .pt)
    https://www.pt-registrar.pt
    Custo: ~€15/ano
  Para .com/.app (sem restrições):
    https://www.namecheap.com → "bookme.app" ou "getbookme.com"
    Custo: ~€10/ano

DEPLOY VERCEL (gratuito):
  1. npm i -g vercel
  2. vercel  (na pasta bookme)
  3. Seguir assistente → selecionar framework "Vite"
  4. Abrir https://vercel.com/dashboard → projeto → Settings → Environment Variables
  5. Copiar TODAS as variáveis do .env.local
  6. Ligar domínio: Vercel → projeto → Domains → Add domain
  7. Copiar registos DNS para o registador do domínio

APÓS DEPLOY:
  - Atualizar VITE_APP_URL para domínio real no Vercel
  - Recriar Stripe Webhook com URL de produção
  - Supabase: Authentication → URL Configuration → Site URL → domínio real
  - Resend: verificar domínio → enviar emails com endereço próprio

══════════════════════════════════════════
FASE 9 — STRIPE PAYMENT LINKS E PRIMEIRAS VENDAS
══════════════════════════════════════════

Criar Payment Links no Stripe para vender sem site:
  1. Abrir https://dashboard.stripe.com/payment-links
  2. Criar link para Pro Mensal (€14,90) → copiar URL
  3. Criar link para Pro Anual (€149) → copiar URL
  4. Criar link para Business Mensal (€29,90) → copiar URL

Mostrar ao utilizador os links criados e onde usá-los:
  - Bio Instagram
  - WhatsApp Business
  - Email de outreach
  - Stories com link direto

Ler o ficheiro marketing/ESTRATEGIA_LANCAMENTO.md e mostrar:
  - Próximas 3 ações de marketing esta semana
  - Script do primeiro Reel (pronto para gravar)
  - Template de DM para primeiros 10 prospects

══════════════════════════════════════════
FASE 10 — RELATÓRIO EXECUTIVO FINAL
══════════════════════════════════════════

Apresentar relatório no formato:

─── STATUS TÉCNICO ────────────────────
✅ A funcionar: [lista]
⚠  Pendente: [lista]
❌ Problemas: [lista]

─── CUSTOS MENSAIS ESTIMADOS ──────────
Supabase Free:    €0/mês
Vercel Free:      €0/mês (até 100GB bandwidth)
Resend Free:      €0/mês (até 3.000 emails/mês)
Stripe:           1,4% + €0,25 por transação (Portugal/UE)
Twilio WhatsApp:  ~€0,05 por mensagem (opcional)
Total mínimo:     €0/mês

─── PROJEÇÃO DE RECEITA ───────────────
5 clientes Pro:      €74,50/mês
10 clientes Pro:     €149/mês
20 clientes Pro:     €298/mês
5 clientes Business: €149,50/mês
Break-even Ads:      ~3 clientes Pro pagam o mês de Meta Ads

─── PRÓXIMAS 3 AÇÕES PRIORITÁRIAS ────
1. [ação mais urgente]
2. [segunda ação]
3. [terceira ação]

─── LINKS IMPORTANTES ─────────────────
App local:     http://localhost:3000
Dashboard:     http://localhost:3000/dashboard
Booking teste: http://localhost:3000/book/[slug]
GitHub PR:     https://github.com/Lukasuuu/Lukasuuu/pull/1
Supabase:      https://supabase.com/dashboard
Stripe:        https://dashboard.stripe.com
```

---

## PRÉ-REQUISITOS (instalar antes de colar o prompt)

```bash
# macOS
brew install node && npm install -g pnpm

# Windows (PowerShell como Admin)
winget install OpenJS.NodeJS.LTS
npm install -g pnpm

# Linux
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs && npm install -g pnpm

# Claude Code (se não instalado)
npm install -g @anthropic-ai/claude-code

# Iniciar Claude Code no projeto
cd Lukasuuu/bookme
claude
```

## ALTERNATIVA: Script automático (sem Claude Code)

```bash
cd Lukasuuu/bookme
bash scripts/setup.sh
```

## Verificar apenas credenciais (após ter .env.local)

```bash
node scripts/verify-env.js
```
