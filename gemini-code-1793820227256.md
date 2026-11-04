# PROJETO: DUZZIMOB — CRM IMOBILIÁRIO INTELIGENTE & PLATAFORMA DE VENDAS
DIRETÓRIO DO PROJETO: E:\AntiGravity\duzzimob
VERSÃO: 1.0 (Full-Stack Next.js + Supabase + Vercel + Gemini + WAHA)

---

## 1. VISÃO GERAL & DIRETRIZES FUNDAMENTAIS

O DUZZIMOB é um CRM imobiliário de alta performance projetado para acelerar a rotina de vendas de corretores e escritórios imobiliários. 
- **Fase Inicial:** Uso operacional próprio para um escritório imobiliário solo.
- **Arquitetura de Banco:** Multi-tenant desde o dia 1. Todas as tabelas de negócio possuem `organization_id` e políticas de Row Level Security (RLS) no PostgreSQL do Supabase, permitindo a transição futura para um produto SaaS comercial sem qualquer necessidade de refatoração de esquema.

---

## 2. STACK TECNOLÓGICA & INFRAESTRUTURA

- **Ambiente & Runtime:** Node.js (LTS), Next.js (App Router, Server Components e Server Actions), TypeScript (modo estrito).
- **Estilização & UI:** Tailwind CSS, shadcn/ui, Radix UI primitives, Lucide React icons, `@hello-pangea/dnd` (ou dnd-kit) para o Kanban.
- **Gerenciamento de Tema:** `next-themes` (Dark/Light mode).
- **Manipulação de PDFs:** `pdf-lib` (para leitura, injeção de dados AcroForm e inserção de imagem/logotipo dinâmico em PDF).
- **Banco de Dados, Autenticação & Storage:** Supabase (PostgreSQL, Supabase Auth SSR, RLS, Buckets de Storage para mídias, fotos de imóveis e PDFs).
- **Hospedagem & Roteamento Edge:** Vercel (Edge Middleware para suporte a subdomínios e domínios personalizados).
- **Inteligência Artificial:** Google Gemini API (`@google/genai` / SDK oficial do Gemini) para atendimento autônomo, auditoria de contratos em PDF e geração de legendas persuasivas.
- **Gateway WhatsApp:** WAHA (WhatsApp HTTP API - container Docker em VPS externa, consumido via webhooks e chamadas HTTP REST).

---

## 3. DESIGN SYSTEM & UI/UX (DARK MINIMALIST TECH FUTURISTA)

A interface deve reproduzir rigorosamente a estética visual premium de dashboards SaaS de última geração, com suporte total a alternância claro/escuro.

### Tema Escuro (Padrão Inicial)
- **Background Principal:** `#0a0c0d` / `#0f1214` (Deep Charcoal / Pitch Black).
- **Superfícies / Cards / Modais:** `#15181b` com bordas sutis `border border-white/10` e cantos arredondados generosos (`rounded-2xl` / `rounded-3xl`).
- **Accent Primário (Neon/Lime Green):** `#ccff00` ou `#d4ff00` com texto em alto contraste preto (`#000000`).
- **Glow & Efeitos:** `shadow-[0_0_25px_rgba(204,255,0,0.2)]` em botões de ação primária e badges de destaque.
- **Tipografia:** Texto primário `#f4f4f5`, texto secundário/muted `#a1a1aa`.
- **Botões & Badges:** Estilo pílula (`rounded-full`), badges informativos com indicador circular pulsante de status.

### Tema Claro (Alternável via Theme Toggle)
- **Background Principal:** `#f8fafc`.
- **Superfícies / Cards:** `#ffffff` com bordas `#e2e8f0` e sombras suaves `shadow-sm`.
- **Accent Primário:** `#15803d` ou `#4d7c0f` (verde escurecido elegante para garantir contraste AA).
- **Tipografia:** Texto primário `#0f172a`, secundário `#64748b`.

---

## 4. MODELO DE DADOS POSTGRESQL (SUPABASE SQL DDL)

Implemente as migrações no Supabase com suporte a RLS e índices de busca:

```sql
-- Habilitar extensões
create extension if not exists "uuid-ossp";

-- 1. Organizações (Tenants)
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo_url text,
  creci text,
  contact_email text,
  contact_phone text,
  city text default 'Criciúma',
  state text default 'SC',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Perfis de Usuário
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  organization_id uuid references organizations(id) on delete cascade not null,
  full_name text not null,
  role text default 'corretor' check (role in ('admin', 'corretor')),
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Imóveis
create table properties (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  title text not null,
  development_name text, -- Nome do empreendimento / construtora
  type text not null check (type in ('apartamento', 'casa', 'terreno', 'lancamento', 'comercial')),
  status text default 'disponivel' check (status in ('disponivel', 'reservado', 'vendido', 'inativo')),
  sale_price numeric(14,2) not null,
  discounted_price numeric(14,2),
  neighborhood text not null,
  city text not null,
  specs jsonb default '{}'::jsonb, -- { quartos, suites, vagas, unit, box, privative_area, total_area, incc_correction }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Fotos e Documentos do Imóvel
create table property_media (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete cascade not null,
  storage_path text not null,
  is_cover boolean default false,
  order_index int default 0
);

-- 5. Contatos (Clientes / Compradores / Proprietários)
create table contacts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  phone text not null,
  email text,
  cpf text,
  rg text,
  marital_status text,
  profession text,
  spouse_data jsonb default '{}'::jsonb, -- { name, cpf, rg, profession, email }
  search_profile jsonb default '{}'::jsonb, -- { max_price, min_bedrooms, preferred_neighborhoods }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Negócios (Funil Kanban)
create table deals (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  contact_id uuid references contacts(id) on delete cascade not null,
  property_id uuid references properties(id) on delete set null,
  assigned_to uuid references profiles(id) on delete set null,
  stage text default 'novo_lead' check (stage in ('novo_lead', 'triagem_ia', 'contato_humano', 'visita_agendada', 'proposta', 'credito_contrato', 'fechado_ganho', 'perdido')),
  deal_value numeric(14,2),
  ai_paused boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Simulações de Financiamento
create table simulations (
  id uuid primary key default uuid_generate_v4(),
  deal_id uuid references deals(id) on delete cascade not null,
  organization_id uuid references organizations(id) on delete cascade not null,
  property_value numeric(14,2) not null,
  gross_income numeric(14,2) not null,
  caixa_approved_value numeric(14,2) default 0,
  subsidy_value numeric(14,2) default 0,
  fgts_value numeric(14,2) default 0,
  system_type text default 'SAC' check (system_type in ('SAC', 'PRICE')),
  term_months int default 420,
  interest_rate_nominal numeric(5,2),
  down_payment_gap numeric(14,2) not null, -- Saldo devedor a parcelar com construtora
  builder_installment_plan jsonb not null, -- { sinal, mensais: {qtd, valor, vencimento}, reforcos: {qtd, valor, vencimento}, chaves, escritura }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Propostas Comerciais Emitidas
create table proposals (
  id uuid primary key default uuid_generate_v4(),
  deal_id uuid references deals(id) on delete cascade not null,
  simulation_id uuid references simulations(id) on delete set null,
  organization_id uuid references organizations(id) on delete cascade not null,
  proposal_number text not null,
  generated_pdf_url text,
  special_conditions text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Contratos & Minutas (Auditoria Jurídica)
create table contracts (
  id uuid primary key default uuid_generate_v4(),
  deal_id uuid references deals(id) on delete cascade not null,
  organization_id uuid references organizations(id) on delete cascade not null,
  title text not null,
  storage_path text not null,
  ai_audit_result jsonb, -- { summary, risk_alerts, missing_certificates, financial_rules }
  status text default 'em_analise' check (status in ('rascunho', 'em_analise', 'aprovado', 'assinado')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Landing Pages & Sites
create table landing_pages (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  slug text not null,
  subdomain text,
  custom_domain text,
  property_id uuid references properties(id) on delete set null,
  config jsonb default '{}'::jsonb,
  is_published boolean default false
);

-- 11. Redes Sociais & Fila de Posts
create table social_posts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  property_id uuid references properties(id) on delete set null,
  platforms text[] not null, -- ['instagram', 'facebook']
  caption text not null,
  media_urls text[] not null,
  scheduled_at timestamp with time zone not null,
  status text default 'pendente' check (status in ('pendente', 'publicado', 'falha')),
  error_message text
);

-- 12. Telemetria e Monitoramento de IA (SaaS Ready)
create table usage_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  feature text not null, -- 'whatsapp_chat', 'contract_audit', 'copywriter'
  prompt_tokens int default 0,
  completion_tokens int default 0,
  total_tokens int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);