import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { SimulationResult } from "@/lib/calculator/caixa";
import { formatCurrency } from "@/lib/utils";

export interface ProposalPdfData {
  proposalNumber: string;
  clientName: string;
  clientPhone: string;
  propertyTitle: string;
  neighborhood: string;
  corretorName: string;
  creci: string;
  simulation: SimulationResult;
}

export async function generateProposalPdf(data: ProposalPdfData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 em pontos (72 dpi)
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Cores
  const darkBg = rgb(0.06, 0.07, 0.08); // #0f1214
  const limeColor = rgb(0.8, 1.0, 0.0); // #ccff00
  const white = rgb(1, 1, 1);
  const grayLight = rgb(0.7, 0.72, 0.75);
  const grayDark = rgb(0.18, 0.2, 0.23);
  const cardBg = rgb(0.1, 0.12, 0.14);

  // 1. Cabeçalho escuro com accent lime
  page.drawRectangle({
    x: 0,
    y: height - 100,
    width: width,
    height: 100,
    color: darkBg,
  });

  page.drawRectangle({
    x: 0,
    y: height - 102,
    width: width,
    height: 3,
    color: limeColor,
  });

  // Título da Proposta
  page.drawText("DUZZIMOB", {
    x: 40,
    y: height - 48,
    size: 20,
    font: fontBold,
    color: white,
  });

  page.drawText("PROPOSTA DE COMPRA & SIMULAÇÃO HABITACIONAL", {
    x: 40,
    y: height - 68,
    size: 10,
    font: fontRegular,
    color: grayLight,
  });

  // Número da Proposta & Data
  page.drawText(`Proposta: #${data.proposalNumber}`, {
    x: width - 180,
    y: height - 48,
    size: 11,
    font: fontBold,
    color: limeColor,
  });

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(
    now.getMonth() + 1
  ).padStart(2, "0")}/${now.getFullYear()}`;

  page.drawText(`Emitido em: ${dateStr}`, {
    x: width - 180,
    y: height - 66,
    size: 9,
    font: fontRegular,
    color: grayLight,
  });

  let currentY = height - 130;

  // 2. Bloco do Cliente & Imóvel
  page.drawRectangle({
    x: 40,
    y: currentY - 65,
    width: width - 80,
    height: 65,
    color: cardBg,
    borderColor: grayDark,
    borderWidth: 1,
  });

  page.drawText("DADOS DO CLIENTE & IMÓVEL", {
    x: 55,
    y: currentY - 20,
    size: 10,
    font: fontBold,
    color: limeColor,
  });

  page.drawText(`Cliente: ${data.clientName}`, {
    x: 55,
    y: currentY - 38,
    size: 9,
    font: fontBold,
    color: white,
  });

  page.drawText(`WhatsApp: ${data.clientPhone}`, {
    x: 55,
    y: currentY - 52,
    size: 9,
    font: fontRegular,
    color: grayLight,
  });

  page.drawText(`Imóvel: ${data.propertyTitle}`, {
    x: 320,
    y: currentY - 38,
    size: 9,
    font: fontBold,
    color: white,
  });

  page.drawText(`Localização: ${data.neighborhood}`, {
    x: 320,
    y: currentY - 52,
    size: 9,
    font: fontRegular,
    color: grayLight,
  });

  currentY -= 90;

  // 3. Bloco do Financiamento Habitacional Caixa
  page.drawRectangle({
    x: 40,
    y: currentY - 145,
    width: width - 80,
    height: 145,
    color: cardBg,
    borderColor: grayDark,
    borderWidth: 1,
  });

  page.drawText("1. CRÉDITO HABITACIONAL CAIXA ECONÔMICA FEDERAL", {
    x: 55,
    y: currentY - 22,
    size: 11,
    font: fontBold,
    color: limeColor,
  });

  const sim = data.simulation;

  const leftItems = [
    { label: "Valor de Avaliação / Venda:", val: formatCurrency(sim.propertyValue) },
    { label: "Renda Bruta Familiar Cadastrada:", val: formatCurrency(sim.grossIncome) },
    { label: "Financiamento Máximo Aprovado Caixa:", val: formatCurrency(sim.approvedFinancingValue) },
    { label: "Subsídio do Programa (MCMV):", val: formatCurrency(sim.subsidyValue) },
    { label: "Utilização de Saldo FGTS:", val: formatCurrency(sim.fgtsValue) },
  ];

  let simY = currentY - 42;
  leftItems.forEach((item) => {
    page.drawText(item.label, {
      x: 55,
      y: simY,
      size: 9,
      font: fontRegular,
      color: grayLight,
    });
    page.drawText(item.val, {
      x: 230,
      y: simY,
      size: 9,
      font: fontBold,
      color: white,
    });
    simY -= 18;
  });

  // Informações de Parcela e Sistema
  page.drawText("Condições de Amortização:", {
    x: 360,
    y: currentY - 42,
    size: 9,
    font: fontBold,
    color: white,
  });

  page.drawText(`Sistema: ${sim.systemType} (${sim.termMonths} meses)`, {
    x: 360,
    y: currentY - 60,
    size: 9,
    font: fontRegular,
    color: grayLight,
  });

  page.drawText("1ª Parcela Estimada:", {
    x: 360,
    y: currentY - 82,
    size: 9,
    font: fontRegular,
    color: grayLight,
  });
  page.drawText(formatCurrency(sim.firstInstallmentCaixa), {
    x: 360,
    y: currentY - 98,
    size: 13,
    font: fontBold,
    color: limeColor,
  });

  if (sim.systemType === "SAC") {
    page.drawText(`Última Parcela: ${formatCurrency(sim.lastInstallmentCaixa)}`, {
      x: 360,
      y: currentY - 116,
      size: 8,
      font: fontRegular,
      color: grayLight,
    });
  }

  currentY -= 170;

  // 4. Bloco Construtora (Entrada Parcelada)
  page.drawRectangle({
    x: 40,
    y: currentY - 165,
    width: width - 80,
    height: 165,
    color: cardBg,
    borderColor: grayDark,
    borderWidth: 1,
  });

  page.drawText("2. FLUXO DE PAGAMENTO DIRETO COM A CONSTRUTORA", {
    x: 55,
    y: currentY - 22,
    size: 11,
    font: fontBold,
    color: limeColor,
  });

  page.drawText(
    `Gap Total de Entrada a Parcelar: ${formatCurrency(sim.downPaymentGap)}`,
    {
      x: 55,
      y: currentY - 42,
      size: 10,
      font: fontBold,
      color: white,
    }
  );

  const plan = sim.builderPlan;
  const planRows = [
    { item: "Ato / Sinal na Assinatura:", val: formatCurrency(plan.sinal), obs: "Entrada inicial" },
    {
      item: `Parcelas Mensais de Obra (${plan.mensais.qtd}x):`,
      val: `${formatCurrency(plan.mensais.valorUnitario)} /mês`,
      obs: `Total: ${formatCurrency(plan.mensais.total)}`,
    },
    {
      item: `Balões / Reforços (${plan.reforcos.qtd}x):`,
      val: plan.reforcos.qtd > 0 ? `${formatCurrency(plan.reforcos.valorUnitario)} /reforço` : "Sem reforços",
      obs: `Total: ${formatCurrency(plan.reforcos.total)}`,
    },
    { item: "Parcela na Entrega das Chaves:", val: formatCurrency(plan.chaves), obs: "Habite-se" },
    { item: "Estimativa de ITBI & Registro (Cartório):", val: formatCurrency(plan.escrituraEstimada), obs: "Aproximado" },
  ];

  let planY = currentY - 65;
  planRows.forEach((r) => {
    page.drawText(r.item, {
      x: 55,
      y: planY,
      size: 9,
      font: fontRegular,
      color: grayLight,
    });
    page.drawText(r.val, {
      x: 280,
      y: planY,
      size: 9,
      font: fontBold,
      color: white,
    });
    page.drawText(r.obs, {
      x: 440,
      y: planY,
      size: 8,
      font: fontRegular,
      color: grayLight,
    });
    planY -= 19;
  });

  currentY -= 190;

  // 5. Cláusula de Validade e Assinaturas
  page.drawText(
    "OBSERVAÇÕES: Os valores simulados dependem de aprovação cadastral e documental junto à Caixa Econômica Federal e à construtora. Valores sujeitos a correção monetária por INCC até as chaves.",
    {
      x: 40,
      y: currentY - 10,
      size: 7.5,
      font: fontRegular,
      color: grayLight,
      maxWidth: width - 80,
      lineHeight: 11,
    }
  );

  currentY -= 60;

  // Linhas de assinatura
  page.drawLine({
    start: { x: 70, y: currentY },
    end: { x: 250, y: currentY },
    thickness: 1,
    color: grayDark,
  });
  page.drawText(data.clientName, {
    x: 70,
    y: currentY - 14,
    size: 8,
    font: fontBold,
    color: white,
  });
  page.drawText("Comprador(a)", {
    x: 70,
    y: currentY - 26,
    size: 8,
    font: fontRegular,
    color: grayLight,
  });

  page.drawLine({
    start: { x: 340, y: currentY },
    end: { x: 520, y: currentY },
    thickness: 1,
    color: grayDark,
  });
  page.drawText(data.corretorName, {
    x: 340,
    y: currentY - 14,
    size: 8,
    font: fontBold,
    color: white,
  });
  page.drawText(`Corretor Responsável • CRECI ${data.creci}`, {
    x: 340,
    y: currentY - 26,
    size: 8,
    font: fontRegular,
    color: grayLight,
  });

  return await pdfDoc.save();
}
