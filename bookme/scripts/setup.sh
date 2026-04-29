#!/usr/bin/env bash
# =============================================================================
# BookMe — Script de Setup Interativo
# Executa: bash scripts/setup.sh
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_header() {
  echo ""
  echo -e "${CYAN}${BOLD}============================================${NC}"
  echo -e "${CYAN}${BOLD}  $1${NC}"
  echo -e "${CYAN}${BOLD}============================================${NC}"
  echo ""
}

print_step() {
  echo -e "${BLUE}▶ $1${NC}"
}

print_ok() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_warn() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

ask() {
  local var_name="$1"
  local prompt="$2"
  local default="$3"
  local secret="$4"

  if [ -n "$default" ]; then
    prompt="$prompt [${default}]"
  fi

  echo -e "${YELLOW}${prompt}:${NC}"
  if [ "$secret" = "true" ]; then
    read -s value
    echo ""
  else
    read value
  fi

  if [ -z "$value" ] && [ -n "$default" ]; then
    value="$default"
  fi

  eval "$var_name='$value'"
}

# =============================================================================
print_header "BookMe Setup — Configuração Inicial"
# =============================================================================

echo -e "${BOLD}Este script vai:${NC}"
echo "  1. Verificar pré-requisitos (Node, pnpm, git)"
echo "  2. Instalar dependências"
echo "  3. Criar o ficheiro .env.local com as suas credenciais"
echo "  4. Arrancar o servidor para testes locais"
echo ""
echo -e "${YELLOW}Tem as credenciais das plataformas à mão? (Supabase, Stripe, Resend)${NC}"
echo -e "Prima ENTER para continuar ou Ctrl+C para sair."
read

# =============================================================================
print_header "1. Verificar Pré-Requisitos"
# =============================================================================

# Node.js
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  print_ok "Node.js $NODE_VERSION instalado"
else
  print_error "Node.js não encontrado. Instalar em: https://nodejs.org"
  exit 1
fi

# pnpm
if command -v pnpm &> /dev/null; then
  PNPM_VERSION=$(pnpm --version)
  print_ok "pnpm $PNPM_VERSION instalado"
else
  print_warn "pnpm não encontrado. A instalar..."
  npm install -g pnpm
  print_ok "pnpm instalado"
fi

# git
if command -v git &> /dev/null; then
  print_ok "git instalado"
else
  print_error "git não encontrado. Instalar em: https://git-scm.com"
  exit 1
fi

# =============================================================================
print_header "2. Instalar Dependências"
# =============================================================================

print_step "A executar pnpm install..."
pnpm install
print_ok "Dependências instaladas"

# =============================================================================
print_header "3. Configurar Variáveis de Ambiente"
# =============================================================================

if [ -f ".env.local" ]; then
  print_warn "Ficheiro .env.local já existe."
  echo -e "${YELLOW}Deseja reconfigurar? (s/N):${NC}"
  read reconfigure
  if [ "$reconfigure" != "s" ] && [ "$reconfigure" != "S" ]; then
    print_ok "Mantendo .env.local existente"
    echo ""
    echo -e "${BOLD}A saltar para o arranque do servidor...${NC}"
    pnpm dev
    exit 0
  fi
fi

cp .env.example .env.local
print_ok ".env.local criado a partir de .env.example"

# =============================================================================
print_header "3.1 Supabase (Base de Dados)"
# =============================================================================

echo -e "${BOLD}Aceda a: https://supabase.com/dashboard${NC}"
echo -e "Selecione o seu projeto → Settings → API"
echo ""

ask SUPABASE_URL "Project URL (ex: https://abc.supabase.co)"
ask SUPABASE_ANON_KEY "Anon public key" "" "true"
ask SUPABASE_SERVICE_ROLE_KEY "Service role key (secreto)" "" "true"

# Atualizar .env.local
sed -i "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$SUPABASE_URL|" .env.local
sed -i "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|" .env.local
sed -i "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY|" .env.local
print_ok "Supabase configurado"

echo ""
print_step "Agora execute o schema SQL no Supabase:"
echo -e "${YELLOW}  1. Aceda a: https://supabase.com/dashboard → SQL Editor${NC}"
echo -e "${YELLOW}  2. Cole o conteúdo do ficheiro supabase_schema.sql${NC}"
echo -e "${YELLOW}  3. Clique em 'Run'${NC}"
echo ""
echo -e "Prima ENTER quando o schema estiver executado..."
read

# =============================================================================
print_header "3.2 Stripe (Pagamentos)"
# =============================================================================

echo -e "${BOLD}Aceda a: https://dashboard.stripe.com/apikeys${NC}"
echo ""

ask STRIPE_PK "Publishable key (pk_test_...)"
ask STRIPE_SK "Secret key (sk_test_...)" "" "true"

sed -i "s|VITE_STRIPE_PUBLISHABLE_KEY=.*|VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_PK|" .env.local
sed -i "s|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=$STRIPE_SK|" .env.local

echo ""
print_step "Criar produtos no Stripe:"
echo -e "${YELLOW}  Aceda a: https://dashboard.stripe.com/products → Add product${NC}"
echo ""
echo "  Produto 1: Pro Mensal — €14,90/mês (recorrente)"
ask PRICE_PRO_M "Price ID do Pro Mensal (price_...)"

echo "  Produto 2: Pro Anual — €149/ano (recorrente)"
ask PRICE_PRO_Y "Price ID do Pro Anual (price_...)"

echo "  Produto 3: Business Mensal — €29,90/mês (recorrente)"
ask PRICE_BIZ_M "Price ID do Business Mensal (price_...)"

echo "  Produto 4: Business Anual — €299/ano (recorrente)"
ask PRICE_BIZ_Y "Price ID do Business Anual (price_...)"

sed -i "s|STRIPE_PRICE_PRO_MONTHLY=.*|STRIPE_PRICE_PRO_MONTHLY=$PRICE_PRO_M|" .env.local
sed -i "s|STRIPE_PRICE_PRO_YEARLY=.*|STRIPE_PRICE_PRO_YEARLY=$PRICE_PRO_Y|" .env.local
sed -i "s|STRIPE_PRICE_BUSINESS_MONTHLY=.*|STRIPE_PRICE_BUSINESS_MONTHLY=$PRICE_BIZ_M|" .env.local
sed -i "s|STRIPE_PRICE_BUSINESS_YEARLY=.*|STRIPE_PRICE_BUSINESS_YEARLY=$PRICE_BIZ_Y|" .env.local
sed -i "s|VITE_STRIPE_PRICE_PRO_MONTHLY=.*|VITE_STRIPE_PRICE_PRO_MONTHLY=$PRICE_PRO_M|" .env.local
sed -i "s|VITE_STRIPE_PRICE_PRO_YEARLY=.*|VITE_STRIPE_PRICE_PRO_YEARLY=$PRICE_PRO_Y|" .env.local
sed -i "s|VITE_STRIPE_PRICE_BUSINESS_MONTHLY=.*|VITE_STRIPE_PRICE_BUSINESS_MONTHLY=$PRICE_BIZ_M|" .env.local
sed -i "s|VITE_STRIPE_PRICE_BUSINESS_YEARLY=.*|VITE_STRIPE_PRICE_BUSINESS_YEARLY=$PRICE_BIZ_Y|" .env.local

echo ""
print_step "Configurar Webhook Stripe:"
echo -e "${YELLOW}  Aceda a: https://dashboard.stripe.com/webhooks → Add endpoint${NC}"
echo -e "${YELLOW}  URL: http://localhost:3000/api/webhooks/stripe (para testes)${NC}"
echo -e "${YELLOW}  Ou usar Stripe CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe${NC}"
echo -e "${YELLOW}  Eventos: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed${NC}"
echo ""

ask STRIPE_WH_SECRET "Webhook Secret (whsec_...)" "" "true"
sed -i "s|STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$STRIPE_WH_SECRET|" .env.local
print_ok "Stripe configurado"

# =============================================================================
print_header "3.3 Resend (Email)"
# =============================================================================

echo -e "${BOLD}Aceda a: https://resend.com/api-keys${NC}"
echo ""

ask RESEND_KEY "API Key (re_...)" "" "true"
ask RESEND_FROM "Email remetente" "noreply@bookme.pt"
ask ADMIN_EMAIL "Email do administrador (para receber contactos)"

sed -i "s|RESEND_API_KEY=.*|RESEND_API_KEY=$RESEND_KEY|" .env.local
sed -i "s|RESEND_FROM_EMAIL=.*|RESEND_FROM_EMAIL=$RESEND_FROM|" .env.local
sed -i "s|ADMIN_EMAIL=.*|ADMIN_EMAIL=$ADMIN_EMAIL|" .env.local
print_ok "Resend configurado"

# =============================================================================
print_header "3.4 Notificações — WhatsApp (opcional)"
# =============================================================================

echo -e "${YELLOW}Configurar WhatsApp via Twilio? (s/N):${NC}"
read configure_twilio
if [ "$configure_twilio" = "s" ] || [ "$configure_twilio" = "S" ]; then
  echo -e "${BOLD}Aceda a: https://console.twilio.com${NC}"
  ask TWILIO_SID "Account SID"
  ask TWILIO_TOKEN "Auth Token" "" "true"
  ask TWILIO_WA "Número WhatsApp (ex: +14155552671)"

  sed -i "s|TWILIO_ACCOUNT_SID=.*|TWILIO_ACCOUNT_SID=$TWILIO_SID|" .env.local
  sed -i "s|TWILIO_AUTH_TOKEN=.*|TWILIO_AUTH_TOKEN=$TWILIO_TOKEN|" .env.local
  sed -i "s|TWILIO_WHATSAPP_NUMBER=.*|TWILIO_WHATSAPP_NUMBER=$TWILIO_WA|" .env.local
  print_ok "Twilio/WhatsApp configurado"
else
  print_warn "WhatsApp ignorado (pode configurar depois)"
fi

# =============================================================================
print_header "3.5 Telegram Bot (opcional)"
# =============================================================================

echo -e "${YELLOW}Configurar notificações Telegram? (s/N):${NC}"
read configure_telegram
if [ "$configure_telegram" = "s" ] || [ "$configure_telegram" = "S" ]; then
  echo -e "${BOLD}No Telegram, fale com @BotFather → /newbot → copie o token${NC}"
  ask TELEGRAM_TOKEN "Bot Token" "" "true"
  sed -i "s|TELEGRAM_BOT_TOKEN=.*|TELEGRAM_BOT_TOKEN=$TELEGRAM_TOKEN|" .env.local
  print_ok "Telegram configurado"
else
  print_warn "Telegram ignorado (pode configurar depois)"
fi

# =============================================================================
print_header "3.6 VAPID Keys (PWA Push Notifications)"
# =============================================================================

print_step "A gerar chaves VAPID..."
VAPID_OUTPUT=$(npx web-push generate-vapid-keys 2>/dev/null || echo "ERRO")

if [ "$VAPID_OUTPUT" != "ERRO" ]; then
  VAPID_PUB=$(echo "$VAPID_OUTPUT" | grep "Public Key:" | awk '{print $3}')
  VAPID_PRIV=$(echo "$VAPID_OUTPUT" | grep "Private Key:" | awk '{print $3}')

  sed -i "s|VAPID_PUBLIC_KEY=.*|VAPID_PUBLIC_KEY=$VAPID_PUB|" .env.local
  sed -i "s|VAPID_PRIVATE_KEY=.*|VAPID_PRIVATE_KEY=$VAPID_PRIV|" .env.local
  sed -i "s|VAPID_SUBJECT=.*|VAPID_SUBJECT=mailto:$ADMIN_EMAIL|" .env.local
  print_ok "Chaves VAPID geradas automaticamente"
else
  print_warn "Falha ao gerar VAPID keys. Configure manualmente com: npx web-push generate-vapid-keys"
fi

# =============================================================================
print_header "3.7 Configuração Final"
# =============================================================================

sed -i "s|VITE_APP_URL=.*|VITE_APP_URL=http://localhost:3000|" .env.local
sed -i "s|NODE_ENV=.*|NODE_ENV=development|" .env.local

print_ok "Todas as variáveis configuradas em .env.local"

# =============================================================================
print_header "4. Gerar Ícones PWA"
# =============================================================================

if [ -f "scripts/generate-icons.js" ]; then
  print_step "A gerar ícones PWA..."
  node scripts/generate-icons.js && print_ok "Ícones gerados" || print_warn "Falha ao gerar ícones (pode continuar sem eles)"
fi

# =============================================================================
print_header "5. Verificar Configuração"
# =============================================================================

print_step "Verificar TypeScript..."
pnpm check 2>&1 | grep -v "Cannot find type definition\|baseUrl\|deprecated" | head -20 || true
print_ok "Verificação TypeScript concluída"

# =============================================================================
print_header "6. PRONTO! A Arrancar o Servidor..."
# =============================================================================

echo ""
echo -e "${GREEN}${BOLD}✓ Setup completo!${NC}"
echo ""
echo -e "${BOLD}Próximos passos:${NC}"
echo -e "  1. Abrir ${CYAN}http://localhost:3000${NC}"
echo -e "  2. Criar conta em ${CYAN}http://localhost:3000/signup${NC}"
echo -e "  3. Completar o Onboarding Wizard"
echo -e "  4. Testar marcação pública em ${CYAN}http://localhost:3000/book/[slug]${NC}"
echo -e "  5. Testar pagamento com cartão ${CYAN}4242 4242 4242 4242${NC}"
echo ""
echo -e "${BOLD}Para testar webhooks Stripe localmente:${NC}"
echo -e "  ${CYAN}stripe listen --forward-to localhost:3000/api/webhooks/stripe${NC}"
echo ""
echo -e "${YELLOW}Prima ENTER para arrancar o servidor de desenvolvimento...${NC}"
read

pnpm dev
