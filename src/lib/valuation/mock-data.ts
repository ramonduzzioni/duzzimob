import { AmostraMercado, ImovelAvaliando } from "./types";

export const IMOVEL_PADRAO_EXEMPLO: ImovelAvaliando = {
  // Cabeçalho da Avaliação
  ano: 2020,
  dataParecer: "2022-09-21",
  dataVistoria: "2022-09-12",
  nomeAvaliador: "Duzzi Imóveis - Avaliador Credenciado",
  creciAvaliador: "CRECI/SC 00000-J | CNAI",

  // 1. SOLICITANTE
  objetivo: "Avaliação para a venda",
  proponente: "Cliente Modelo",
  cpfProponente: "000.000.000-00",

  // 2. IDENTIFICAÇÃO DO IMÓVEL
  endereco: "Rua geral",
  numero: "S/N",
  complemento: "casa",
  bairro: "laranjinha",
  cidade: "criciuma",
  uf: "SC",
  cep: "88800-000",
  cartorio: "1º Ofício de Registro de Imóveis",
  matricula: "12345",
  dataEmissaoMatricula: "2022-08-10",

  // 3. MICRORREGIÃO DO IMÓVEL AVALIADO
  usoPredominante: "comercial",
  padraoConstrutivoPredominante: "medio",
  acessoBairro: "bom",
  desempenhoMercado: "recessivo",
  absorcaoMercado: "baixa_mais_6m",

  // Infraestrutura urbana
  solucaoAgua: "rede_publica",
  solucaoEsgoto: "rede_publica",
  temEnergiaEletrica: true,
  temTelefonia: true,
  temIluminacaoPublica: true,
  temAguaPluvial: true,
  temPavimentacao: true,
  temGasCanalizado: true,

  // Serviços e Equipamentos Comunitários
  temComercio: true,
  temRedeBancaria: true,
  temSaude: true,
  temLazer: true,
  temTransporteColetivo: true,
  temSegurancaPublica: true,
  temColetaLixo: true,
  temEscolas: true,

  // 4. DADOS DO TERRENO
  areaTerrenoM2: 310,
  numFrentes: 1,
  testadaMetros: 12,
  superficieTerreno: "outra",
  cotaGreide: "mesmo_nivel",
  topografia: "plano",
  formatoTerreno: "regular",
  situacaoQuadra: "meio_quadra",

  // 5. DADOS DA UNIDADE AVALIANDA
  tipo: "casa",
  disposicaoEdificacao: "convencional",
  posicaoEdificacao: "frente",
  ocupacao: "ocupado_proprietario",
  andar: 0,
  idadeAparenteAnos: 8,

  quartos: 3,
  suites: 1,
  dormitoriosTotal: 3,
  banheirosSociais: 1,
  lavabos: 1,
  totalBanheiros: 3,
  vagas: 2,
  pavimentos: 2,

  taxaCondominioMensal: 0,
  iptuAnual: 1200,
  estadoConservacao: "bom",
  padrao: "medio",
  fechamentoParede: "alvenaria",
  areaConstruidaM2: 176,

  // 6. DADOS DO PRÉDIO / CONDOMÍNIO
  isCondominioEdificio: false,
  predioIdadeAparente: 8,
  predioNumPavimentos: 1,
  predioUnidadesPorAndar: 1,
  predioNumTotalUnidades: 1,
  predioQuantidadeBlocos: 1,
  predioNumElevadores: 0,
  predioUso: "residencial",

  condoPiscina: false,
  condoPlayground: false,
  condoSalaoFestas: false,
  condoPortaria24h: false,
  condoQuadra: false,
  condoGerador: false,
  condoSauna: false,
  condoInterfone: true,
  condoChurrasqueira: true,
  condoPortaoEletronico: true,
  condoPocoArtesiano: false,
  condoCftv: false,
  condoHidrometroIndividual: true,

  incendioAlarme: false,
  incendioEscadaEmergencia: false,
  incendioHidrantes: false,
  incendioExtintores: false,
  incendioIluminacaoEmergencia: false,
  incendioNaoPossui: true,

  predioPadraoAcabamento: "medio",
  predioEsquadrias: "aluminio",
  predioRevestimentoFachada: "textura",
  predioEstadoConservacao: "bom",
  predioLocalizacao: "boa",

  // 7. CONDIÇÕES GERAIS (VISTORIA TÉCNICA)
  docCorrespondeVistoria: true,
  justificativaDocumentacao: "",
  aparentaEstabilidadeSolidez: true,
  justificativaSolidez: "",
  temViciosConstrucao: false,
  descricaoVicios: "",
  aparentaHabitabilidade: true,
  justificativaHabitabilidade: "",

  fatoresValorizantes: "Vista para parques",
  fatoresDepreciativos: "Nenhum",

  // 8. METODOLOGIA E ESPECIFICAÇÃO
  metodologia: "MCDDM",
  tratamentoDados: "ESTATISTICA_INFERENCIAL",
  fundamentacao: "GRAU_I",
  precisao: "GRAU_I",

  // Fatores Matemáticos Finais
  fatorApreciacaoPercent: 15,
  demaisBenfeitoriasValor: 0,
};

export const AMOSTRAS_INICIAIS_PLANILHA: Omit<AmostraMercado, "valorM2" | "isHomogeneizada" | "motivoDescarte">[] = [
  { id: "1", codigo: "A.1", proprietarioOuFonte: "Wins", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 200, valorOferta: 1350000, anotacoes: "Casa usada" },
  { id: "2", codigo: "A.2", proprietarioOuFonte: "Odair de Oliveira", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 4, areaUtilM2: 260, valorOferta: 1080000, anotacoes: "Casa usada" },
  { id: "3", codigo: "A.3", proprietarioOuFonte: "Wins", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 4, vagas: 2, areaUtilM2: 167, valorOferta: 950000, anotacoes: "Casa usada" },
  { id: "4", codigo: "A.4", proprietarioOuFonte: "Duda Imóveis", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 257, valorOferta: 1100000, anotacoes: "Casa usada" },
  { id: "5", codigo: "A.5", proprietarioOuFonte: "Thiago Bitencourt", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 4, vagas: 4, areaUtilM2: 390, valorOferta: 1290000, anotacoes: "Casa usada" },
  { id: "6", codigo: "A.6", proprietarioOuFonte: "Primaro", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 185, valorOferta: 850000, anotacoes: "Casa usada" },
  { id: "7", codigo: "A.7", proprietarioOuFonte: "Marcelo Novak", bairro: "Ceará", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 190, valorOferta: 1250000, anotacoes: "Casa usada" },
  { id: "8", codigo: "A.8", proprietarioOuFonte: "Wins", bairro: "Ceará", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 264, valorOferta: 1650000, anotacoes: "Casa usada" },
  { id: "9", codigo: "A.9", proprietarioOuFonte: "Gérson Zanatte", bairro: "Ana Maria", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 257, valorOferta: 800000, anotacoes: "Casa usada" },
  { id: "10", codigo: "A.10", proprietarioOuFonte: "Primaro", bairro: "Nossa Senhora da Salete", cidade: "Criciúma", quartos: 3, vagas: 3, areaUtilM2: 190, valorOferta: 850000, anotacoes: "Casa usada" },
  { id: "11", codigo: "A.11", proprietarioOuFonte: "Próspera Imóveis", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 350, valorOferta: 2100000, anotacoes: "Casa usada" },
  { id: "12", codigo: "A.12", proprietarioOuFonte: "Odair Imóveis", bairro: "Ana Maria", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 180, valorOferta: 795000, anotacoes: "Casa usada" },
  { id: "13", codigo: "A.13", proprietarioOuFonte: "Duda Imóveis", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 239, valorOferta: 1100000, anotacoes: "Casa usada" },
  { id: "14", codigo: "A.14", proprietarioOuFonte: "Meu Imóvel", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 270, valorOferta: 850000, anotacoes: "Casa usada" },
  { id: "15", codigo: "A.15", proprietarioOuFonte: "Bizzi Imóveis", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 209, valorOferta: 1350000, anotacoes: "Casa usada" },
];
