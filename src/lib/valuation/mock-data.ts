import { AmostraMercado, ImovelAvaliando } from "./types";

export const IMOVEL_PADRAO_EXEMPLO: ImovelAvaliando = {
  proponente: "Cliente Modelo",
  cpfProponente: "000.000.000-00",
  objetivo: "Avaliação para Venda",
  endereco: "Rua Geral",
  numero: "S/N",
  complemento: "Casa",
  bairro: "Laranjinha",
  cidade: "Criciúma",
  uf: "SC",
  cep: "88800-000",
  matricula: "12345",
  cartorio: "1º Ofício de Registro de Imóveis",

  tipo: "casa",
  padrao: "medio",
  estadoConservacao: "bom",
  idadeAparenteAnos: 8,
  areaConstruidaM2: 176, // 176 m2 avaliando da planilha
  areaTerrenoM2: 310,
  quartos: 3,
  suites: 1,
  banheiros: 2,
  lavabos: 1,
  vagas: 2,
  pavimentos: 2,

  temAguaPotavel: true,
  temEnergiaEletrica: true,
  temEsgoto: true,
  temPavimentacao: true,
  temIluminacaoPublica: true,
  temGasCanalizado: false,
  temComercioProximo: true,
  temEscolasProximas: true,
  temTransporteColetivo: true,

  fatorApreciacaoPercent: 15, // 15% na planilha
  demaisBenfeitoriasValor: 0,
  temViciosConstrucao: false,
  descricaoVicios: "",
  fatoresValorizantes: "Bairro tranquilo, rua pavimentada, boa insolação",
  fatoresDepreciativos: "Nenhum",
};

export const AMOSTRAS_INICIAIS_PLANILHA: Omit<AmostraMercado, "valorM2" | "isHomogeneizada" | "motivoDescarte">[] = [
  { id: "1", codigo: "A.1", proprietarioOuFonte: "Wins", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 200, valorOferta: 1350000 },
  { id: "2", codigo: "A.2", proprietarioOuFonte: "Odair de Oliveira", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 4, areaUtilM2: 260, valorOferta: 1080000 },
  { id: "3", codigo: "A.3", proprietarioOuFonte: "Wins", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 4, vagas: 2, areaUtilM2: 167, valorOferta: 950000 },
  { id: "4", codigo: "A.4", proprietarioOuFonte: "Duda Imóveis", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 257, valorOferta: 1100000 },
  { id: "5", codigo: "A.5", proprietarioOuFonte: "Thiago Bitencourt", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 4, vagas: 4, areaUtilM2: 390, valorOferta: 1290000 },
  { id: "6", codigo: "A.6", proprietarioOuFonte: "Primaro", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 185, valorOferta: 850000 },
  { id: "7", codigo: "A.7", proprietarioOuFonte: "Marcelo Novak", bairro: "Ceará", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 190, valorOferta: 1250000 },
  { id: "8", codigo: "A.8", proprietarioOuFonte: "Wins", bairro: "Ceará", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 264, valorOferta: 1650000 },
  { id: "9", codigo: "A.9", proprietarioOuFonte: "Gérson Zanatte", bairro: "Ana Maria", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 257, valorOferta: 800000 },
  { id: "10", codigo: "A.10", proprietarioOuFonte: "Primaro", bairro: "Nossa Senhora da Salete", cidade: "Criciúma", quartos: 3, vagas: 3, areaUtilM2: 190, valorOferta: 850000 },
  { id: "11", codigo: "A.11", proprietarioOuFonte: "Próspera Imóveis", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 350, valorOferta: 2100000 },
  { id: "12", codigo: "A.12", proprietarioOuFonte: "Odair Imóveis", bairro: "Ana Maria", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 180, valorOferta: 795000 },
  { id: "13", codigo: "A.13", proprietarioOuFonte: "Duda Imóveis", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 239, valorOferta: 1100000 },
  { id: "14", codigo: "A.14", proprietarioOuFonte: "Meu Imóvel", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 270, valorOferta: 850000 },
  { id: "15", codigo: "A.15", proprietarioOuFonte: "Bizzi Imóveis", bairro: "Jardim Maristela", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 209, valorOferta: 1350000 },
];
