import { SimulationSystem, BuilderInstallmentPlan } from "@/types/database";

export interface SimulationInput {
  propertyValue: number;
  grossIncome: number;
  fgtsValue: number;
  systemType: SimulationSystem;
  termMonths: number;
  interestRateAnnual?: number; // ex: 9.5%
  builderInstallmentsCount: number; // ex: 36 meses
  builderReforcosCount: number; // ex: 4 reforços
  sinalPercent: number; // ex: 10%
}

export interface SimulationResult {
  propertyValue: number;
  grossIncome: number;
  maxFinancingValue: number; // 80% do imóvel
  approvedFinancingValue: number; // considerando limite de 30% da renda
  subsidyValue: number;
  fgtsValue: number;
  firstInstallmentCaixa: number;
  lastInstallmentCaixa: number;
  systemType: SimulationSystem;
  termMonths: number;
  downPaymentGap: number; // Saldo que sobra para pagar à construtora
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

/**
 * Calcula subsídio estimado baseado na faixa de renda bruta (Programa MCMV / Habitual)
 */
export function estimateSubsidy(income: number, propertyValue: number): number {
  if (propertyValue > 350000) return 0;
  if (income <= 2640) return 55000;
  if (income <= 3500) {
    const factor = (3500 - income) / (3500 - 2640);
    return Math.round(18000 + factor * 37000);
  }
  if (income <= 4400) {
    const factor = (4400 - income) / (4400 - 3500);
    return Math.round(5000 + factor * 13000);
  }
  return 0;
}

/**
 * Calcula a simulação completa Caixa + Construtora
 */
export function calculateCaixaSimulation(input: SimulationInput): SimulationResult {
  const {
    propertyValue,
    grossIncome,
    fgtsValue,
    systemType,
    termMonths,
    interestRateAnnual = 9.25,
    builderInstallmentsCount = 36,
    builderReforcosCount = 4,
    sinalPercent = 10,
  } = input;

  // Limite máximo Caixa (80% do valor do imóvel)
  const maxLtvValue = propertyValue * 0.8;

  // Taxa de juros mensal efetiva
  const monthlyRate = Math.pow(1 + interestRateAnnual / 100, 1 / 12) - 1;

  // Capacidade de pagamento: Máximo de 30% da renda bruta na 1ª parcela
  const maxFirstInstallment = grossIncome * 0.3;

  // Estimativa do financiamento aprovado conforme a 1ª parcela no sistema SAC / PRICE
  let financingByIncome = 0;
  if (systemType === "SAC") {
    // Parcela 1 SAC = (PV / n) + (PV * i) = PV * (1/n + i)
    // PV = Parcela 1 / (1/n + i)
    const factor = 1 / termMonths + monthlyRate;
    financingByIncome = maxFirstInstallment / factor;
  } else {
    // PRICE: PMT = PV * [i * (1+i)^n] / [(1+i)^n - 1]
    const factor =
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    financingByIncome = maxFirstInstallment / factor;
  }

  // O financiamento aprovado é o menor entre o limite de 80% do imóvel e a capacidade de renda
  const approvedFinancingValue = Math.min(maxLtvValue, Math.round(financingByIncome));

  // Cálculo das parcelas Caixa
  let firstInstallmentCaixa = 0;
  let lastInstallmentCaixa = 0;

  if (systemType === "SAC") {
    const amort = approvedFinancingValue / termMonths;
    firstInstallmentCaixa = amort + approvedFinancingValue * monthlyRate;
    lastInstallmentCaixa = amort + amort * monthlyRate;
  } else {
    const factor =
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    firstInstallmentCaixa = approvedFinancingValue * factor;
    lastInstallmentCaixa = firstInstallmentCaixa;
  }

  // Subsídio
  const subsidyValue = estimateSubsidy(grossIncome, propertyValue);

  // Gap de Entrada (saldo total devedor para a construtora)
  const creditsSum = approvedFinancingValue + subsidyValue + fgtsValue;
  const downPaymentGap = Math.max(0, propertyValue - creditsSum);

  // Distribuição da Construtora:
  // - Sinal (ex: 10% do gap)
  // - Chaves (ex: 10% do gap)
  // - Reforços semestrais (ex: 20% do gap dividido em reforços)
  // - Mensais (o saldo restante dividido pelas parcelas de obras)
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

  // Estimativa de despesas cartorárias (ITBI + Registro ~ 4% do valor do imóvel)
  const escrituraEstimada = Math.round(propertyValue * 0.04);

  return {
    propertyValue,
    grossIncome,
    maxFinancingValue: maxLtvValue,
    approvedFinancingValue,
    subsidyValue,
    fgtsValue,
    firstInstallmentCaixa: Math.round(firstInstallmentCaixa),
    lastInstallmentCaixa: Math.round(lastInstallmentCaixa),
    systemType,
    termMonths,
    downPaymentGap,
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
      escrituraEstimada,
    },
  };
}
