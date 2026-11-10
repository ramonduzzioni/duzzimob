import { SimulationSystem } from "@/types/database";

export interface SimulationInput {
  propertyValue: number;
  grossIncome: number;
  birthDate?: string; // YYYY-MM-DD ou DD/MM/AAAA
  referenceDate?: Date; // Data base para cálculo de idade
  cidade?: string;
  uf?: string;
  tetoMcmvPersonalizado?: number; // Permite sobrepor o teto oficial do município
  fgtsValue?: number;
  systemType?: SimulationSystem;
  termMonths?: number;
  interestRateAnnual?: number;
  builderInstallmentsCount?: number;
  builderReforcosCount?: number;
  sinalPercent?: number;
}

export interface MunicipioMcmvInfo {
  cidade: string;
  uf: string;
  tetoFaixa1e2: number;
  tetoFaixa3: number;
  tetoFaixa4: number;
  porteDescricao: string;
  enquadramentoMcmv: "FAIXA_1_2" | "FAIXA_3" | "FAIXA_4" | "SBPE";
  motivoEnquadramento: string;
}

export interface EncargosCaixa {
  tac: number; // Tarifa de Administração (R$ 25,00)
  dfi: number; // Danos Físicos ao Imóvel (0.0066% do imóvel)
  mip: number; // Morte e Invalidez Permanente (% sobre saldo devedor conforme idade)
  taxaMipPercentual: number;
  totalEncargosMensais: number;
}

export interface SimulationResult {
  propertyValue: number;
  grossIncome: number;
  proponentAgeYears: number;
  maxCaixaTermMonths: number;
  appliedTermMonths: number;
  interestRateAnnual: number;
  interestRateMonthly: number;
  caixaFaixaId: number;
  caixaFaixaNome: string;
  municipioInfo: MunicipioMcmvInfo;
  maxFinancingValue: number; // 80% do valor do imóvel
  approvedFinancingValue: number; // limitado a 30% da renda líquida de encargos
  subsidyValue: number;
  fgtsValue: number;
  firstInstallmentCaixa: number; // com TAC, DFI e MIP
  lastInstallmentCaixa: number;
  firstInstallmentBase: number;
  encargos: EncargosCaixa;
  systemType: SimulationSystem;
  downPaymentGap: number;
  rendaSuficiente: boolean;
  rendaMinimaNecessaria: number;
  comprometimentoRendaPercent: number;
  despesasCartorariasEstimadas: number; // 5% conforme Caixa
  builderPlan: {
    sinal: number;
    mensais: {
      qtd: number;
      valorUnitario: number;
      total: number;
    };
    reforcos: {
      qtd: number;
      valorUnitario: number;
      total: number;
    };
    chaves: number;
    escrituraEstimada: number;
  };
}

// -------------------------------------------------------------------------
// DADOS REVERSOS DO SIMULADOR OFICIAL DA CAIXA (app.novosimulador.caixa.gov.br)
// -------------------------------------------------------------------------

export const CAIXA_CONFIG = {
  idadeMaximaMeses: 966, // 80 anos e 6 meses
  prazoMaximoAnosPadrao: 35, // 420 meses
  percentualMaximoFinanciamento: 0.8, // 80% do imóvel
  percentualMaximoComprometimentoRenda: 0.3, // 30% da renda bruta
  percentualDespesasCartorarias: 0.05, // 5% do imóvel
  taxaTAC: 25.0, // R$ 25,00/mês
  taxaDFI: 0.0066, // 0.0066% ao mês sobre o valor do imóvel

  // Tabela Oficial MIP (Morte e Invalidez Permanente) da Caixa
  tabelaMIP: [
    { idade: 18, taxa: 0.0093 },
    { idade: 25, taxa: 0.0093 },
    { idade: 26, taxa: 0.0096 },
    { idade: 30, taxa: 0.0096 },
    { idade: 31, taxa: 0.0116 },
    { idade: 35, taxa: 0.0116 },
    { idade: 36, taxa: 0.0154 },
    { idade: 40, taxa: 0.0154 },
    { idade: 41, taxa: 0.0252 },
    { idade: 45, taxa: 0.0252 },
    { idade: 46, taxa: 0.0386 },
    { idade: 50, taxa: 0.0386 },
    { idade: 51, taxa: 0.0676 },
    { idade: 55, taxa: 0.0676 },
    { idade: 56, taxa: 0.1533 },
    { idade: 60, taxa: 0.1533 },
    { idade: 61, taxa: 0.2731 },
    { idade: 65, taxa: 0.2731 },
    { idade: 66, taxa: 0.3259 },
    { idade: 70, taxa: 0.3259 },
    { idade: 71, taxa: 0.4894 },
    { idade: 75, taxa: 0.4894 },
    { idade: 76, taxa: 0.5312 },
    { idade: 80, taxa: 0.5312 },
  ],

  // 10 Faixas de Renda e Taxas Efetivas da Caixa
  faixas: [
    { id: 1, limiteRenda: 2160, limiteImovel: 210000, taxaEfetiva: 0.048548 },
    { id: 2, limiteRenda: 2850, limiteImovel: 210000, taxaEfetiva: 0.051162 },
    { id: 3, limiteRenda: 3200, limiteImovel: 210000, taxaEfetiva: 0.053782 },
    { id: 4, limiteRenda: 3500, limiteImovel: 210000, taxaEfetiva: 0.056408 },
    { id: 5, limiteRenda: 4000, limiteImovel: 210000, taxaEfetiva: 0.061678 },
    { id: 6, limiteRenda: 5000, limiteImovel: 210000, taxaEfetiva: 0.07229 },
    { id: 7, limiteRenda: 9600, limiteImovel: 400000, taxaEfetiva: 0.084722 }, // Pró-Cotista / Faixa 3
    { id: 8, limiteRenda: 13000, limiteImovel: 600000, taxaEfetiva: 0.1047 },
    { id: 9, limiteRenda: 77500, limiteImovel: 2250000, taxaEfetiva: 0.1149 },
    { id: 10, limiteRenda: Infinity, limiteImovel: Infinity, taxaEfetiva: 0.134 },
  ],
};

/**
 * Converte data de nascimento para objeto Date seguro
 */
export function parseBirthDate(birthDateStr?: string): Date | null {
  if (!birthDateStr) return null;
  const str = String(birthDateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const d = new Date(`${str}T00:00:00`);
    return isNaN(d.getTime()) ? null : d;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [dia, mes, ano] = str.split("/").map(Number);
    const d = new Date(ano, mes - 1, dia);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Calcula idade em anos e meses a partir da data de nascimento
 */
export function calculateAgeInYears(birthDate: Date, referenceDate?: Date): number {
  const now = referenceDate || new Date(2025, 0, 1);
  let years = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
    years--;
  }
  return Math.max(0, years);
}

export function calculateAgeInMonths(birthDate: Date, referenceDate?: Date): number {
  const now = referenceDate || new Date(2025, 0, 1);
  let months = 12 * (now.getFullYear() - birthDate.getFullYear()) + (now.getMonth() - birthDate.getMonth());
  if (now.getDate() < birthDate.getDate()) {
    months -= 1;
  }
  return Math.max(0, months);
}

/**
 * Obtém a taxa MIP (Morte e Invalidez Permanente) exata pela idade
 */
export function getTaxaMipPorIdade(idadeAnos: number): number {
  const table = CAIXA_CONFIG.tabelaMIP;
  const clampedAge = Math.min(80, Math.max(18, idadeAnos));
  const found = table.find((item) => item.idade >= clampedAge);
  return found ? found.taxa : 0.0154;
}

export interface TetoMunicipioConfig {
  tetoFaixa1e2: number;
  porteDescricao: string;
  uf: string;
}

// Mapeamento Oficial de Tetos MCMV (Faixas 1 e 2) por Município / Porte Populacional
export const MCMV_TETOS_CONHECIDOS: Record<string, TetoMunicipioConfig> = {
  // Santa Catarina - Sul e Região Carbonífera
  "criciuma": { tetoFaixa1e2: 250000, porteDescricao: "Polo Regional Sul Catarinense (>215k hab)", uf: "SC" },
  "tubarao": { tetoFaixa1e2: 240000, porteDescricao: "Médio Porte Polo AMUREL", uf: "SC" },
  "icara": { tetoFaixa1e2: 230000, porteDescricao: "Região Carbonífera / Conurbação Criciúma", uf: "SC" },
  "forquilhinha": { tetoFaixa1e2: 220000, porteDescricao: "Região Carbonífera", uf: "SC" },
  "ararangua": { tetoFaixa1e2: 230000, porteDescricao: "Polo Vale do Araranguá", uf: "SC" },
  "urussanga": { tetoFaixa1e2: 210000, porteDescricao: "Região Carbonífera", uf: "SC" },
  "cocal do sul": { tetoFaixa1e2: 210000, porteDescricao: "Região Carbonífera", uf: "SC" },
  "morro da fumaca": { tetoFaixa1e2: 210000, porteDescricao: "Região Carbonífera", uf: "SC" },
  "sombrio": { tetoFaixa1e2: 210000, porteDescricao: "Extremo Sul Catarinense", uf: "SC" },
  "nova veneza": { tetoFaixa1e2: 210000, porteDescricao: "Região Carbonífera", uf: "SC" },
  "laguna": { tetoFaixa1e2: 220000, porteDescricao: "Litoral Sul AMUREL", uf: "SC" },
  "imbituba": { tetoFaixa1e2: 230000, porteDescricao: "Polo Portuário Sul", uf: "SC" },

  // Santa Catarina - Demais Regiões
  "florianopolis": { tetoFaixa1e2: 275000, porteDescricao: "Capital / Região Metropolitana", uf: "SC" },
  "sao jose": { tetoFaixa1e2: 275000, porteDescricao: "Região Metropolitana da Capital", uf: "SC" },
  "palhoca": { tetoFaixa1e2: 275000, porteDescricao: "Região Metropolitana da Capital", uf: "SC" },
  "biguacu": { tetoFaixa1e2: 275000, porteDescricao: "Região Metropolitana da Capital", uf: "SC" },
  "joinville": { tetoFaixa1e2: 270000, porteDescricao: "Grande Porte (>600k hab)", uf: "SC" },
  "blumenau": { tetoFaixa1e2: 260000, porteDescricao: "Grande Porte Vale do Itajaí", uf: "SC" },
  "itajai": { tetoFaixa1e2: 260000, porteDescricao: "Polo Portuário / Foz do Itajaí", uf: "SC" },
  "balneario camboriu": { tetoFaixa1e2: 260000, porteDescricao: "Litoral Norte / Alto Custo", uf: "SC" },
  "camboriu": { tetoFaixa1e2: 250000, porteDescricao: "Conurbação Balneário Camboriú", uf: "SC" },
  "navegantes": { tetoFaixa1e2: 250000, porteDescricao: "Conurbação Foz do Itajaí", uf: "SC" },
  "brusque": { tetoFaixa1e2: 245000, porteDescricao: "Polo Têxtil / Médio Porte", uf: "SC" },
  "chapeco": { tetoFaixa1e2: 250000, porteDescricao: "Polo Oeste Catarinense", uf: "SC" },
  "lages": { tetoFaixa1e2: 240000, porteDescricao: "Polo Planalto Serrano", uf: "SC" },
  "jaragua do sul": { tetoFaixa1e2: 250000, porteDescricao: "Polo Industrial Norte", uf: "SC" },

  // Capitais e Metrópoles Nacionais
  "sao paulo": { tetoFaixa1e2: 275000, porteDescricao: "Metrópole Nacional", uf: "SP" },
  "rio de janeiro": { tetoFaixa1e2: 275000, porteDescricao: "Metrópole Nacional", uf: "RJ" },
  "brasilia": { tetoFaixa1e2: 275000, porteDescricao: "Distrito Federal / Capital", uf: "DF" },
  "belo horizonte": { tetoFaixa1e2: 275000, porteDescricao: "Metrópole Regional", uf: "MG" },
  "curitiba": { tetoFaixa1e2: 275000, porteDescricao: "Metrópole Regional", uf: "PR" },
  "porto alegre": { tetoFaixa1e2: 275000, porteDescricao: "Metrópole Regional", uf: "RS" },
  "salvador": { tetoFaixa1e2: 275000, porteDescricao: "Metrópole Regional", uf: "BA" },
  "fortaleza": { tetoFaixa1e2: 275000, porteDescricao: "Metrópole Regional", uf: "CE" },
  "recife": { tetoFaixa1e2: 275000, porteDescricao: "Metrópole Regional", uf: "PE" },
  "goiania": { tetoFaixa1e2: 275000, porteDescricao: "Metrópole Regional", uf: "GO" },
  "manaus": { tetoFaixa1e2: 275000, porteDescricao: "Metrópole Regional", uf: "AM" },
  "belem": { tetoFaixa1e2: 275000, porteDescricao: "Metrópole Regional", uf: "PA" },
  "campinas": { tetoFaixa1e2: 275000, porteDescricao: "Região Metropolitana Campinas", uf: "SP" },
  "santos": { tetoFaixa1e2: 270000, porteDescricao: "Baixada Santista", uf: "SP" },
  "sorocaba": { tetoFaixa1e2: 265000, porteDescricao: "Grande Porte Interior SP", uf: "SP" },
  "londrina": { tetoFaixa1e2: 260000, porteDescricao: "Polo Norte Paranaense", uf: "PR" },
  "maringa": { tetoFaixa1e2: 260000, porteDescricao: "Polo Noroeste Paranaense", uf: "PR" },
  "caxias do sul": { tetoFaixa1e2: 260000, porteDescricao: "Polo Industrial Serra Gaúcha", uf: "RS" },
};

export function normalizeCityName(cityName: string): string {
  return cityName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Obtém os tetos do Minha Casa Minha Vida por Município
 */
export function getMunicipioMcmvInfo(
  cidade?: string,
  uf?: string,
  tetoOverride?: number
): MunicipioMcmvInfo {
  const rawCity = (cidade || "Criciúma").trim();
  const rawUf = (uf || "SC").trim().toUpperCase();
  const normCity = normalizeCityName(rawCity);
  const found = MCMV_TETOS_CONHECIDOS[normCity];

  let tetoFaixa1e2 = 210000;
  let porteDescricao = "Município Geral (Interior / População < 100k)";

  if (found) {
    tetoFaixa1e2 = found.tetoFaixa1e2;
    porteDescricao = found.porteDescricao;
  } else if (normCity.includes("capital") || ["SP", "RJ", "DF"].includes(rawUf)) {
    tetoFaixa1e2 = 275000;
    porteDescricao = "Capital / Metrópole Regional";
  }

  // Se o corretor informou um teto personalizado
  if (tetoOverride && tetoOverride > 0) {
    tetoFaixa1e2 = tetoOverride;
    porteDescricao = `Teto Personalizado (R$ ${tetoOverride.toLocaleString("pt-BR")})`;
  }

  return {
    cidade: rawCity,
    uf: rawUf,
    tetoFaixa1e2,
    tetoFaixa3: 400000, // Teto Nacional MCMV Faixa 3
    tetoFaixa4: 600000, // Teto Nacional MCMV Faixa 4
    porteDescricao,
    enquadramentoMcmv: "FAIXA_1_2",
    motivoEnquadramento: "",
  };
}

/**
 * Gera as faixas da Caixa ajustadas ao Teto MCMV específico do município
 */
export function getFaixasCaixaParaMunicipio(tetoFaixa1e2: number) {
  return [
    { id: 1, nome: "MCMV Faixa 1 (Sub 1)", limiteRenda: 2160, limiteImovel: tetoFaixa1e2, taxaEfetiva: 0.048548 },
    { id: 2, nome: "MCMV Faixa 1 (Sub 2)", limiteRenda: 2850, limiteImovel: tetoFaixa1e2, taxaEfetiva: 0.051162 },
    { id: 3, nome: "MCMV Faixa 2 (Sub 1)", limiteRenda: 3200, limiteImovel: tetoFaixa1e2, taxaEfetiva: 0.053782 },
    { id: 4, nome: "MCMV Faixa 2 (Sub 2)", limiteRenda: 3500, limiteImovel: tetoFaixa1e2, taxaEfetiva: 0.056408 },
    { id: 5, nome: "MCMV Faixa 2 (Sub 3)", limiteRenda: 4000, limiteImovel: tetoFaixa1e2, taxaEfetiva: 0.061678 },
    { id: 6, nome: "MCMV Faixa 2 (Sub 4)", limiteRenda: 5000, limiteImovel: tetoFaixa1e2, taxaEfetiva: 0.07229 },
    { id: 7, nome: "MCMV Faixa 3 / Pró-Cotista", limiteRenda: 9600, limiteImovel: 400000, taxaEfetiva: 0.084722 },
    { id: 8, nome: "MCMV Faixa 4 / SBPE Especial", limiteRenda: 13000, limiteImovel: 600000, taxaEfetiva: 0.1047 },
    { id: 9, nome: "SBPE Mercado Tradicional", limiteRenda: 77500, limiteImovel: 2250000, taxaEfetiva: 0.1149 },
    { id: 10, nome: "Carteira Hipotecária / Livre", limiteRenda: Infinity, limiteImovel: Infinity, taxaEfetiva: 0.134 },
  ];
}

/**
 * Identifica a faixa de taxa da Caixa por Renda, Valor do Imóvel e Teto da Cidade.
 * REGRA CAIXA: O teto do município altera a faixa e, consequentemente, a taxa de juros!
 */
export function getFaixaCaixa(renda: number, valorImovel: number, tetoFaixa1e2: number = 250000) {
  const faixas = getFaixasCaixaParaMunicipio(tetoFaixa1e2);
  const idxRenda = faixas.findIndex((f) => renda <= f.limiteRenda);
  const idxImovel = faixas.findIndex((f) => valorImovel <= f.limiteImovel);

  const safeIdxRenda = idxRenda >= 0 ? idxRenda : faixas.length - 1;
  const safeIdxImovel = idxImovel >= 0 ? idxImovel : faixas.length - 1;

  // A regra mestra da Caixa: o teto do imóvel empurra a faixa se o imóvel ultrapassar o limite municipal!
  const finalIdx = Math.max(safeIdxRenda, safeIdxImovel);
  const faixa = faixas[finalIdx];

  let enquadramentoMcmv: "FAIXA_1_2" | "FAIXA_3" | "FAIXA_4" | "SBPE" = "FAIXA_1_2";
  let motivoEnquadramento = "";

  if (finalIdx <= 5) {
    enquadramentoMcmv = "FAIXA_1_2";
    motivoEnquadramento = `Imóvel (R$ ${valorImovel.toLocaleString("pt-BR")}) dentro do teto MCMV municipal (R$ ${tetoFaixa1e2.toLocaleString("pt-BR")}) e renda familiar elegível para Faixa 1/2 com taxa social subsidiada de ${(faixa.taxaEfetiva * 100).toFixed(2)}% a.a.`;
  } else if (finalIdx === 6) {
    enquadramentoMcmv = "FAIXA_3";
    if (safeIdxImovel > safeIdxRenda) {
      motivoEnquadramento = `O imóvel (R$ ${valorImovel.toLocaleString("pt-BR")}) ultrapassou o teto de Faixa 1/2 do município (R$ ${tetoFaixa1e2.toLocaleString("pt-BR")}). Reenquadrado para MCMV Faixa 3 (Teto até R$ 400.000), elevando a taxa para ${(faixa.taxaEfetiva * 100).toFixed(2)}% a.a. sem direito a subsídio.`;
    } else {
      motivoEnquadramento = `Enquadrado no MCMV Faixa 3 por renda familiar (R$ ${renda.toLocaleString("pt-BR")}), com taxa de ${(faixa.taxaEfetiva * 100).toFixed(2)}% a.a.`;
    }
  } else if (finalIdx === 7) {
    enquadramentoMcmv = "FAIXA_4";
    if (safeIdxImovel > safeIdxRenda) {
      motivoEnquadramento = `O imóvel (R$ ${valorImovel.toLocaleString("pt-BR")}) ultrapassou o teto do MCMV Faixa 3 (R$ 400.000). Reenquadrado para Faixa 4 (Classe Média até R$ 600.000) com taxa de ${(faixa.taxaEfetiva * 100).toFixed(2)}% a.a.`;
    } else {
      motivoEnquadramento = `Enquadrado na Faixa 4 / Classe Média por renda com taxa de ${(faixa.taxaEfetiva * 100).toFixed(2)}% a.a.`;
    }
  } else {
    enquadramentoMcmv = "SBPE";
    motivoEnquadramento = `Financiamento SBPE / Mercado tradicional (fora do programa MCMV), com taxa de ${(faixa.taxaEfetiva * 100).toFixed(2)}% a.a.`;
  }

  return {
    ...faixa,
    enquadramentoMcmv,
    motivoEnquadramento,
  };
}

/**
 * Estima o subsídio habitacional (MCMV) com base na renda e no teto municipal do imóvel
 */
export function estimateSubsidy(income: number, propertyValue: number, tetoFaixa1e2: number): number {
  // Regra Caixa: Se o imóvel for superior ao teto do município para Faixa 1 e 2, NÃO HÁ SUBSÍDIO
  if (propertyValue > tetoFaixa1e2) return 0;
  // Se a renda for superior a R$ 4.400,00, não há subsídio
  if (income > 4400) return 0;

  // Cidades polo/médias com teto >= 250.000 têm subsídio teto de até R$ 55.000
  const maxSubsidio = tetoFaixa1e2 >= 250000 ? 55000 : 47500;

  if (income <= 2160) return maxSubsidio;
  if (income <= 2850) {
    const factor = (2850 - income) / (2850 - 2160);
    return Math.round(30000 + factor * (maxSubsidio - 30000));
  }
  if (income <= 3500) {
    const factor = (3500 - income) / (3500 - 2850);
    return Math.round(15000 + factor * 15000);
  }
  if (income <= 4400) {
    const factor = (4400 - income) / (4400 - 3500);
    return Math.round(4000 + factor * 11000);
  }
  return 0;
}

/**
 * Motor Completo de Simulação Caixa com Idade, TAC, DFI, MIP e Sistema SAC / PRICE
 */
export function calculateCaixaSimulation(input: SimulationInput): SimulationResult {
  const {
    propertyValue,
    grossIncome,
    birthDate: birthDateInput = "1994-05-15", // default 30 anos se não informado
    cidade = "Criciúma",
    uf = "SC",
    fgtsValue = 0,
    builderInstallmentsCount = 36,
    builderReforcosCount = 4,
    sinalPercent = 10,
  } = input;

  // 1. Idade do Proponente e Prazo Máximo pela Regra dos 966 Meses (80,5 anos)
  const birthDateObj = parseBirthDate(birthDateInput) || new Date(1994, 4, 15);
  const ageYears = calculateAgeInYears(birthDateObj, input.referenceDate);
  const ageMonths = calculateAgeInMonths(birthDateObj, input.referenceDate);

  // Prazo máximo permitido pela Caixa para esta idade
  const maxAllowedMonthsByAge = Math.max(0, CAIXA_CONFIG.idadeMaximaMeses - ageMonths);
  const maxTermDefault = CAIXA_CONFIG.prazoMaximoAnosPadrao * 12; // 420 meses
  const maxCaixaTermMonths = Math.min(maxTermDefault, maxAllowedMonthsByAge);

  // Prazo aplicado (se o usuário escolheu um prazo menor ou o teto da idade)
  const requestedTerm = input.termMonths || 420;
  const appliedTermMonths = Math.min(requestedTerm, maxCaixaTermMonths);
  const safeTermMonths = Math.max(1, appliedTermMonths);

  // 2. Diagnóstico do Município e Teto MCMV Oficial
  const municipioInfo = getMunicipioMcmvInfo(cidade, uf, input.tetoMcmvPersonalizado);

  // 3. Faixa e Taxa de Juros Caixa (REGRA CAIXA: o teto do município altera a faixa e a taxa)
  const faixa = getFaixaCaixa(grossIncome, propertyValue, municipioInfo.tetoFaixa1e2);
  municipioInfo.enquadramentoMcmv = faixa.enquadramentoMcmv;
  municipioInfo.motivoEnquadramento = faixa.motivoEnquadramento;

  const interestRateAnnual = input.interestRateAnnual || Number((faixa.taxaEfetiva * 100).toFixed(2));
  const interestRateMonthly = Math.pow(1 + interestRateAnnual / 100, 1 / 12) - 1;

  // 4. Sistema de Amortização
  // Regra Caixa: Se juros >= 10.92%, padrão é SAC. Caso contrário, permite escolha
  let systemType: SimulationSystem = input.systemType || (interestRateAnnual >= 10.92 ? "SAC" : "PRICE");

  // 5. Encargos Fixos e de Seguros Mensais da Caixa
  const taxaMipPercent = getTaxaMipPorIdade(ageYears);
  const tac = CAIXA_CONFIG.taxaTAC; // R$ 25,00
  const dfi = (CAIXA_CONFIG.taxaDFI / 100) * propertyValue; // 0.0066% do imóvel

  // 6. Limite de Financiamento por Renda (Comprometimento Máximo de 30%)
  const maxMonthlyPaymentAllowed = grossIncome * CAIXA_CONFIG.percentualMaximoComprometimentoRenda;
  const maxLtvValue = Math.round(propertyValue * CAIXA_CONFIG.percentualMaximoFinanciamento);

  let amortFactor = 0;
  if (systemType === "SAC") {
    amortFactor = 1 / safeTermMonths + interestRateMonthly;
  } else {
    amortFactor =
      interestRateMonthly === 0
        ? 1 / safeTermMonths
        : interestRateMonthly / (1 - Math.pow(1 + interestRateMonthly, -safeTermMonths));
  }

  const mipFactor = taxaMipPercent / 100;
  const availableForFinancing = Math.max(0, maxMonthlyPaymentAllowed - tac - dfi);
  const maxFinancingByIncome = Math.round(availableForFinancing / (amortFactor + mipFactor));

  // Valor aprovado é limitado a 80% do valor do imóvel e à capacidade da renda
  const approvedFinancingValue =
    maxCaixaTermMonths <= 0 ? 0 : Math.min(maxLtvValue, Math.max(0, maxFinancingByIncome));

  // 6. Cálculo das Parcelas Reais com o Valor Aprovado
  let firstInstallmentBase = 0;
  let lastInstallmentBase = 0;
  const initialMip = mipFactor * approvedFinancingValue;
  const totalEncargosMensais = tac + dfi + initialMip;

  if (approvedFinancingValue > 0) {
    if (systemType === "SAC") {
      const amort = approvedFinancingValue / safeTermMonths;
      firstInstallmentBase = amort + approvedFinancingValue * interestRateMonthly;
      lastInstallmentBase = amort + amort * interestRateMonthly;
    } else {
      firstInstallmentBase = approvedFinancingValue * amortFactor;
      lastInstallmentBase = firstInstallmentBase;
    }
  }

  const firstInstallmentCaixa =
    approvedFinancingValue > 0 ? Math.round(firstInstallmentBase + totalEncargosMensais) : 0;
  const lastInstallmentCaixa =
    approvedFinancingValue > 0
      ? Math.round(
          lastInstallmentBase +
            tac +
            dfi +
            mipFactor * (approvedFinancingValue / safeTermMonths)
        )
      : 0;

  // Subsídio MCMV (considera o teto de Faixa 1/2 do município)
  const subsidyValue = estimateSubsidy(grossIncome, propertyValue, municipioInfo.tetoFaixa1e2);

  // Saldo de Entrada com a Construtora (Gap)
  const totalCredits = approvedFinancingValue + subsidyValue + fgtsValue;
  const downPaymentGap = Math.max(0, propertyValue - totalCredits);

  // Renda necessária para financiar 80% integralmente
  const fullFinancingInstallment = maxLtvValue * (amortFactor + mipFactor) + tac + dfi;
  const rendaMinimaNecessaria = Math.round(fullFinancingInstallment / 0.3);
  const rendaSuficiente = approvedFinancingValue >= maxLtvValue;
  const comprometimentoRendaPercent = Math.min(100, Math.round((firstInstallmentCaixa / grossIncome) * 100));

  // 7. Distribuição do Fluxo da Construtora
  const sinal = Math.round((downPaymentGap * sinalPercent) / 100);
  const chaves = Math.round(downPaymentGap * 0.1);
  const totalReforcos = builderReforcosCount > 0 ? Math.round(downPaymentGap * 0.25) : 0;
  const valorUnitarioReforco =
    builderReforcosCount > 0 ? Math.round(totalReforcos / builderReforcosCount) : 0;

  const totalMensais = Math.max(0, downPaymentGap - sinal - chaves - totalReforcos);
  const valorUnitarioMensal =
    builderInstallmentsCount > 0
      ? Math.round(totalMensais / builderInstallmentsCount)
      : 0;

  const despesasCartorariasEstimadas = Math.round(propertyValue * CAIXA_CONFIG.percentualDespesasCartorarias);

  return {
    propertyValue,
    grossIncome,
    proponentAgeYears: ageYears,
    maxCaixaTermMonths,
    appliedTermMonths,
    interestRateAnnual,
    interestRateMonthly,
    caixaFaixaId: faixa.id,
    caixaFaixaNome: faixa.nome,
    municipioInfo,
    maxFinancingValue: maxLtvValue,
    approvedFinancingValue,
    subsidyValue,
    fgtsValue,
    firstInstallmentCaixa,
    lastInstallmentCaixa,
    firstInstallmentBase: Math.round(firstInstallmentBase),
    encargos: {
      tac,
      dfi: Math.round(dfi),
      mip: Math.round(initialMip),
      taxaMipPercentual: taxaMipPercent,
      totalEncargosMensais: Math.round(totalEncargosMensais),
    },
    systemType,
    downPaymentGap,
    rendaSuficiente,
    rendaMinimaNecessaria,
    comprometimentoRendaPercent,
    despesasCartorariasEstimadas,
    builderPlan: {
      sinal,
      mensais: {
        qtd: builderInstallmentsCount,
        valorUnitario: valorUnitarioMensal,
        total: totalMensais,
      },
      reforcos: {
        qtd: builderReforcosCount,
        valorUnitario: valorUnitarioReforco,
        total: totalReforcos,
      },
      chaves,
      escrituraEstimada: despesasCartorariasEstimadas,
    },
  };
}
