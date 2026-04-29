# BookMe — Guia Completo para Claude Code

> **Papel:** Age como CEO técnico desta aplicação SaaS de agendamentos. O teu trabalho é implementar, testar, lançar e comercializar o BookMe em Portugal de forma profissional e legal.

---

## CONTEXTO DO PRODUTO

**BookMe** é uma plataforma SaaS de marcações online (salões, clínicas, restaurantes, etc.) com:
- Planos: Grátis (€0), Pro (€14,90/mês), Business (€29,90/mês)
- Stack: React 19 + Vite + TypeScript + TailwindCSS v4 + Express.js + Supabase + Stripe
- Package manager: **pnpm**
- Dev server: `pnpm dev` (porta 3000)
- Build: `pnpm build`

---

## FASE 1 — SETUP LOCAL (fazer primeiro)

### 1.1 Verificar pré-requisitos
```bash
node --version    # deve ser >= 20
pnpm --version    # deve ser >= 9
git --version
```
Se algo falhar, instalar antes de continuar.

### 1.2 Instalar dependências
```bash
cd bookme
pnpm install
```

### 1.3 Configurar variáveis de ambiente
Copiar `.env.example` para `.env.local` e preencher cada variável.
**Perguntar ao utilizador cada valor em falta** (ver lista abaixo).

```bash
cp .env.example .env.local
```

---

## VARIÁVEIS OBRIGATÓRIAS — Perguntar ao utilizador

Quando o utilizador não souber o valor, aceder à página indicada e guiá-lo passo a passo.

### SUPABASE (base de dados)
| Variável | Como obter |
|---|---|
| `VITE_SUPABASE_URL` | https://supabase.com/dashboard → projeto → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | mesma página → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | mesma página → service_role key (secreto) |

**Após obter as chaves, executar o schema SQL:**
```bash
# Abrir Supabase Dashboard → SQL Editor → colar conteúdo de supabase_schema.sql → Run
```
Verificar se todas as tabelas foram criadas: businesses, profiles, staff, services, clients, bookings, notifications, subscriptions, push_subscriptions.

### STRIPE (pagamentos)
| Variável | Como obter |
|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | https://dashboard.stripe.com/apikeys → Publishable key |
| `STRIPE_SECRET_KEY` | mesma página → Secret key |
| `STRIPE_WEBHOOK_SECRET` | https://dashboard.stripe.com/webhooks → criar webhook para `/api/webhooks/stripe` com eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed` |

**Criar produtos no Stripe:**
1. https://dashboard.stripe.com/products → Add product
2. **Pro Mensal**: €14,90/mês → copiar Price ID → `STRIPE_PRICE_PRO_MONTHLY` e `VITE_STRIPE_PRICE_PRO_MONTHLY`
3. **Pro Anual**: €149/ano → `STRIPE_PRICE_PRO_YEARLY` e `VITE_STRIPE_PRICE_PRO_YEARLY`
4. **Business Mensal**: €29,90/mês → `STRIPE_PRICE_BUSINESS_MONTHLY` e `VITE_STRIPE_PRICE_BUSINESS_MONTHLY`
5. **Business Anual**: €299/ano → `STRIPE_PRICE_BUSINESS_YEARLY` e `VITE_STRIPE_PRICE_BUSINESS_YEARLY`

### EMAIL — Resend
| Variável | Como obter |
|---|---|
| `RESEND_API_KEY` | https://resend.com/api-keys → Create API Key |
| `RESEND_FROM_EMAIL` | Após verificar domínio no Resend (pode usar onboarding@resend.dev para testes) |
| `RESEND_FROM_NAME` | `BookMe` |

### NOTIFICAÇÕES — WhatsApp Twilio
| Variável | Como obter |
|---|---|
| `TWILIO_ACCOUNT_SID` | https://console.twilio.com → Account Info |
| `TWILIO_AUTH_TOKEN` | mesma página |
| `TWILIO_WHATSAPP_NUMBER` | https://console.twilio.com/us1/develop/sms/senders/whatsapp-senders |

### NOTIFICAÇÕES — Telegram
| Variável | Como obter |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Telegram → @BotFather → /newbot → copiar token |

### PWA — Web Push (VAPID)
```bash
# Gerar chaves VAPID automaticamente:
npx web-push generate-vapid-keys
# Copiar VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY para .env.local
```
`VAPID_SUBJECT=mailto:admin@bookme.pt`

### ADMINISTRAÇÃO
| Variável | Valor |
|---|---|
| `ADMIN_EMAIL` | email do administrador para receber contactos |
| `VITE_APP_URL` | `http://localhost:3000` (mudar para domínio real depois) |

---

## FASE 2 — TESTAR LOCALHOST

### 2.1 Arrancar a aplicação
```bash
pnpm dev
```
Abrir http://localhost:3000

### 2.2 Lista de testes a executar (verificar cada um)

#### Landing page
- [ ] Página carrega sem erros no console
- [ ] Secção Hero com CTA "Começar Grátis" visível
- [ ] Pricing com IVA incluído visível
- [ ] Footer com Livro de Reclamações, ODR, Cookies
- [ ] Cookie banner aparece na primeira visita

#### Auth
- [ ] Criar conta em /signup (com email real)
- [ ] Verificar email chegou (Resend)
- [ ] Login com as credenciais em /login
- [ ] Onboarding Wizard aparece após primeiro login
- [ ] Wizard guarda negócio, serviço e staff no Supabase

#### Dashboard
- [ ] Dashboard carrega com métricas
- [ ] Calendário mostra marcações (ou vazio)
- [ ] Serviços → criar serviço novo → aparece na lista
- [ ] Staff → criar membro → aparece na lista
- [ ] Clientes → criar cliente → aparece na lista
- [ ] Configurações → guardar dados do negócio → toast de sucesso

#### Marcações públicas
- [ ] Aceder a http://localhost:3000/book/[slug-do-negocio]
- [ ] Selecionar serviço → profissional → data → hora disponível
- [ ] Confirmar marcação → aparece no dashboard

#### Faturação
- [ ] /dashboard/billing carrega com plano atual
- [ ] Botão upgrade → redireciona para Stripe Checkout (modo teste)
- [ ] Stripe Checkout abre com preço correto
- [ ] Usar cartão teste `4242 4242 4242 4242` exp qualquer CVV 123
- [ ] Após pagamento → plano atualizado no dashboard

#### Relatórios
- [ ] /dashboard/reports carrega gráficos
- [ ] Gráfico de marcações por dia visível
- [ ] Relatórios avançados bloqueados no plano free

### 2.3 Testar notificações
```bash
# Testar email de confirmação via API:
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"type":"confirmation","booking":{"client":{"name":"Teste","email":"[SEU_EMAIL]"},"service":{"name":"Corte"},"staff":{"name":"João"},"booking_date":"2026-05-01","start_time":"10:00","business":{"name":"Salão Teste"}}}'
```

### 2.4 Verificar Stripe Webhook local
```bash
# Instalar Stripe CLI para testar webhooks localmente:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## FASE 3 — GERAR ASSETS PWA

```bash
# Instalar sharp para gerar ícones PNG:
pnpm add -D sharp
# Executar script de geração:
node scripts/generate-icons.js
```

---

## FASE 4 — DOMÍNIO E DEPLOY

### 4.1 Comprar domínio (guia)
**Recomendação para Portugal:** https://www.namecheap.com ou https://www.eurodns.com
- Pesquisar: `bookme.pt` (domínio .pt — NIC.PT via registar acreditado)
- Alternativa internacional: `getbookme.com` ou `bookme.app`
- **Custo estimado:** €8–€15/ano

**Registadores .pt acreditados:**
- https://www.namecheap.com (aceita .pt via EuroDNS)
- https://www.sapo.pt/dominios
- https://www.pt-registrar.pt

### 4.2 Deploy no Vercel (gratuito para começar)
```bash
# Instalar Vercel CLI:
npm i -g vercel

# Na pasta do projeto:
vercel

# Configurar variáveis de ambiente no Vercel Dashboard:
# https://vercel.com/[projeto]/settings/environment-variables
# Copiar todas as variáveis do .env.local
```

**Após deploy:**
1. Configurar domínio no Vercel Dashboard → Domains → Add
2. Apontar DNS do registrador para Vercel (CNAME: cname.vercel-dns.com)
3. Atualizar `VITE_APP_URL` para o domínio real
4. Atualizar `RESEND_FROM_EMAIL` com domínio verificado
5. Recriar Stripe Webhook para URL de produção
6. Atualizar Supabase Auth → URL Configuration com domínio real

---

## FASE 5 — MARKETING E PRIMEIRAS VENDAS

Ver ficheiro `marketing/ESTRATEGIA_LANCAMENTO.md` para o plano completo.

### Resumo executivo:
1. **Semana 1-2:** Conteúdo orgânico (3 posts/dia Instagram + LinkedIn)
2. **Semana 3:** Ativar Meta Ads com €5/dia
3. **Semana 4:** Fechar primeiras 10 vendas

---

## COMANDOS ÚTEIS

```bash
pnpm dev          # Desenvolvimento
pnpm build        # Build de produção
pnpm check        # Verificar TypeScript
pnpm format       # Formatar código

# Ver logs do servidor:
# O servidor corre integrado com o Vite em dev mode

# Reset da base de dados (cuidado!):
# Supabase Dashboard → SQL Editor → DROP TABLE ... (ou usar Table Editor)
```

---

## ESTRUTURA DO PROJETO

```
bookme/
├── client/src/
│   ├── pages/          # Todas as páginas (Dashboard, Calendar, etc.)
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # AuthContext, OnboardingContext, ThemeContext
│   ├── hooks/          # usePlan, useAuth
│   └── lib/supabase.ts # Cliente Supabase e tipos TypeScript
├── server/
│   ├── index.ts        # Servidor Express com todas as rotas API
│   └── services/       # emailService, whatsappService, telegramService
├── scripts/            # Scripts de setup e geração de assets
├── marketing/          # Templates de conteúdo e estratégia
├── supabase_schema.sql # Schema completo da base de dados
└── .env.example        # Template de variáveis de ambiente
```

---

## CHECKLIST DE LANÇAMENTO LEGAL (Portugal)

- [ ] NIF da empresa registado
- [ ] Livro de Reclamações Eletrónico ativo (livroreclamacoes.pt)
- [ ] Política de Privacidade RGPD atualizada com dados reais (substituir [PLACEHOLDER])
- [ ] Termos e Condições com NIF e morada real
- [ ] IVA 23% indicado em todos os preços
- [ ] Direito de arrependimento 14 dias (Decreto-Lei 24/2014) — já implementado
- [ ] Cookie consent RGPD — já implementado
- [ ] Registo CNPD se processar dados pessoais em larga escala (verificar limiar)
- [ ] Conta bancária empresarial para receber pagamentos Stripe

---

## CONTACTOS E RECURSOS

| Serviço | Dashboard |
|---|---|
| Supabase | https://supabase.com/dashboard |
| Stripe | https://dashboard.stripe.com |
| Resend | https://resend.com/dashboard |
| Twilio | https://console.twilio.com |
| Vercel | https://vercel.com/dashboard |
| Meta Ads | https://business.facebook.com |
