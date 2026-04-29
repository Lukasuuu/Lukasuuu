# BookMe - Configuração do Supabase

## Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto Supabase criado
3. Node.js e npm instalados

## Passos de Configuração

### 1. Criar Projeto no Supabase

1. Aceda a https://supabase.com e faça login
2. Clique em "New Project"
3. Preencha os detalhes:
   - **Project name**: BookMe
   - **Database password**: Escolha uma senha segura
   - **Region**: Escolha a região mais próxima
4. Clique em "Create new project"

### 2. Obter as Credenciais

Após criar o projeto:

1. Vá para **Settings** → **API**
2. Copie:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** (API Key)
   - **service_role** (Secret Key)

### 3. Configurar Variáveis de Ambiente

Crie um ficheiro `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=seu_anon_key_aqui
```

### 4. Criar as Tabelas da Base de Dados

1. No Supabase, vá para **SQL Editor**
2. Clique em "New Query"
3. Copie todo o conteúdo do ficheiro `supabase_schema.sql`
4. Cole no SQL Editor
5. Clique em "Run"

Isto criará todas as tabelas, índices, políticas RLS e triggers necessários.

### 5. Configurar Autenticação

1. Vá para **Authentication** → **Providers**
2. Ative "Email" (já deve estar ativado por padrão)
3. Configure as opções conforme necessário:
   - Enable email confirmations
   - Disable email confirmations (mais rápido para testes)

### 6. Configurar Políticas de CORS (se necessário)

Se estiver a testar localmente:

1. Vá para **Settings** → **API**
2. Adicione `http://localhost:5173` à lista de URLs permitidas

### 7. Instalar Dependências

```bash
npm install @supabase/supabase-js
```

## Estrutura da Base de Dados

### Tabelas Principais

- **businesses** - Dados do negócio
- **profiles** - Perfis de utilizadores
- **staff** - Membros da equipa
- **services** - Serviços oferecidos
- **clients** - Base de dados de clientes
- **bookings** - Marcações/agendamentos
- **notifications** - Notificações enviadas

### Políticas de Segurança (RLS)

Todas as tabelas têm políticas de Row Level Security (RLS) configuradas para garantir que:

- Utilizadores só podem ver dados do seu próprio negócio
- A página de booking pública pode ser acedida sem autenticação
- Dados sensíveis são protegidos

## Testes Iniciais

### 1. Testar Autenticação

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Registar novo utilizador
const { data, error } = await supabase.auth.signUp({
  email: 'teste@example.com',
  password: 'senha123'
})

// Fazer login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'teste@example.com',
  password: 'senha123'
})
```

### 2. Testar Inserção de Dados

```typescript
// Criar novo negócio
const { data, error } = await supabase
  .from('businesses')
  .insert([
    {
      name: 'Meu Salão',
      slug: 'meu-salao',
      email: 'salao@example.com',
      phone: '+351912345678'
    }
  ])
  .select()
```

## Troubleshooting

### Erro: "CORS policy"

- Adicione a URL local às configurações de CORS no Supabase

### Erro: "RLS policy violation"

- Verifique se o utilizador está autenticado
- Verifique se as políticas RLS estão configuradas corretamente

### Erro: "Table does not exist"

- Verifique se o SQL schema foi executado completamente
- Verifique se não há erros no SQL Editor

## Próximos Passos

1. Implementar contexto de autenticação no React
2. Criar páginas de login e registo
3. Implementar dashboard com dados da base de dados
4. Adicionar funcionalidades de calendário e CRM

## Documentação Adicional

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
