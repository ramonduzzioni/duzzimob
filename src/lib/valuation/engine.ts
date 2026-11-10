import { AmostraMercado, ImovelAvaliando, ResultadoEstatistico } from "./types";

export interface CalculateValuationParams {
  imovel: ImovelAvaliando;
  amostras: Array<Omit<AmostraMercado, "valorM2" | "isHomogeneizada" | "motivoDescarte">>;
  intervaloToleranciaPercent?: number; // padrão 15% (0.15)
}

export interface ValuationEngineResult {
  amostrasProcessadas: AmostraMercado[];
  estatisticas: ResultadoEstatistico;
}

export function calculateValuation({
  imovel,
  amostras,
  intervaloToleranciaPercent = 15,
}: CalculateValuationParams): ValuationEngineResult {
  const toleranciaDecimal = intervaloToleranciaPercent / 100;

  // 1. Calcula o valor do m² de cada amostra
  const amostrasCalculadas = amostras.map((amostra, idx) => {
    const area = amostra.areaUtilM2 > 0 ? amostra.areaUtilM2 : 1;
    const valorM2 = amostra.valorOferta / area;
    return {
      ...amostra,
      codigo: amostra.codigo || `A.${idx + 1}`,
      valorM2,
      isHomogeneizada: false,
      motivoDescarte: undefined as "ABAIXO_PISO" | "ACIMA_TETO" | undefined,
    };
  });

  const totalAmostras = amostrasCalculadas.length;

  if (totalAmostras === 0) {
    return {
      amostrasProcessadas: [],
      estatisticas: {
        totalAmostras: 0,
        amostrasValidas: 0,
        amostrasDescartadas: 0,
        somaM2TodasAmostras: 0,
        mediaAritmeticaBrutaM2: 0,
        intervaloToleranciaPercent,
        limiteInferiorM2: 0,
        limiteSuperiorM2: 0,
        somaM2AmostrasValidas: 0,
        mediaFinalSaneadaM2: 0,
        fatorApreciacaoPercent: imovel.fatorApreciacaoPercent,
        valorM2Apreciado: 0,
        valorAvaliacaoBase: 0,
        precoAnuncioSugerido: 0,
        precoTetoMaximo: 0,
        precoFechamentoSugerido: 0,
      },
    };
  }

  // 2. Média Aritmética Bruta (MA)
  const somaM2TodasAmostras = amostrasCalculadas.reduce((acc, curr) => acc + curr.valorM2, 0);
  const mediaAritmeticaBrutaM2 = somaM2TodasAmostras / totalAmostras;

  // 3. Limites de Saneamento Estatístico (NBR 14.653 - Chauvenet / Campo de Arbítrio)
  const limiteInferiorM2 = mediaAritmeticaBrutaM2 * (1 - toleranciaDecimal);
  const limiteSuperiorM2 = mediaAritmeticaBrutaM2 * (1 + toleranciaDecimal);

  // 4. Filtro e Homogeneização das Amostras
  let somaM2AmostrasValidas = 0;
  let amostrasValidasCount = 0;

  const amostrasProcessadas: AmostraMercado[] = amostrasCalculadas.map((amostra) => {
    let isHomogeneizada = true;
    let motivoDescarte: "ABAIXO_PISO" | "ACIMA_TETO" | undefined = undefined;

    if (amostra.valorM2 < limiteInferiorM2) {
      isHomogeneizada = false;
      motivoDescarte = "ABAIXO_PISO";
    } else if (amostra.valorM2 > limiteSuperiorM2) {
      isHomogeneizada = false;
      motivoDescarte = "ACIMA_TETO";
    }

    if (isHomogeneizada) {
      somaM2AmostrasValidas += amostra.valorM2;
      amostrasValidasCount++;
    }

    return {
      ...amostra,
      isHomogeneizada,
      motivoDescarte,
    };
  });

  // 5. Média Final Saneada (MF)
  const mediaFinalSaneadaM2 =
    amostrasValidasCount > 0 ? somaM2AmostrasValidas / amostrasValidasCount : mediaAritmeticaBrutaM2;

  // 6. Fator de Apreciação / Padrão Construtivo
  const fatorApreciacaoDec = (imovel.fatorApreciacaoPercent || 0) / 100;
  const valorM2Apreciado = mediaFinalSaneadaM2 * (1 + fatorApreciacaoDec);

  // 7. Formação de Preço
  const areaAvaliando = imovel.areaConstruidaM2 > 0 ? imovel.areaConstruidaM2 : 1;
  const benfeitorias = imovel.demaisBenfeitoriasValor || 0;

  const valorAvaliacaoBase = areaAvaliando * valorM2Apreciado + benfeitorias;

  // Fórmulas comerciais comprovadas pela planilha:
  // Preço para Anunciar: +5% (margem para negociação)
  const precoAnuncioSugerido = valorAvaliacaoBase * 1.05;
  // Preço Máximo Teto: +10.25% (teto de liquidez)
  const precoTetoMaximo = precoAnuncioSugerido * 1.05;
  // Preço para Fechar (Venda Rápida): -5%
  const precoFechamentoSugerido = valorAvaliacaoBase * 0.95;

  return {
    amostrasProcessadas,
    estatisticas: {
      totalAmostras,
      amostrasValidas: amostrasValidasCount,
      amostrasDescartadas: totalAmostras - amostrasValidasCount,
      somaM2TodasAmostras,
      mediaAritmeticaBrutaM2,
      intervaloToleranciaPercent,
      limiteInferiorM2,
      limiteSuperiorM2,
      somaM2AmostrasValidas,
      mediaFinalSaneadaM2,
      fatorApreciacaoPercent: imovel.fatorApreciacaoPercent,
      valorM2Apreciado,
      valorAvaliacaoBase,
      precoAnuncioSugerido,
      precoTetoMaximo,
      precoFechamentoSugerido,
    },
  };
}
