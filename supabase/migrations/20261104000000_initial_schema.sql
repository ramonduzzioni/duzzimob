-- ============================================================
-- DUZZIMOB v1.0 — INITIAL MULTI-TENANT SCHEMA & RLS POLICIES
-- ============================================================

-- 0. Habilitar extensões
create extension if not exists "uuid-ossp";

-- 1. Organizações (Tenants)
create table if not exists organizations (
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
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  organization_id uuid references organizations(id) on delete cascade not null,
  full_name text not null,
  role text default 'corretor' check (role in ('admin', 'corretor')),
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Imóveis
create table if not exists properties (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  title text not null,
  development_name text,
  type text not null check (type in ('apartamento', 'casa', 'terreno', 'lancamento', 'comercial')),
  status text default 'disponivel' check (status in ('disponivel', 'reservado', 'vendido', 'inativo')),
  sale_price numeric(14,2) not null,
  discounted_price numeric(14,2),
  neighborhood text not null,
  city text not null,
  specs jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Fotos e Documentos do Imóvel
create table if not exists property_media (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete cascade not null,
  storage_path text not null,
  is_cover boolean default false,
  order_index int default 0
);

-- 5. Contatos (Clientes / Compradores / Proprietários)
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  phone text not null,
  email text,
  cpf text,
  rg text,
  marital_status text,
  profession text,
  spouse_data jsonb default '{}'::jsonb,
  search_profile jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Negócios (Funil Kanban)
create table if not exists deals (
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
create table if not exists simulations (
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
  down_payment_gap numeric(14,2) not null,
  builder_installment_plan jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Propostas Comerciais Emitidas
create table if not exists proposals (
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
create table if not exists contracts (
  id uuid primary key default uuid_generate_v4(),
  deal_id uuid references deals(id) on delete cascade not null,
  organization_id uuid references organizations(id) on delete cascade not null,
  title text not null,
  storage_path text not null,
  ai_audit_result jsonb,
  status text default 'em_analise' check (status in ('rascunho', 'em_analise', 'aprovado', 'assinado')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Landing Pages & Sites
create table if not exists landing_pages (
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
create table if not exists social_posts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  property_id uuid references properties(id) on delete set null,
  platforms text[] not null,
  caption text not null,
  media_urls text[] not null,
  scheduled_at timestamp with time zone not null,
  status text default 'pendente' check (status in ('pendente', 'publicado', 'falha')),
  error_message text
);

-- 12. Telemetria e Monitoramento de IA (SaaS Ready)
create table if not exists usage_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  feature text not null,
  prompt_tokens int default 0,
  completion_tokens int default 0,
  total_tokens int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- ÍNDICES DE PERFORMANCE
-- ============================================================
create index if not exists idx_profiles_organization_id on profiles(organization_id);
create index if not exists idx_properties_organization_id on properties(organization_id);
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_contacts_organization_id on contacts(organization_id);
create index if not exists idx_deals_organization_id on deals(organization_id);
create index if not exists idx_deals_stage on deals(stage);
create index if not exists idx_simulations_deal_id on simulations(deal_id);
create index if not exists idx_contracts_deal_id on contracts(deal_id);
create index if not exists idx_social_posts_scheduled_at on social_posts(scheduled_at);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) MULTI-TENANT
-- ============================================================
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table properties enable row level security;
alter table property_media enable row level security;
alter table contacts enable row level security;
alter table deals enable row level security;
alter table simulations enable row level security;
alter table proposals enable row level security;
alter table contracts enable row level security;
alter table landing_pages enable row level security;
alter table social_posts enable row level security;
alter table usage_logs enable row level security;

-- Helper function: Obter organization_id do usuário autenticado
create or replace function get_current_user_org_id()
returns uuid
language sql
security definer
stable
as $$
  select organization_id from profiles where id = auth.uid() limit 1;
$$;

-- Políticas para Profiles
create policy "Users can view profiles in the same organization"
  on profiles for select
  using (organization_id = get_current_user_org_id());

create policy "Users can update their own profile"
  on profiles for update
  using (id = auth.uid());

-- Políticas Genéricas Multi-tenant para tabelas com organization_id
create policy "Tenant isolation for properties"
  on properties for all
  using (organization_id = get_current_user_org_id())
  with check (organization_id = get_current_user_org_id());

create policy "Tenant isolation for contacts"
  on contacts for all
  using (organization_id = get_current_user_org_id())
  with check (organization_id = get_current_user_org_id());

create policy "Tenant isolation for deals"
  on deals for all
  using (organization_id = get_current_user_org_id())
  with check (organization_id = get_current_user_org_id());

create policy "Tenant isolation for simulations"
  on simulations for all
  using (organization_id = get_current_user_org_id())
  with check (organization_id = get_current_user_org_id());

create policy "Tenant isolation for proposals"
  on proposals for all
  using (organization_id = get_current_user_org_id())
  with check (organization_id = get_current_user_org_id());

create policy "Tenant isolation for contracts"
  on contracts for all
  using (organization_id = get_current_user_org_id())
  with check (organization_id = get_current_user_org_id());

create policy "Tenant isolation for landing_pages"
  on landing_pages for all
  using (organization_id = get_current_user_org_id())
  with check (organization_id = get_current_user_org_id());

create policy "Tenant isolation for social_posts"
  on social_posts for all
  using (organization_id = get_current_user_org_id())
  with check (organization_id = get_current_user_org_id());

create policy "Tenant isolation for usage_logs"
  on usage_logs for all
  using (organization_id = get_current_user_org_id())
  with check (organization_id = get_current_user_org_id());
