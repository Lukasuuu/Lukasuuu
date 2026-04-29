# BookMe — Guia Completo para Claude Code

> **Papel:** Age como CEO técnico desta aplicação SaaS de agendamentos.
> Implementa, testa, lança e comercializa o BookMe em Portugal de forma profissional e legal.
> Pede confirmação antes de qualquer ação destrutiva ou irreversível.

---

## REPOSITÓRIO

```
GitHub:  https://github.com/Lukasuuu/Lukasuuu
Branch:  claude/bookme-testing-analysis-OlOBc
PR #1:   https://github.com/Lukasuuu/Lukasuuu/pull/1
Clone:   git clone https://github.com/Lukasuuu/Lukasuuu.git
Pasta:   Lukasuuu/bookme/
```

---

## STACK TÉCNICA

| Componente | Tecnologia |
|---|---|
| Frontend | React 19 + Vite + TypeScript + TailwindCSS v4 |
| Backend | Express.js (server/index.ts) |
| Base de dados | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| Pagamentos | Stripe (Checkout + Webhooks + Portal) |
| Email | Resend API |
| WhatsApp | Twilio API |
| Telegram | Telegram Bot API |
| Push | Web Push (VAPID) |
| Deploy | Vercel |
| Package Manager | **pnpm** (obrigatório) |
| Porta dev | 3000 |

---

## COMANDOS ESSENCIAIS

```bash
pnpm install          # Instalar dependências
pnpm dev              # Servidor de desenvolvimento (porta 3000)
pnpm build            # Build de produção
pnpm check            # Verificar TypeScript
pnpm format           # Formatar código

# Verificar todas as credenciais e APIs:
node scripts/verify-env.js

# Gerar ícones PWA (requer: pnpm add -D sharp):
node scripts/generate-icons.js

# Setup interativo completo:
bash scripts/setup.sh
```

---

## ESTRUTURA DO PROJETO

```
bookme/
├── client/
│   ├── index.html                    # HTML principal (PWA meta tags, JSON-LD SEO)
│   ├── public/
│   │   ├── manifest.json             # PWA manifest
│   │   ├── sw.js                     # Service Worker
│   │   ├── favicon.svg               # Logo (B gradiente azul/cyan)
│   │   ├── offline.html              # Página offline
│   │   └── icons/                    # PNGs gerados por scripts/generate-icons.js
│   └── src/
│       ├── App.tsx                   # Router + Providers
│       ├── main.tsx                  # Entry point + SW registration
│       ├── pages/
│       │   ├── Home.tsx              # Landing page
│       │   ├── Dashboard.tsx         # Métricas principais
│       │   ├── Calendar.tsx          # Calendário de marcações
│       │   ├── Clients.tsx           # CRM clientes (CRUD completo)
│       │   ├── Services.tsx          # Gestão de serviços (CRUD completo)
│       │   ├── Staff.tsx             # Gestão de staff (CRUD completo)
│       │   ├── Settings.tsx          # Configurações do negócio
│       │   ├── Billing.tsx           # Planos e pagamentos Stripe
│       │   ├── Reports.tsx           # Relatórios e gráficos
│       │   ├── PublicBooking.tsx     # Página pública de marcações (/book/:slug)
│       │   ├── PrivacyPolicy.tsx     # Política de Privacidade RGPD
│       │   ├── TermsAndConditions.tsx # Termos e Condições
│       │   ├── About.tsx             # Sobre nós
│       │   └── Contact.tsx           # Formulário de contacto
│       ├── components/
│       │   ├── DashboardLayout.tsx   # Layout sidebar + header
│       │   ├── OnboardingWizard.tsx  # Wizard 5 passos (guarda no DB)
│       │   ├── PlanGate.tsx          # Bloqueia features por plano
│       │   ├── CookieConsent.tsx     # Banner RGPD (Essencial/Analytics/Marketing)
│       │   ├── Navbar.tsx            # Navbar landing
│       │   ├── Hero.tsx              # Hero section
│       │   ├── Pricing.tsx           # Tabela de preços + IVA
│       │   └── Footer.tsx            # Footer com dados legais
│       ├── contexts/
│       │   ├── AuthContext.tsx        # Auth + profile + business
│       │   ├── OnboardingContext.tsx  # Estado do wizard
│       │   └── ThemeContext.tsx       # Dark/light mode
│       ├── hooks/
│       │   └── usePlan.ts            # Feature gating por plano
│       └── lib/
│           └── supabase.ts           # Cliente Supabase + tipos TypeScript
├── server/
│   ├── index.ts                      # Express: API routes + Stripe webhooks
│   └── services/
│       ├── emailService.ts           # Emails via Resend
│       ├── whatsappService.ts        # WhatsApp via Twilio
│       └── telegramService.ts        # Notificações Telegram
├── scripts/
│   ├── setup.sh                      # Setup interativo completo
│   ├── verify-env.js                 # Verificação de todas as credenciais
│   └── generate-icons.js             # Geração de ícones PWA
├── marketing/
│   └── ESTRATEGIA_LANCAMENTO.md     # Plano de 30 dias + scripts prontos
├── supabase_schema.sql               # Schema completo da base de dados
├── .env.example                      # Template de variáveis de ambiente
├── CLAUDE.md                         # Este ficheiro
└── BOOKME_CLAUDE_CODE_PROMPT.md      # Prompt mestre para Claude Code local
```

---

## VARIÁVEIS DE AMBIENTE — GUIA COMPLETO

### Ficheiro: `.env.local` (nunca commitar)

---

### SUPABASE

| Variável | Descrição | Onde obter |
|---|---|---|
| `VITE_SUPABASE_URL` | URL do projeto | Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Chave pública | Dashboard → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave secreta servidor | Dashboard → Settings → API → service_role |

**URL Dashboard:** https://supabase.com/dashboard  
**Passos:**
1. Login → selecionar projeto
2. Settings (engrenagem) → API
3. Copiar "Project URL" → `VITE_SUPABASE_URL`
4. Copiar "anon public" → `VITE_SUPABASE_ANON_KEY`
5. Copiar "service_role" → `SUPABASE_SERVICE_ROLE_KEY`

**Schema SQL:** Executar `supabase_schema.sql` no SQL Editor do projeto  
→ Dashboard → SQL Editor → New query → colar conteúdo → Run

**Tabelas criadas:** businesses, profiles, staff, services, clients, bookings, notifications, subscriptions, push_subscriptions

**Verificar conexão:**
```bash
curl "https://[PROJECT_URL]/rest/v1/businesses?limit=1" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ANON_KEY]"
```

---

### STRIPE

| Variável | Descrição | Onde obter |
|---|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Chave pública frontend | Dashboard → Developers → API keys |
| `STRIPE_SECRET_KEY` | Chave secreta backend | Mesma página |
| `STRIPE_WEBHOOK_SECRET` | Secret do webhook | Dashboard → Webhooks → endpoint |
| `STRIPE_PRICE_PRO_MONTHLY` | Price ID Pro €14,90/mês | Dashboard → Products → Pro Mensal |
| `STRIPE_PRICE_PRO_YEARLY` | Price ID Pro €149/ano | Dashboard → Products → Pro Anual |
| `STRIPE_PRICE_BUSINESS_MONTHLY` | Price ID Business €29,90/mês | Dashboard → Products → Business Mensal |
| `STRIPE_PRICE_BUSINESS_YEARLY` | Price ID Business €299/ano | Dashboard → Products → Business Anual |
| `VITE_STRIPE_PRICE_PRO_MONTHLY` | Mesmo que acima (frontend) | Cópia do anterior |
| `VITE_STRIPE_PRICE_PRO_YEARLY` | Mesmo que acima (frontend) | Cópia do anterior |
| `VITE_STRIPE_PRICE_BUSINESS_MONTHLY` | Mesmo que acima (frontend) | Cópia do anterior |
| `VITE_STRIPE_PRICE_BUSINESS_YEARLY` | Mesmo que acima (frontend) | Cópia do anterior |

**URL Dashboard:** https://dashboard.stripe.com  
**Criar produtos:**
1. Dashboard → Products → Add product
2. Nome: "BookMe Pro" | Preço: €14,90 | Recorrente: Mensal → copiar Price ID
3. Mesmo produto, Add another price: €149 | Anual → copiar Price ID
4. Repetir para "BookMe Business" (€29,90/mês + €299/ano)

**Webhook para dev local:**
```bash
# Instalar Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copiar o "webhook signing secret" para STRIPE_WEBHOOK_SECRET
```

**Webhook para produção:**
→ Dashboard → Developers → Webhooks → Add endpoint  
→ URL: `https://[dominio]/api/webhooks/stripe`  
→ Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

**Verificar chaves:**
```bash
curl https://api.stripe.com/v1/account \
  -u [STRIPE_SECRET_KEY]:
```

**Cartão de teste:** `4242 4242 4242 4242` | data futura | CVV `123`

---

### RESEND (Email)

| Variável | Descrição | Onde obter |
|---|---|---|
| `RESEND_API_KEY` | API Key | https://resend.com/api-keys → Create API Key |
| `RESEND_FROM_EMAIL` | Email remetente | Domínio verificado no Resend |
| `RESEND_FROM_NAME` | Nome remetente | `BookMe` |
| `ADMIN_EMAIL` | Email administrador | Email pessoal/empresa |

**URL Dashboard:** https://resend.com/dashboard  
**Para testes sem domínio:** usar `onboarding@resend.dev` em `RESEND_FROM_EMAIL`  
**Para produção:** verificar domínio → Dashboard → Domains → Add domain

**Verificar chave:**
```bash
curl https://api.resend.com/domains \
  -H "Authorization: Bearer [RESEND_API_KEY]"
```

**Enviar email de teste:**
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer [RESEND_API_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"from":"onboarding@resend.dev","to":"[SEU_EMAIL]","subject":"Teste BookMe","html":"<p>Funciona!</p>"}'
```

---

### TWILIO (WhatsApp) — Opcional

| Variável | Descrição | Onde obter |
|---|---|---|
| `TWILIO_ACCOUNT_SID` | Account SID | https://console.twilio.com → Account Info |
| `TWILIO_AUTH_TOKEN` | Auth Token | Mesma página |
| `TWILIO_WHATSAPP_NUMBER` | Número WhatsApp | Console → WhatsApp Senders (sandbox: +14155552671) |

**URL Console:** https://console.twilio.com  
**Para testes:** usar sandbox WhatsApp gratuito  
→ Console → Messaging → Try it Out → Send a WhatsApp Message

**Verificar:**
```bash
curl -X GET https://api.twilio.com/2010-04-01/Accounts/[SID].json \
  -u [SID]:[AUTH_TOKEN]
```

---

### TELEGRAM BOT — Opcional

| Variável | Descrição | Onde obter |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Token do bot | Telegram → @BotFather → /newbot |

**Criar bot:**
1. Abrir Telegram → pesquisar @BotFather
2. Enviar `/newbot`
3. Escolher nome: "BookMe Notifications"
4. Escolher username: `bookme_notifications_bot`
5. Copiar token fornecido

**Verificar:**
```bash
curl https://api.telegram.org/bot[TOKEN]/getMe
```

---

### VAPID (Push Notifications PWA)

| Variável | Descrição |
|---|---|
| `VAPID_PUBLIC_KEY` | Chave pública (exposta no frontend) |
| `VAPID_PRIVATE_KEY` | Chave privada (secreta) |
| `VAPID_SUBJECT` | Contact email: `mailto:admin@bookme.pt` |

**Gerar automaticamente:**
```bash
npx web-push generate-vapid-keys
```

---

### ANALYTICS (Opcional)

| Variável | Descrição | Onde obter |
|---|---|---|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 ID | https://analytics.google.com → Admin → Property → Data Streams |
| `VITE_FB_PIXEL_ID` | Facebook Pixel ID | https://business.facebook.com → Events Manager |

---

### APP CONFIG

| Variável | Dev | Produção |
|---|---|---|
| `VITE_APP_URL` | `http://localhost:3000` | `https://bookme.pt` |
| `VITE_APP_TITLE` | `BookMe` | `BookMe` |
| `NODE_ENV` | `development` | `production` |
| `PORT` | `3000` | automático (Vercel) |

---

## ROTAS DA APLICAÇÃO

### Públicas
| Rota | Componente | Descrição |
|---|---|---|
| `/` | Home | Landing page |
| `/login` | Login | Login |
| `/signup` | Signup | Registo (com termos obrigatórios) |
| `/book/:slug` | PublicBooking | Marcação pública do negócio |
| `/about` | About | Sobre nós |
| `/contact` | Contact | Formulário de contacto |
| `/privacy-policy` | PrivacyPolicy | Política de Privacidade RGPD |
| `/terms-and-conditions` | TermsAndConditions | Termos e Condições |
| `/checkout/success` | CheckoutSuccess | Confirmação de pagamento |
| `/checkout/cancel` | CheckoutCancel | Cancelamento de pagamento |

### Protegidas (requerem login)
| Rota | Componente |
|---|---|
| `/dashboard` | Dashboard |
| `/dashboard/calendar` | Calendar |
| `/dashboard/clients` | Clients |
| `/dashboard/services` | Services |
| `/dashboard/staff` | Staff |
| `/dashboard/settings` | Settings |
| `/dashboard/billing` | Billing |
| `/dashboard/reports` | Reports |

### API (servidor Express)
| Endpoint | Método | Descrição |
|---|---|---|
| `/api/create-checkout-session` | POST | Criar sessão Stripe Checkout |
| `/api/create-portal-session` | POST | Portal de faturação Stripe |
| `/api/webhooks/stripe` | POST | Webhooks Stripe (raw body) |
| `/api/notifications/send` | POST | Enviar notificação multi-canal |
| `/api/contact` | POST | Formulário de contacto |
| `/api/push/subscribe` | POST | Subscrever push notifications |

---

## PLANOS E LIMITES

| Feature | Free | Pro €14,90 | Business €29,90 |
|---|---|---|---|
| Staff | 1 | 5 | Ilimitado |
| Serviços | 3 | Ilimitado | Ilimitado |
| Marcações/mês | 30 | 500 | Ilimitado |
| Notificações email | ✓ | ✓ | ✓ |
| Notificações WhatsApp | ✗ | ✓ | ✓ |
| Relatórios avançados | ✗ | ✗ | ✓ |
| Marcações recorrentes | ✗ | ✓ | ✓ |
| Remoção branding | ✗ | ✓ | ✓ |

---

## CHECKLIST DE TESTES OBRIGATÓRIOS

```
LANDING PAGE
[ ] http://localhost:3000 carrega sem erros no console
[ ] Cookie banner aparece na primeira visita
[ ] Pricing mostra "IVA incluído (23%)"
[ ] Footer tem Livro de Reclamações e ODR links
[ ] /privacy-policy carrega sem [PLACEHOLDER]
[ ] /terms-and-conditions carrega sem [PLACEHOLDER]

AUTH
[ ] /signup → criar conta com email real
[ ] Email de boas-vindas chega via Resend
[ ] /login → autenticar com as credenciais
[ ] Onboarding Wizard abre após registo
[ ] Wizard Step 1 (negócio) → guardar nome/morada
[ ] Wizard Step 3 (serviço) → guardar no Supabase (tabela services)
[ ] Wizard Step 4 (staff) → guardar no Supabase (tabela staff)
[ ] /dashboard carrega após login

DASHBOARD CRUD
[ ] /dashboard/services → Novo Serviço → preencher → Guardar → aparece na lista
[ ] /dashboard/services → Editar serviço → alterar preço → Guardar → atualizado
[ ] /dashboard/staff → Novo Membro → preencher → Guardar → aparece na lista
[ ] /dashboard/clients → Novo Cliente → preencher → Guardar → aparece na lista
[ ] /dashboard/settings → alterar nome do negócio → Guardar → toast de sucesso

MARCAÇÕES PÚBLICAS
[ ] Aceder a /book/[slug-do-negocio]
[ ] Selecionar serviço → avancar
[ ] Selecionar profissional → avançar
[ ] Selecionar data → horários disponíveis aparecem
[ ] Selecionar horário → avançar
[ ] Preencher dados → Confirmar Marcação
[ ] Marcação aparece em /dashboard/calendar

PAGAMENTOS
[ ] /dashboard/billing → plano Free visível
[ ] Clicar "Upgrade Pro" (aceitar termos primeiro)
[ ] Stripe Checkout abre com preço €14,90
[ ] Cartão teste: 4242 4242 4242 4242 | 12/28 | 123
[ ] Após pagamento → redireciona para /checkout/success
[ ] Badge "Pro" aparece na sidebar
[ ] /dashboard/billing → botão "Gerir Subscrição" aparece

RELATÓRIOS
[ ] /dashboard/reports → gráficos de marcações carregam
[ ] Top 5 Serviços bloqueado (plano Free) com link para upgrade

NOTIFICAÇÕES (se configurado)
[ ] Testar email: POST /api/notifications/send
[ ] Verificar email chegou na caixa de entrada

PWA
[ ] DevTools → Application → Manifest → sem erros
[ ] DevTools → Application → Service Workers → ativo
[ ] Ícone de instalação aparece na barra de endereço (Chrome)
```

---

## CHECKLIST LEGAL PORTUGAL

- [ ] NIF registado (obrigatório para faturação)
- [ ] Conta bancária empresarial para receber via Stripe
- [ ] Livro de Reclamações Eletrónico ativo → https://www.livroreclamacoes.pt
- [ ] Política de Privacidade RGPD sem placeholders
- [ ] Termos e Condições com NIF e morada real
- [ ] IVA 23% indicado em todos os preços (já implementado)
- [ ] Direito de arrependimento 14 dias — Decreto-Lei 24/2014 (já implementado)
- [ ] Cookie consent RGPD com categorias (já implementado)
- [ ] Link ODR na footer (já implementado)
- [ ] CNPD: verificar se escala requer notificação → https://www.cnpd.pt

---

## DEPLOY — VERCEL

```bash
# 1. Instalar CLI
npm i -g vercel

# 2. Na pasta do projeto
vercel

# 3. Configurar env vars no Dashboard
# https://vercel.com/[projeto]/settings/environment-variables
# Copiar TODAS as variáveis do .env.local

# 4. Ligar domínio
# Vercel Dashboard → Domains → Add → [dominio.pt]
# Registador DNS → CNAME: cname.vercel-dns.com

# 5. Após deploy, atualizar:
# - VITE_APP_URL=https://[dominio]
# - Stripe Webhook URL para produção
# - Supabase Auth → URL Configuration
# - Resend → verificar domínio
```

---

## SUPORTE E RECURSOS

| Serviço | Dashboard | Documentação |
|---|---|---|
| Supabase | https://supabase.com/dashboard | https://supabase.com/docs |
| Stripe | https://dashboard.stripe.com | https://stripe.com/docs |
| Resend | https://resend.com/dashboard | https://resend.com/docs |
| Twilio | https://console.twilio.com | https://www.twilio.com/docs |
| Vercel | https://vercel.com/dashboard | https://vercel.com/docs |
| Meta Ads | https://business.facebook.com | https://www.facebook.com/business/help |
