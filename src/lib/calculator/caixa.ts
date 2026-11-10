import { SimulationSystem } from "@/types/database";

export interface SimulationInput {
  propertyValue: number;
  grossIncome: number;
  birthDate?: string; // YYYY-MM-DD ou DD/MM/AAAA
  referenceDate?: Date; // Data base para cálculo de idade
  cidade?: string;
  uf?: string;
  fgtsValue?: number;
  systemType?: SimulationSystem;
  termMonths?: number;
  interestRateAnnual?: number;
  builderInstallmentsCount?: number;
  builderReforcosCount?: number;
  sinalPercent?: number;
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

/**
 * Identifica a faixa de taxa da Caixa por Renda e Valor do Imóvel
 */
export function getFaixaCaixa(renda: number, valorImovel: number) {
  const idxRenda = CAIXA_CONFIG.faixas.findIndex((f) => renda <= f.limiteRenda);
  const idxImovel = CAIXA_CONFIG.faixas.findIndex((f) => valorImovel <= f.limiteImovel);
  const maxIdx = Math.max(
    idxRenda >= 0 ? idxRenda : CAIXA_CONFIG.faixas.length - 1,
    idxImovel >= 0 ? idxImovel : CAIXA_CONFIG.faixas.length - 1
  );
  return CAIXA_CONFIG.faixas[maxIdx];
}

/**
 * Estima o subsídio habitacional (MCMV) com base na renda e porte do município
 */
export function estimateSubsidy(income: number, propertyValue: number, cidade?: string): number {
  // Se o imóvel for superior a 350 mil, não se enquadra em subsídio MCMV
  if (propertyValue > 350000) return 0;

  // Cidades polo/médias como Criciúma ou capitais têm teto de subsídio até R$ 55.000
  const maxSubsidio = 55000;

  if (income <= 2160) return maxSubsidio;
  if (income <= 2850) {
    const factor = (2850 - income) / (2850 - 2160);
    return Math.round(30000 + factor * 25000);
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

  // 2. Faixa e Taxa de Juros Caixa
  const faixa = getFaixaCaixa(grossIncome, propertyValue);
  const interestRateAnnual = input.interestRateAnnual || Number((faixa.taxaEfetiva * 100).toFixed(2));
  const interestRateMonthly = Math.pow(1 + interestRateAnnual / 100, 1 / 12) - 1;

  // 3. Sistema de Amortização
  // Regra Caixa: Se juros >= 10.92%, padrão é SAC. Caso contrário, permite escolha
  let systemType: SimulationSystem = input.systemType || (interestRateAnnual >= 10.92 ? "SAC" : "PRICE");

  // 4. Encargos Fixos e de Seguros Mensais da Caixa
  const taxaMipPercent = getTaxaMipPorIdade(ageYears);
  const tac = CAIXA_CONFIG.taxaTAC; // R$ 25,00
  const dfi = (CAIXA_CONFIG.taxaDFI / 100) * propertyValue; // 0.0066% do imóvel

  // 5. Limite de Financiamento por Renda (Comprometimento Máximo de 30%)
  const maxMonthlyPaymentAllowed = grossIncome * CAIXA_CONFIG.percentualMaximoComprometimentoRenda;
  const maxLtvValue = Math.round(propertyValue * CAIXA_CONFIG.percentualMaximoFinanciamento);

  // Calcula capacidade máxima de financiamento considerando que a 1ª Parcela Total = Parcela Base + Encargos <= Renda * 0.3
  // Parcela Base SAC = PV * (1/n + i)
  // Parcela Base PRICE = PV * [i / (1 - (1+i)^-n)]
  // Encargos = TAC + DFI + (taxaMIP * PV)
  // Logo: 1ª Parcela = PV * (FatorAmort + taxaMIP) + (TAC + DFI) <= MaxMonthly
  // PV <= (MaxMonthly - TAC - DFI) / (FatorAmort + taxaMIP)
  let amortFactor = 0;
  if (systemType === "SAC") {
    amortFactor = 1 / appliedTermMonths + interestRateMonthly;
  } else {
    amortFactor =
      interestRateMonthly === 0
        ? 1 / appliedTermMonths
        : interestRateMonthly / (1 - Math.pow(1 + interestRateMonthly, -appliedTermMonths));
  }

  const mipFactor = taxaMipPercent / 100;
  const availableForFinancing = Math.max(0, maxMonthlyPaymentAllowed - tac - dfi);
  const maxFinancingByIncome = Math.round(availableForFinancing / (amortFactor + mipFactor));

  // Valor aprovado é limitado a 80% do valor do imóvel e à capacidade da renda
  const approvedFinancingValue = Math.min(maxLtvValue, Math.max(0, maxFinancingByIncome));

  // 6. Cálculo das Parcelas Reais com o Valor Aprovado
  let firstInstallmentBase = 0;
  let lastInstallmentBase = 0;
  const initialMip = mipFactor * approvedFinancingValue;
  const totalEncargosMensais = tac + dfi + initialMip;

  if (systemType === "SAC") {
    const amort = approvedFinancingValue / appliedTermMonths;
    firstInstallmentBase = amort + approvedFinancingValue * interestRateMonthly;
    lastInstallmentBase = amort + amort * interestRateMonthly;
  } else {
    firstInstallmentBase = approvedFinancingValue * amortFactor;
    lastInstallmentBase = firstInstallmentBase;
  }

  const firstInstallmentCaixa = Math.round(firstInstallmentBase + totalEncargosMensais);
  const lastInstallmentCaixa = Math.round(lastInstallmentBase + tac + dfi + (mipFactor * (approvedFinancingValue / appliedTermMonths)));

  // Subsídio MCMV
  const subsidyValue = estimateSubsidy(grossIncome, propertyValue, cidade);

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
