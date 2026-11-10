export type TipoImovel = "casa" | "apartamento" | "terreno" | "comercial" | "cobertura" | "sobrado";
export type PadraoConstrutivo = "minimo" | "baixo" | "medio" | "alto" | "luxo";
export type EstadoConservacao = "novo" | "otimo" | "bom" | "regular" | "reforma";
export type Metodologia = "MCDDM" | "evolutivo" | "involutivo" | "renda";

export interface AmostraMercado {
  id: string;
  codigo: string; // Ex: A.1, A.2...
  proprietarioOuFonte: string; // Ex: Wins, Duda Imóveis, Primaro
  bairro: string;
  cidade: string;
  quartos: number;
  vagas: number;
  areaUtilM2: number;
  valorOferta: number;
  // Campos calculados
  valorM2: number;
  isHomogeneizada: boolean; // se está dentro da faixa [limiteInferior, limiteSuperior]
  motivoDescarte?: "ABAIXO_PISO" | "ACIMA_TETO";
}

export interface ImovelAvaliando {
  // Cadastrais
  proponente: string;
  cpfProponente: string;
  objetivo: string; // "Avaliação para Venda", "Garantia Hipotecária", "Partilha/Inventário"
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  matricula: string;
  cartorio: string;

  // Características Físicas
  tipo: TipoImovel;
  padrao: PadraoConstrutivo;
  estadoConservacao: EstadoConservacao;
  idadeAparenteAnos: number;
  areaConstruidaM2: number;
  areaTerrenoM2: number;
  quartos: number;
  suites: number;
  banheiros: number;
  lavabos: number;
  vagas: number;
  pavimentos: number;

  // Vistoria e Entorno
  temAguaPotavel: boolean;
  temEnergiaEletrica: boolean;
  temEsgoto: boolean;
  temPavimentacao: boolean;
  temIluminacaoPublica: boolean;
  temGasCanalizado: boolean;
  temComercioProximo: boolean;
  temEscolasProximas: boolean;
  temTransporteColetivo: boolean;

  // Fatores de Apreciação / Vícios
  fatorApreciacaoPercent: number; // Ex: 0.15 (15%) para padrão superior / benfeitorias
  demaisBenfeitoriasValor: number; // Ex: Piscina aquecida, energia solar (valor em R$)
  temViciosConstrucao: boolean;
  descricaoVicios: string;
  fatoresValorizantes: string; // "Vista para parque, sol da manhã"
  fatoresDepreciativos: string; // "Sem fatores depreciativos"
}

export interface ResultadoEstatistico {
  totalAmostras: number;
  amostrasValidas: number;
  amostrasDescartadas: number;

  somaM2TodasAmostras: number;
  mediaAritmeticaBrutaM2: number; // MA

  intervaloToleranciaPercent: number; // Ex: 15% (0.15)
  limiteInferiorM2: number; // MA * 0.85
  limiteSuperiorM2: number; // MA * 1.15

  somaM2AmostrasValidas: number;
  mediaFinalSaneadaM2: number; // MF

  fatorApreciacaoPercent: number;
  valorM2Apreciado: number; // MF * (1 + fatorApreciacao)

  valorAvaliacaoBase: number; // areaConstruidaM2 * valorM2Apreciado + demaisBenfeitorias
  precoAnuncioSugerido: number; // +5% gordura
  precoTetoMaximo: number; // +10%
  precoFechamentoSugerido: number; // -5% para fechamento rápido
}
