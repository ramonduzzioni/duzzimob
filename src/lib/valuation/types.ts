export type TipoImovel = "casa" | "apartamento" | "terreno" | "comercial" | "cobertura" | "sobrado" | "loft" | "kitnet" | "duplex";
export type DisposicaoEdificacao =
  | "isolada_centro"
  | "isolada_frente"
  | "geminada_lateral"
  | "geminada_laterais"
  | "junto_fundos"
  | "junto_lateral"
  | "ocupa_todo_terreno"
  | "convencional";

export type PosicaoEdificacao = "frente" | "frente_canto" | "meio" | "fundos" | "fundos_canto" | "lateral";
export type SituacaoOcupacao = "desocupado" | "ocupado_proprietario" | "locado_arrendado" | "cedido_comodato" | "invadido" | "em_implantacao";
export type PadraoConstrutivo = "minimo" | "baixo" | "medio" | "alto" | "luxo";
export type EstadoConservacao = "novo" | "otimo" | "bom" | "regular" | "ruim" | "em_construcao";
export type GrauFundamentacao = "GRAU_I" | "GRAU_II" | "GRAU_III";
export type GrauPrecisao = "GRAU_I" | "GRAU_II" | "GRAU_III";

export type TopografiaTerreno = "plano" | "aclive" | "declive" | "irregular";
export type CotaGreide = "mesmo_nivel" | "aclive_10" | "declive_10" | "abaixo" | "acima";
export type SuperficieTerreno = "seco" | "brejo" | "alagavel" | "outra";
export type FormatoTerreno = "regular" | "irregular";
export type SituacaoQuadra = "meio_quadra" | "esquina" | "fundo" | "outro";

export type UsoPredominanteMicrorregiao = "unifamiliar" | "multifamiliar" | "comercial" | "industrial" | "misto" | "terreno";
export type AcessoBairro = "otimo" | "bom" | "razoavel" | "dificil";
export type DesempenhoMercado = "aquecido" | "normal" | "recessivo";
export type AbsorcaoMercado = "alta_ate_3m" | "media_3_a_6m" | "baixa_mais_6m";

export type FechamentoParede = "alvenaria" | "concreto" | "drywall" | "madeira" | "outro";
export type TipoEsquadrias = "aluminio" | "madeira" | "pvc" | "vidro_temperado" | "ferro" | "outro";
export type RevestimentoFachada = "textura" | "pintura" | "ceramica" | "granito" | "marmore" | "aluminio" | "pele_vidro" | "outro";

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
  anotacoes?: string;
}

export interface ImovelAvaliando {
  // Cabeçalho da Avaliação
  ano: number;
  dataParecer: string;
  dataVistoria: string;
  nomeAvaliador: string;
  creciAvaliador: string;

  // 1. SOLICITANTE
  objetivo: string; // "Avaliação para a venda", "Garantia Hipotecária", "Partilha/Inventário"
  proponente: string;
  cpfProponente: string;

  // 2. IDENTIFICAÇÃO DO IMÓVEL
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  cartorio: string;
  matricula: string;
  dataEmissaoMatricula: string;

  // 3. MICRORREGIÃO DO IMÓVEL AVALIADO
  usoPredominante: UsoPredominanteMicrorregiao;
  padraoConstrutivoPredominante: PadraoConstrutivo;
  acessoBairro: AcessoBairro;
  desempenhoMercado: DesempenhoMercado;
  absorcaoMercado: AbsorcaoMercado;

  // Infraestrutura urbana
  solucaoAgua: "rede_publica" | "poco" | "nao_possui";
  solucaoEsgoto: "rede_publica" | "fossa_sumidouro" | "nao_possui";
  temEnergiaEletrica: boolean;
  temTelefonia: boolean;
  temIluminacaoPublica: boolean;
  temAguaPluvial: boolean;
  temPavimentacao: boolean;
  temGasCanalizado: boolean;

  // Serviços e Equipamentos Comunitários
  temComercio: boolean;
  temRedeBancaria: boolean;
  temSaude: boolean;
  temLazer: boolean;
  temTransporteColetivo: boolean;
  temSegurancaPublica: boolean;
  temColetaLixo: boolean;
  temEscolas: boolean;

  // 4. DADOS DO TERRENO
  areaTerrenoM2: number;
  numFrentes: number;
  testadaMetros: number;
  superficieTerreno: SuperficieTerreno;
  cotaGreide: CotaGreide;
  topografia: TopografiaTerreno;
  formatoTerreno: FormatoTerreno;
  situacaoQuadra: SituacaoQuadra;

  // 5. DADOS DA UNIDADE AVALIANDA
  tipo: TipoImovel;
  disposicaoEdificacao: DisposicaoEdificacao;
  posicaoEdificacao: PosicaoEdificacao;
  ocupacao: SituacaoOcupacao;
  andar: number;
  idadeAparenteAnos: number;

  quartos: number; // quartos normais sem suíte
  suites: number;
  dormitoriosTotal: number;
  banheirosSociais: number;
  lavabos: number;
  totalBanheiros: number;
  vagas: number;
  pavimentos: number;

  taxaCondominioMensal: number;
  iptuAnual: number;
  estadoConservacao: EstadoConservacao;
  padrao: PadraoConstrutivo;
  fechamentoParede: FechamentoParede;
  areaConstruidaM2: number;

  // 6. DADOS DO PRÉDIO / CONDOMÍNIO (se aplicável)
  isCondominioEdificio: boolean;
  predioIdadeAparente: number;
  predioNumPavimentos: number;
  predioUnidadesPorAndar: number;
  predioNumTotalUnidades: number;
  predioQuantidadeBlocos: number;
  predioNumElevadores: number;
  predioUso: "residencial" | "comercial" | "misto";

  // Lazer e serviços condomínio
  condoPiscina: boolean;
  condoPlayground: boolean;
  condoSalaoFestas: boolean;
  condoPortaria24h: boolean;
  condoQuadra: boolean;
  condoGerador: boolean;
  condoSauna: boolean;
  condoInterfone: boolean;
  condoChurrasqueira: boolean;
  condoPortaoEletronico: boolean;
  condoPocoArtesiano: boolean;
  condoCftv: boolean;
  condoHidrometroIndividual: boolean;

  // Proteção contra Incêndio
  incendioAlarme: boolean;
  incendioEscadaEmergencia: boolean;
  incendioHidrantes: boolean;
  incendioExtintores: boolean;
  incendioIluminacaoEmergencia: boolean;
  incendioNaoPossui: boolean;

  // Acabamento Fachada
  predioPadraoAcabamento: PadraoConstrutivo;
  predioEsquadrias: TipoEsquadrias;
  predioRevestimentoFachada: RevestimentoFachada;
  predioEstadoConservacao: EstadoConservacao;
  predioLocalizacao: "otima" | "boa" | "regular" | "ruim";

  // 7. CONDIÇÕES GERAIS (VISTORIA TÉCNICA)
  docCorrespondeVistoria: boolean;
  justificativaDocumentacao: string;
  aparentaEstabilidadeSolidez: boolean;
  justificativaSolidez: string;
  temViciosConstrucao: boolean;
  descricaoVicios: string;
  aparentaHabitabilidade: boolean;
  justificativaHabitabilidade: string;

  // Fatores de Entorno
  fatoresValorizantes: string; // Ex: Vista para parques, vista para o mar, metrô
  fatoresDepreciativos: string; // Ex: Córregos, alta tensão, presídio, feira livre, favelas

  // 8. METODOLOGIA E ESPECIFICAÇÃO
  metodologia: "MCDDM" | "SEM_METODOLOGIA" | "OUTRO";
  tratamentoDados: "ESTATISTICA_INFERENCIAL" | "FATORES" | "NUMERO_DADOS_INSUFICIENTE";
  fundamentacao: GrauFundamentacao;
  precisao: GrauPrecisao;

  // Fatores Matemáticos Finais
  fatorApreciacaoPercent: number; // 15% na planilha
  demaisBenfeitoriasValor: number; // 0 na planilha
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
  precoTetoMaximo: number; // +10.25%
  precoFechamentoSugerido: number; // -5% para fechamento rápido
}
