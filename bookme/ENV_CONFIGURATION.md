# Configuração de Variáveis de Ambiente - BookMe

Este documento descreve todas as variáveis de ambiente necessárias para executar a aplicação BookMe.

## 📋 Variáveis Obrigatórias

### Supabase (Base de Dados)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
**Como obter:**
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá para Settings → API
4. Copie a URL do projeto e a chave anon

## 📧 Variáveis Opcionais - Notificações

### Email (Resend)
```
RESEND_API_KEY=re_your_api_key_here
```
**Como obter:**
1. Aceda a [resend.com](https://resend.com)
2. Crie uma conta
3. Vá para API Keys
4. Crie uma nova chave

**Funcionalidades:**
- Confirmação de marcação
- Lembretes 24h antes
- Cancelamento de marcação
- Email de boas-vindas

### WhatsApp (Twilio)
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+1234567890
```
**Como obter:**
1. Aceda a [twilio.com](https://www.twilio.com)
2. Crie uma conta
3. Vá para Console → Account
4. Copie o Account SID e Auth Token
5. Configure WhatsApp Sandbox

**Funcionalidades:**
- Confirmação de marcação por WhatsApp
- Lembretes por WhatsApp

### Telegram
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
```
**Como obter:**
1. Abra o Telegram
2. Procure por @BotFather
3. Envie `/newbot`
4. Siga as instruções
5. Copie o token fornecido

**Funcionalidades:**
- Notificação de nova marcação ao negócio
- Confirmação ao cliente

## 🔧 Variáveis de Aplicação

```
NODE_ENV=development          # development ou production
PORT=3000                     # Porta do servidor
VITE_APP_TITLE=BookMe         # Título da aplicação
VITE_APP_ID=bookme            # ID único da aplicação
```

## 📊 Analytics (Opcional)

```
VITE_ANALYTICS_ENDPOINT=https://your-umami-instance.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```
Para rastreamento de eventos e analytics.

## 💳 Stripe (Futuro)

```
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
Para integração de pagamentos (não implementado ainda).

## 🚀 Como Configurar

### 1. Desenvolvimento Local

```bash
# Copie o ficheiro de exemplo
cp .env.example .env.local

# Edite o ficheiro com suas credenciais
nano .env.local

# Instale as dependências
pnpm install

# Execute o servidor de desenvolvimento
pnpm dev
```

### 2. Produção (Manus Hosting)

As variáveis de ambiente são configuradas através do painel de controlo do Manus:

1. Aceda ao Dashboard do seu projeto
2. Vá para Settings → Secrets
3. Adicione cada variável necessária
4. Faça deploy

## ⚠️ Segurança

**IMPORTANTE:**
- ✅ Nunca faça commit de `.env.local` para o repositório
- ✅ Use diferentes chaves para desenvolvimento e produção
- ✅ Mantenha suas chaves API seguras
- ✅ Rotacione suas chaves regularmente
- ✅ Use variáveis de ambiente para todas as credenciais
- ✅ Não compartilhe suas chaves com ninguém

## 📝 Exemplo de .env.local

```
# Supabase
VITE_SUPABASE_URL=https://xyzabc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email
RESEND_API_KEY=re_abc123def456

# WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155552671

# Telegram
TELEGRAM_BOT_TOKEN=123456789:ABCDefGHIJKlmnoPQRstUVwxyz

# App
NODE_ENV=development
PORT=3000
VITE_APP_TITLE=BookMe
VITE_APP_ID=bookme
```

## 🔗 Links Úteis

- [Supabase Documentation](https://supabase.com/docs)
- [Resend Email API](https://resend.com/docs)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## ❓ Dúvidas?

Se tiver dúvidas sobre a configuração, entre em contacto com o suporte em support@bookme.pt
