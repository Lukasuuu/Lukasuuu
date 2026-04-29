# PROMPT MESTRE — BookMe para Claude Code Local

> **Copia e cola este prompt inteiro no Claude Code do teu computador.**
> Claude Code irá executar tudo automaticamente, perguntar as credenciais necessárias e testar cada funcionalidade.

---

## PROMPT PARA COLAR NO CLAUDE CODE:

```
Vou implementar o BookMe — uma aplicação SaaS de marcações online — localmente no meu computador.
Age como CEO técnico e faz tudo o que for necessário para a aplicação funcionar completamente.

O repositório já está clonado em: [PASTA_DO_PROJETO]/bookme
(ou clone com: git clone [URL_DO_REPO] && cd bookme)

Executa os seguintes passos na ordem exata:

─────────────────────────────────────────────
FASE 1 — SETUP DO AMBIENTE
─────────────────────────────────────────────

1. Verifica se Node.js >= 20, pnpm e git estão instalados
   - Se faltarem, dá instruções para instalar e para

2. Executa: pnpm install
   - Se falhar, corrige os erros antes de continuar

3. Verifica se existe .env.local
   - Se não existir, copia de .env.example: cp .env.example .env.local

─────────────────────────────────────────────
FASE 2 — RECOLHA DE CREDENCIAIS
─────────────────────────────────────────────

Para cada serviço abaixo, pergunta-me o valor, acede à URL indicada se necessário, e escreve no .env.local:

SUPABASE (obrigatório):
- Pergunta: "Tens o Supabase configurado?"
- Se não: abre https://supabase.com → cria projeto → vai a Settings → API
- Precisa: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- Após configurar: executa supabase_schema.sql no SQL Editor do Supabase

STRIPE (obrigatório para pagamentos):
- Pergunta: "Tens o Stripe configurado?"
- Se não: abre https://dashboard.stripe.com
- Precisa: VITE_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- Cria 4 produtos no Stripe (Pro Mensal €14,90, Pro Anual €149, Business Mensal €29,90, Business Anual €299)
- Precisa dos 4 Price IDs: STRIPE_PRICE_PRO_MONTHLY, STRIPE_PRICE_PRO_YEARLY, STRIPE_PRICE_BUSINESS_MONTHLY, STRIPE_PRICE_BUSINESS_YEARLY
- E as versões VITE_ para o cliente: VITE_STRIPE_PRICE_PRO_MONTHLY, etc.

RESEND (obrigatório para emails):
- Pergunta: "Tens conta no Resend?"
- Se não: abre https://resend.com → cria conta
- Precisa: RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_FROM_NAME=BookMe, ADMIN_EMAIL

VAPID KEYS (para notificações push):
- Gera automaticamente: npx web-push generate-vapid-keys
- Escreve VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT no .env.local

TWILIO/WHATSAPP (opcional):
- Pergunta: "Queres configurar notificações WhatsApp?"
- Se sim: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER

TELEGRAM (opcional):
- Pergunta: "Queres notificações Telegram?"
- Se sim: TELEGRAM_BOT_TOKEN

─────────────────────────────────────────────
FASE 3 — GERAR ASSETS PWA
─────────────────────────────────────────────

1. Instala sharp: pnpm add -D sharp
2. Executa: node scripts/generate-icons.js
3. Verifica que foram criados os ficheiros em client/public/icons/

─────────────────────────────────────────────
FASE 4 — ARRANCAR E TESTAR
─────────────────────────────────────────────

1. Executa: pnpm dev
2. Aguarda o servidor arrancar na porta 3000
3. Abre http://localhost:3000 no browser

Testa cada item desta lista e reporta ✅ ou ❌ com o erro:

LANDING PAGE:
- [ ] Página carrega sem erros no console
- [ ] Navbar com link "Começar Grátis" funciona
- [ ] Pricing mostra IVA incluído
- [ ] Footer tem Livro de Reclamações e ODR
- [ ] Cookie banner aparece

AUTH:
- [ ] Criar conta em /signup
- [ ] Login funciona em /login
- [ ] Onboarding Wizard aparece após registo
- [ ] Wizard Step 3 (serviço) guarda na base de dados
- [ ] Wizard Step 4 (staff) guarda na base de dados

DASHBOARD (após login):
- [ ] Dashboard carrega com métricas
- [ ] /dashboard/services → criar serviço → aparece
- [ ] /dashboard/staff → criar membro → aparece  
- [ ] /dashboard/clients → criar cliente → aparece
- [ ] /dashboard/calendar → calendário visível

MARCAÇÕES PÚBLICAS:
- [ ] Aceder a /book/[slug-do-negocio]
- [ ] Selecionar serviço → profissional → data → hora
- [ ] Horários disponíveis aparecem (sem conflitos)
- [ ] Confirmar marcação → aparece no dashboard

PAGAMENTOS STRIPE:
- [ ] /dashboard/billing carrega planos
- [ ] Clicar "Upgrade Pro" → abre Stripe Checkout
- [ ] Usar cartão teste: 4242 4242 4242 4242, qualquer data futura, 123
- [ ] Após pagamento → badge "Pro" aparece no dashboard

RELATÓRIOS:
- [ ] /dashboard/reports carrega gráficos
- [ ] Top 5 serviços bloqueado no plano free

LEGAL:
- [ ] /privacy-policy carrega (sem [PLACEHOLDER])
- [ ] /terms-and-conditions carrega (sem [PLACEHOLDER])
- [ ] /contact → formulário de contacto funciona

─────────────────────────────────────────────
FASE 5 — CORRIGIR O QUE FALHAR
─────────────────────────────────────────────

Para cada ❌ na lista de testes:
1. Lê o erro no console
2. Identifica o ficheiro e linha do problema
3. Corrige o código
4. Volta a testar até passar a ✅

─────────────────────────────────────────────
FASE 6 — SUBSTITUIR PLACEHOLDERS LEGAIS
─────────────────────────────────────────────

Pergunta-me estes dados para completar os documentos legais:
1. Nome completo da empresa/individual
2. NIF (Número de Identificação Fiscal)
3. Morada completa
4. Email de contacto
5. Telefone (opcional)
6. DPO (Data Protection Officer) — nome e email
7. Domínio final (ex: bookme.pt) — pode ser placeholder por agora

Substitui todos os [PLACEHOLDER] nos ficheiros:
- client/src/pages/PrivacyPolicy.tsx
- client/src/pages/TermsAndConditions.tsx
- client/src/components/Footer.tsx
- client/public/robots.txt
- client/public/sitemap.xml
- client/index.html

─────────────────────────────────────────────
FASE 7 — GUIAR PARA O DOMÍNIO E DEPLOY
─────────────────────────────────────────────

Após tudo funcionar em localhost:

1. Guia-me para comprar o domínio:
   - Recomenda: https://www.eurodns.com/pt (para .pt) ou Namecheap (.com/.app)
   - Explica: .pt requer NIF português, custo ~€15/ano
   - Alternativas: getbookme.com, bookme.app

2. Deploy no Vercel (gratuito):
   - Instala CLI: npm i -g vercel
   - Na pasta do projeto: vercel
   - Configura todas as variáveis do .env.local no Vercel Dashboard
   - Liga o domínio comprado

3. Após deploy, atualiza:
   - VITE_APP_URL para o domínio real
   - Stripe Webhook para URL de produção
   - Supabase Auth URL
   - Resend domínio verificado

─────────────────────────────────────────────
FASE 8 — PLANO DE MARKETING E PRIMEIRAS VENDAS
─────────────────────────────────────────────

Após o deploy, lê o ficheiro marketing/ESTRATEGIA_LANCAMENTO.md e:

1. Cria os Stripe Payment Links para venda direta:
   - Pro Mensal: dashboard.stripe.com/payment-links
   - Pro Anual: mesma página
   
2. Prepara o checklist de conteúdo para a primeira semana

3. Lista as primeiras 10 ações de outreach a fazer

4. Reporta o estado final: o que está pronto, o que falta, custos estimados

─────────────────────────────────────────────
RELATÓRIO FINAL
─────────────────────────────────────────────

No final, apresenta um relatório executivo com:

✅ O que está a funcionar
❌ O que precisa de atenção
🔧 Próximas 3 ações prioritárias
💰 Custos mensais estimados (Supabase free, Vercel free, Stripe 1.4%+€0.25/transação, Resend free até 100 emails/dia)
📈 Projeção de receita com 10 clientes Pro: €149/mês
```

---

## COMO USAR ESTE PROMPT

1. Abre o **Claude Code** no terminal dentro da pasta do projeto:
   ```bash
   cd /caminho/para/bookme
   claude
   ```

2. Cola o prompt acima (entre as ``` ```)

3. Responde às perguntas do Claude Code conforme ele pede

4. O Claude irá:
   - Executar comandos automaticamente
   - Pedir credenciais quando necessário
   - Abrir URLs nos comentários para te guiar
   - Testar cada funcionalidade
   - Reportar o estado de cada teste

---

## PRÉ-REQUISITOS (instalar antes)

```bash
# macOS
brew install node
npm install -g pnpm

# Windows
# Baixar Node.js de: https://nodejs.org/en/download
# Depois: npm install -g pnpm

# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm

# Instalar Claude Code (se não tiver):
npm install -g @anthropic-ai/claude-code
```

---

## ALTERNATIVA: SETUP AUTOMÁTICO

Em vez do prompt, podes correr o script de setup:

```bash
cd bookme
bash scripts/setup.sh
```

O script pergunta cada credencial e configura tudo automaticamente.

---

## CREDENCIAIS QUE PRECISAS TER À MÃO

Antes de começar, abre estas abas no browser:

| Serviço | URL |
|---|---|
| Supabase | https://supabase.com/dashboard |
| Stripe | https://dashboard.stripe.com |
| Resend | https://resend.com/dashboard |
| Twilio (opcional) | https://console.twilio.com |
| Telegram BotFather (opcional) | https://t.me/BotFather |
| Vercel (para deploy) | https://vercel.com/dashboard |

---

*Documento gerado automaticamente. Atualizado em: Abril 2026.*
