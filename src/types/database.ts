export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'corretor';
export type PropertyType = 'apartamento' | 'casa' | 'terreno' | 'lancamento' | 'comercial';
export type PropertyStatus = 'disponivel' | 'reservado' | 'vendido' | 'inativo';
export type DealStage =
  | 'novo_lead'
  | 'triagem_ia'
  | 'contato_humano'
  | 'visita_agendada'
  | 'proposta'
  | 'credito_contrato'
  | 'fechado_ganho'
  | 'perdido';
export type SimulationSystem = 'SAC' | 'PRICE';
export type ContractStatus = 'rascunho' | 'em_analise' | 'aprovado' | 'assinado';
export type SocialPostStatus = 'pendente' | 'publicado' | 'falha';
export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin';

export interface PropertySpecs {
  quartos?: number;
  suites?: number;
  vagas?: number;
  unit?: string;
  box?: string;
  privative_area?: number;
  total_area?: number;
  incc_correction?: boolean;
  [key: string]: Json | undefined;
}

export interface SpouseData {
  name?: string;
  cpf?: string;
  rg?: string;
  profession?: string;
  email?: string;
}

export interface SearchProfile {
  max_price?: number;
  min_bedrooms?: number;
  preferred_neighborhoods?: string[];
  property_types?: PropertyType[];
}

export interface BuilderInstallmentPlan {
  sinal?: number;
  mensais?: {
    qtd: number;
    valor: number;
    primeiro_vencimento?: string;
  };
  reforcos?: {
    qtd: number;
    valor: number;
    periodicidade_meses?: number;
  };
  chaves?: number;
  escritura?: number;
  [key: string]: Json | undefined;
}

export interface AiAuditResult {
  summary?: string;
  risk_alerts?: string[];
  missing_certificates?: string[];
  financial_rules?: string[];
  score?: number;
  [key: string]: Json | undefined;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  creci: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  city: string;
  state: string;
  created_at: string;
}

export interface Profile {
  id: string;
  organization_id: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  organization_id: string;
  title: string;
  development_name: string | null;
  type: PropertyType;
  status: PropertyStatus;
  sale_price: number;
  discounted_price: number | null;
  neighborhood: string;
  city: string;
  specs: PropertySpecs;
  created_at: string;
}

export interface PropertyMedia {
  id: string;
  property_id: string;
  storage_path: string;
  is_cover: boolean;
  order_index: number;
}

export interface Contact {
  id: string;
  organization_id: string;
  name: string;
  phone: string;
  email: string | null;
  cpf: string | null;
  rg: string | null;
  marital_status: string | null;
  profession: string | null;
  spouse_data: SpouseData;
  search_profile: SearchProfile;
  created_at: string;
}

export interface Deal {
  id: string;
  organization_id: string;
  contact_id: string;
  property_id: string | null;
  assigned_to: string | null;
  stage: DealStage;
  deal_value: number | null;
  ai_paused: boolean;
  created_at: string;
}

export interface Simulation {
  id: string;
  deal_id: string;
  organization_id: string;
  property_value: number;
  gross_income: number;
  caixa_approved_value: number;
  subsidy_value: number;
  fgts_value: number;
  system_type: SimulationSystem;
  term_months: number;
  interest_rate_nominal: number | null;
  down_payment_gap: number;
  builder_installment_plan: BuilderInstallmentPlan;
  created_at: string;
}

export interface Proposal {
  id: string;
  deal_id: string;
  simulation_id: string | null;
  organization_id: string;
  proposal_number: string;
  generated_pdf_url: string | null;
  special_conditions: string | null;
  created_at: string;
}

export interface Contract {
  id: string;
  deal_id: string;
  organization_id: string;
  title: string;
  storage_path: string;
  ai_audit_result: AiAuditResult | null;
  status: ContractStatus;
  created_at: string;
}

export interface LandingPage {
  id: string;
  organization_id: string;
  slug: string;
  subdomain: string | null;
  custom_domain: string | null;
  property_id: string | null;
  config: Json;
  is_published: boolean;
}

export interface SocialPost {
  id: string;
  organization_id: string;
  property_id: string | null;
  platforms: SocialPlatform[];
  caption: string;
  media_urls: string[];
  scheduled_at: string;
  status: SocialPostStatus;
  error_message: string | null;
}

export interface UsageLog {
  id: string;
  organization_id: string;
  feature: 'whatsapp_chat' | 'contract_audit' | 'copywriter';
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  created_at: string;
}
