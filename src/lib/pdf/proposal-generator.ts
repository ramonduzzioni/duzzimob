import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { SimulationResult } from "@/lib/calculator/caixa";

export interface ProposalPdfData {
  proposalNumber?: string;
  dataProposta?: string;

  // Identificação do Imóvel
  construtoraEmpreendimento?: string;
  unidadeApartamento?: string;
  garagemBox?: string;
  outrasInformacoes?: string;

  // Condições de Pagamento
  propertyValue?: number;
  sinalValor?: number | string;
  sinalQuantidade?: string;
  sinalPrazo?: string;

  parcelasValor?: number | string;
  parcelasQuantidade?: number | string;
  parcelasPrazo?: string;

  reforcosValor?: number | string;
  reforcosQuantidade?: number | string;
  reforcosPrazo?: string;

  fgtsValor?: number | string;
  fgtsQuantidade?: string;
  fgtsPrazo?: string;

  financiamentoValor?: number | string;
  financiamentoQuantidade?: string;
  financiamentoPrazo?: string;

  escrituraValor?: number | string;
  escrituraQuantidade?: string;
  escrituraPrazo?: string;

  // Dados do Comprador
  clientName?: string;
  compradorNome?: string;
  compradorCpf?: string;
  compradorRg?: string;
  compradorEstadoCivil?: string;
  compradorProfissao?: string;
  compradorEmail?: string;
  compradorTelefone?: string;

  // Dados do Cônjuge
  conjugeNome?: string;
  conjugeCpf?: string;
  conjugeRg?: string;
  conjugeProfissao?: string;
  conjugeEmail?: string;
  conjugeTelefone?: string;

  // Observações
  observacoes?: string;

  // Local e Data
  cidade?: string;
  dataDia?: string;
  dataMes?: string;
  dataAno?: string;

  // Dados legados de simulação caso enviados
  simulation?: SimulationResult;
  clientPhone?: string;
  propertyTitle?: string;
  neighborhood?: string;
}

const MONTH_NAMES = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

function formatNumberPlain(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === "") return "";
  if (typeof val === "string") return val;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

function formatCurrencyFull(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === "") return "";
  if (typeof val === "string" && val.startsWith("R$")) return val;
  const num = typeof val === "string" ? parseFloat(val.replace(/\D/g, "")) / 100 : val;
  if (isNaN(num)) return typeof val === "string" ? val : "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

export async function generateProposalPdf(data: ProposalPdfData): Promise<Uint8Array> {
  const templatePath = path.join(process.cwd(), "public", "templates", "Proposta_Compra_Imovel_Editavel.pdf");
  if (!fs.existsSync(templatePath)) {
    throw new Error("Arquivo de modelo 'Proposta_Compra_Imovel_Editavel.pdf' não encontrado em public/templates/.");
  }
  const templateBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  const setFieldSafely = (fieldName: string, value: string | undefined | null) => {
    if (!value) return;
    try {
      const field = form.getTextField(fieldName);
      field.setText(String(value));
    } catch {
      // Campo opcional ausente no formulário
    }
  };

  // 1. Cabeçalho
  const now = new Date();
  const defaultDia = String(now.getDate()).padStart(2, "0");
  const defaultMes = MONTH_NAMES[now.getMonth()];
  const defaultAno = String(now.getFullYear());
  const defaultDataFormatted = `${defaultDia}/${String(now.getMonth() + 1).padStart(2, "0")}/${defaultAno}`;

  setFieldSafely("Proposta_Numero", data.proposalNumber || "");
  setFieldSafely("Data_Proposta", data.dataProposta || defaultDataFormatted);

  // 2. Identificação do Imóvel
  const empreendimento =
    data.construtoraEmpreendimento || data.propertyTitle || "";
  setFieldSafely("Construtora_Empreendimento", empreendimento);
  setFieldSafely("Unidade_Apartamento", data.unidadeApartamento || "");
  setFieldSafely("Garagem_Box", data.garagemBox || "");
  setFieldSafely("Outras_Informacoes", data.outrasInformacoes || data.neighborhood || "");

  // 3. Condições de Pagamento
  const valorImovel = data.propertyValue ?? data.simulation?.propertyValue;
  setFieldSafely("Valor_Imovel_Total", formatCurrencyFull(valorImovel));

  // Sinal / Entrada
  const sinalVal = data.sinalValor ?? data.simulation?.builderPlan.sinal;
  setFieldSafely("Sinal_Valor", formatNumberPlain(sinalVal));
  setFieldSafely("Sinal_Quantidade", data.sinalQuantidade || "");
  setFieldSafely("Sinal_Prazo", data.sinalPrazo || (sinalVal ? "ato" : ""));

  // Parcelas mensais
  const parcVal = data.parcelasValor ?? data.simulation?.builderPlan.mensais.valorUnitario;
  const parcQtd = data.parcelasQuantidade ?? data.simulation?.builderPlan.mensais.qtd;
  setFieldSafely("Parcelas_Valor", formatNumberPlain(parcVal));
  setFieldSafely("Parcelas_Quantidade", parcQtd ? String(parcQtd) : "");
  setFieldSafely("Parcelas_Prazo", data.parcelasPrazo || "");

  // Reforços
  const reforcoVal = data.reforcosValor ?? (data.simulation?.builderPlan.reforcos.qtd ? data.simulation.builderPlan.reforcos.valorUnitario : "");
  const reforcoQtd = data.reforcosQuantidade ?? (data.simulation?.builderPlan.reforcos.qtd || "");
  setFieldSafely("Reforcos_Valor", formatNumberPlain(reforcoVal));
  setFieldSafely("Reforcos_Quantidade", reforcoQtd ? String(reforcoQtd) : "");
  setFieldSafely("Reforcos_Prazo", data.reforcosPrazo || "");

  // FGTS
  const fgtsVal = data.fgtsValor ?? (data.simulation?.fgtsValue ? data.simulation.fgtsValue : "");
  if (typeof fgtsVal === "string" && fgtsVal.toUpperCase() === "X") {
    setFieldSafely("FGTS_Valor", "X");
  } else if (fgtsVal) {
    setFieldSafely("FGTS_Valor", formatNumberPlain(fgtsVal));
  }
  setFieldSafely("FGTS_Quantidade", data.fgtsQuantidade || "");
  setFieldSafely("FGTS_Prazo", data.fgtsPrazo || "");

  // Financiamento (CAIXA)
  const financVal = data.financiamentoValor ?? data.simulation?.approvedFinancingValue;
  setFieldSafely("Financiamento_Valor", formatNumberPlain(financVal));
  setFieldSafely("Financiamento_Quantidade", data.financiamentoQuantidade || "");
  setFieldSafely("Financiamento_Prazo", data.financiamentoPrazo || "");

  // Escritura / Saldo
  const escritVal = data.escrituraValor ?? data.simulation?.builderPlan.escrituraEstimada;
  setFieldSafely("Escritura_Valor", formatNumberPlain(escritVal));
  setFieldSafely("Escritura_Quantidade", data.escrituraQuantidade || "");
  setFieldSafely("Escritura_Prazo", data.escrituraPrazo || "");

  // 4. Dados do Comprador (Proponente)
  const nomeComprador = data.compradorNome || data.clientName || "";
  setFieldSafely("Comprador_Nome", nomeComprador.toUpperCase());
  setFieldSafely("Comprador_CPF", data.compradorCpf || "");
  setFieldSafely("Comprador_RG", data.compradorRg || "");
  setFieldSafely("Comprador_Estado_Civil", data.compradorEstadoCivil ? data.compradorEstadoCivil.toUpperCase() : "");
  setFieldSafely("Comprador_Profissao", data.compradorProfissao ? data.compradorProfissao.toUpperCase() : "");
  setFieldSafely("Comprador_Email", data.compradorEmail || "");

  // 5. Dados do Cônjuge
  if (data.conjugeNome) {
    setFieldSafely("Conjuge_Nome", data.conjugeNome.toUpperCase());
    setFieldSafely("Conjuge_CPF", data.conjugeCpf || "");
    setFieldSafely("Conjuge_RG", data.conjugeRg || "");
    setFieldSafely("Conjuge_Profissao", data.conjugeProfissao ? data.conjugeProfissao.toUpperCase() : "");
    setFieldSafely("Conjuge_Email", data.conjugeEmail || "");
  }

  // 6. Observações / Condições Especiais
  let obs = data.observacoes || "";
  if (!obs) {
    const phones: string[] = [];
    const mainPhone = data.compradorTelefone || data.clientPhone;
    if (mainPhone) {
      phones.push(`${nomeComprador.split(" ")[0] || "COMPRADOR"}: ${mainPhone}`);
    }
    if (data.conjugeTelefone) {
      phones.push(`${data.conjugeNome?.split(" ")[0] || "CÔNJUGE"}: ${data.conjugeTelefone}`);
    }
    if (phones.length > 0) {
      obs = `TELEFONES: ${phones.join(" / ")}`;
    }
  }
  setFieldSafely("Observacoes_Condicoes_Especiais", obs);

  // 7. Local e Data
  setFieldSafely("Local_Cidade", (data.cidade || "CRICIÚMA").toUpperCase());
  setFieldSafely("Data_Dia", data.dataDia || defaultDia);
  setFieldSafely("Data_Mes", (data.dataMes || defaultMes).toUpperCase());
  setFieldSafely("Data_Ano", data.dataAno || defaultAno);

  // Flattening para que os campos sejam embutidos no PDF como no screenshot
  form.flatten();

  return await pdfDoc.save();
}
