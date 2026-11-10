"use client";

import * as React from "react";
import {
  Calculator,
  Download,
  Building,
  User,
  Users,
  Phone,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  FileText,
  FileEdit,
  DollarSign,
  TrendingDown,
  Calendar,
  ShieldCheck,
  Check,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  calculateCaixaSimulation,
  SimulationInput,
  SimulationResult,
} from "@/lib/calculator/caixa";
import { SimulationSystem } from "@/types/database";

// Anos de nascimento permitidos pela Caixa (de 18 anos até teto Caixa ~80 anos, cobrindo 1940 até 2008)
const BIRTH_YEARS = Array.from({ length: 2008 - 1940 + 1 }, (_, i) => 2008 - i);

export default function SimulationsPage() {
  // Parâmetros Financeiros & Regras Caixa (Reversas)
  const [propertyValue, setPropertyValue] = React.useState<number>(273700);
  const [grossIncome, setGrossIncome] = React.useState<number>(7500);
  const [birthDate, setBirthDate] = React.useState<string>("1994-05-15"); // 30 anos por padrão
  const [cidade, setCidade] = React.useState<string>("Criciúma");
  const [uf, setUf] = React.useState<string>("SC");
  const [fgtsValue, setFgtsValue] = React.useState<number>(0);
  const [useFgtsAsX, setUseFgtsAsX] = React.useState<boolean>(true);
  const [systemType, setSystemType] = React.useState<SimulationSystem>("SAC");
  const [termMonths, setTermMonths] = React.useState<number>(420);
  const [builderMonths, setBuilderMonths] = React.useState<number>(60);
  const [builderReforcos, setBuilderReforcos] = React.useState<number>(0);
  const [sinalPercent, setSinalPercent] = React.useState<number>(10);

  // Identificação do Imóvel para a Proposta
  const [construtoraEmpreendimento, setConstrutoraEmpreendimento] = React.useState("PLAZA MAYOR");
  const [unidadeApartamento, setUnidadeApartamento] = React.useState("808 T 01");
  const [garagemBox, setGaragemBox] = React.useState("12");
  const [outrasInformacoes, setOutrasInformacoes] = React.useState("");

  // Dados do Comprador (Proponente)
  const [compradorNome, setCompradorNome] = React.useState("EMILI CRISTINA RODRIGUES ROSA");
  const [compradorCpf, setCompradorCpf] = React.useState("073.538.829-64");
  const [compradorRg, setCompradorRg] = React.useState("");
  const [compradorEstadoCivil, setCompradorEstadoCivil] = React.useState("SOLTEIRA");
  const [compradorProfissao, setCompradorProfissao] = React.useState("");
  const [compradorEmail, setCompradorEmail] = React.useState("emilicristinarodriguesrosa@gmail.com");
  const [compradorTelefone, setCompradorTelefone] = React.useState("(48) 99944-7670");

  // Dados do Cônjuge (quando aplicável)
  const [hasConjuge, setHasConjuge] = React.useState(true);
  const [conjugeNome, setConjugeNome] = React.useState("KEILA BEZ GENUINO");
  const [conjugeCpf, setConjugeCpf] = React.useState("110.962.469-70");
  const [conjugeRg, setConjugeRg] = React.useState("");
  const [conjugeProfissao, setConjugeProfissao] = React.useState("");
  const [conjugeEmail, setConjugeEmail] = React.useState("keilabezg@gmail.com");
  const [conjugeTelefone, setConjugeTelefone] = React.useState("(48) 99651-3475");

  // Data do Documento
  const [dataDia, setDataDia] = React.useState("04");
  const [dataMes, setDataMes] = React.useState("NOVEMBRO");
  const [dataAno, setDataAno] = React.useState("2026");
  const [referenceDate, setReferenceDate] = React.useState<Date>(() => new Date(2025, 0, 1));

  React.useEffect(() => {
    const now = new Date();
    const months = [
      "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
      "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];
    setDataDia(String(now.getDate()).padStart(2, "0"));
    setDataMes(months[now.getMonth()]);
    setDataAno(String(now.getFullYear()));
    setReferenceDate(now);
  }, []);

  const [observacoes, setObservacoes] = React.useState(
    "TELEFONES: EMILI 48 99944-7670 / KEILA 48 99651-3475"
  );

  // Loading states
  const [generatingMode, setGeneratingMode] = React.useState<"normal" | "editable" | null>(null);
  const [pdfSuccessMessage, setPdfSuccessMessage] = React.useState<string | null>(null);

  // Recálculo da Simulação Caixa com o Motor Oficial Reverso
  const simulation: SimulationResult = React.useMemo(() => {
    return calculateCaixaSimulation({
      propertyValue,
      grossIncome,
      birthDate,
      referenceDate,
      cidade,
      uf,
      fgtsValue,
      systemType,
      termMonths,
      builderInstallmentsCount: builderMonths,
      builderReforcosCount: builderReforcos,
      sinalPercent,
    });
  }, [
    propertyValue,
    grossIncome,
    birthDate,
    referenceDate,
    cidade,
    uf,
    fgtsValue,
    systemType,
    termMonths,
    builderMonths,
    builderReforcos,
    sinalPercent,
  ]);

  const handleDownloadPdf = async (isEditable: boolean = false) => {
    try {
      setGeneratingMode(isEditable ? "editable" : "normal");
      setPdfSuccessMessage(null);

      const payload = {
        proposalNumber: `P-${Date.now().toString().slice(-4)}`,
        dataProposta: `${dataDia}/${dataMes}/${dataAno}`,
        construtoraEmpreendimento,
        unidadeApartamento,
        garagemBox,
        outrasInformacoes,
        propertyValue,
        sinalValor: simulation.builderPlan.sinal,
        sinalPrazo: "ato",
        parcelasValor: simulation.builderPlan.mensais.valorUnitario,
        parcelasQuantidade: simulation.builderPlan.mensais.qtd,
        reforcosValor: simulation.builderPlan.reforcos.qtd > 0 ? simulation.builderPlan.reforcos.valorUnitario : undefined,
        reforcosQuantidade: simulation.builderPlan.reforcos.qtd > 0 ? simulation.builderPlan.reforcos.qtd : undefined,
        reforcosPrazo: simulation.builderPlan.reforcos.qtd > 0 ? "semestral" : undefined,
        fgtsValor: useFgtsAsX ? "X" : fgtsValue > 0 ? fgtsValue : undefined,
        financiamentoValor: simulation.approvedFinancingValue,
        compradorNome,
        compradorCpf,
        compradorRg,
        compradorEstadoCivil,
        compradorProfissao,
        compradorEmail,
        compradorTelefone,
        conjugeNome: hasConjuge ? conjugeNome : undefined,
        conjugeCpf: hasConjuge ? conjugeCpf : undefined,
        conjugeRg: hasConjuge ? conjugeRg : undefined,
        conjugeProfissao: hasConjuge ? conjugeProfissao : undefined,
        conjugeEmail: hasConjuge ? conjugeEmail : undefined,
        conjugeTelefone: hasConjuge ? conjugeTelefone : undefined,
        observacoes,
        cidade,
        dataDia,
        dataMes,
        dataAno,
        isEditable,
        simulation,
      };

      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro na resposta do servidor");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const suffix = isEditable ? "_editavel" : "";
      a.download = `proposta-${compradorNome.replace(/\s+/g, "_")}${suffix}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setPdfSuccessMessage(isEditable ? "PDF Editável Baixado!" : "PDF Baixado com Sucesso!");
      setTimeout(() => setPdfSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert("Falha ao gerar o PDF. Verifique os dados e tente novamente.");
    } finally {
      setGeneratingMode(null);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header & Dual PDF Download Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Simulador Caixa & Proposta Comercial
            </h1>
            <Badge variant="default" className="text-xs">
              Motor Oficial Caixa v1.16
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Cálculo exato com regras oficiais da Caixa Econômica Federal (MIP por idade, DFI, TAC, limite 80,5 anos e teto 30% da renda).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {pdfSuccessMessage && (
            <Badge variant="success" className="text-xs py-1 px-3 gap-1.5 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {pdfSuccessMessage}
            </Badge>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => handleDownloadPdf(true)}
            disabled={generatingMode !== null}
            className="rounded-full text-xs font-semibold"
          >
            {generatingMode === "editable" ? (
              "Gerando Editável..."
            ) : (
              <>
                <FileEdit className="h-4 w-4 mr-1 text-emerald-600 dark:text-[#ccff00]" />
                Gerar PDF Editável
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={() => handleDownloadPdf(false)}
            disabled={generatingMode !== null}
            className="rounded-full shadow-sm dark:shadow-[0_0_20px_rgba(204,255,0,0.3)] text-xs font-semibold"
          >
            {generatingMode === "normal" ? (
              "Gerando PDF..."
            ) : (
              <>
                <Download className="h-4 w-4 mr-1" />
                Gerar PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 4 KPIs Topo: Dados Reais da Simulação Caixa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Financiamento Caixa */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Financiamento Caixa</span>
            <Badge variant={simulation.rendaSuficiente ? "success" : "warning"} className="text-[9px] py-0 px-1.5">
              {simulation.rendaSuficiente ? "80% Aprovado" : "Margem Limitada"}
            </Badge>
          </div>
          <p className="text-2xl font-bold text-foreground font-mono">
            {formatCurrency(simulation.approvedFinancingValue)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Taxa: <strong className="text-foreground">{simulation.interestRateAnnual}% a.a.</strong> (Faixa {simulation.caixaFaixaId})
          </p>
        </div>

        {/* 1ª Parcela Estimada Caixa (com TAC, DFI e MIP) */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">1ª Parcela Estimada</span>
            <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-[#ccff00]">
              {simulation.comprometimentoRendaPercent}% da renda
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-[#ccff00] font-mono">
            {formatCurrency(simulation.firstInstallmentCaixa)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Base: {formatCurrency(simulation.firstInstallmentBase)} + Seguros: {formatCurrency(simulation.encargos.totalEncargosMensais)}
          </p>
        </div>

        {/* Gap Entrada Construtora */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Entrada com Construtora</span>
            {simulation.subsidyValue > 0 && (
              <span className="text-[10px] text-cyan-600 font-semibold">
                +{formatCurrency(simulation.subsidyValue)} Subsídio
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
            {formatCurrency(simulation.downPaymentGap)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Em até {builderMonths}x direto em obras
          </p>
        </div>

        {/* Prazo Máximo pela Idade */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Prazo Caixa Aplicado</span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Idade: {simulation.proponentAgeYears} anos
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground font-mono">
            {simulation.appliedTermMonths} <span className="text-xs font-normal text-muted-foreground">meses</span>
          </p>
          <p className="text-[10px] text-muted-foreground">
            Teto Caixa: {simulation.maxCaixaTermMonths}m (Regra 80,5 anos)
          </p>
        </div>
      </div>

      {/* Composição Visual do Pagamento (Barra empilhada colorida) */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
            Composição Financeira da Compra
          </h3>
          <span className="text-xs font-mono font-bold text-foreground">
            Valor do Imóvel: {formatCurrency(propertyValue)}
          </span>
        </div>

        <div className="h-6 w-full rounded-full bg-muted flex overflow-hidden p-0.5 gap-1 border border-border">
          <div
            style={{ width: `${(simulation.approvedFinancingValue / propertyValue) * 100}%` }}
            className="bg-emerald-600 dark:bg-[#ccff00] rounded-l-full transition-all duration-300"
            title={`Financiamento Caixa: ${formatCurrency(simulation.approvedFinancingValue)}`}
          />
          {simulation.subsidyValue > 0 && (
            <div
              style={{ width: `${(simulation.subsidyValue / propertyValue) * 100}%` }}
              className="bg-cyan-500 transition-all duration-300"
              title={`Subsídio MCMV: ${formatCurrency(simulation.subsidyValue)}`}
            />
          )}
          {simulation.fgtsValue > 0 && (
            <div
              style={{ width: `${(simulation.fgtsValue / propertyValue) * 100}%` }}
              className="bg-teal-500 transition-all duration-300"
              title={`FGTS: ${formatCurrency(simulation.fgtsValue)}`}
            />
          )}
          <div
            style={{ width: `${(simulation.downPaymentGap / propertyValue) * 100}%` }}
            className="bg-amber-500 rounded-r-full transition-all duration-300"
            title={`Entrada Construtora: ${formatCurrency(simulation.downPaymentGap)}`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-[#ccff00]" />
            <span className="text-foreground">Caixa: {formatCurrency(simulation.approvedFinancingValue)} ({Math.round((simulation.approvedFinancingValue / propertyValue) * 100)}%)</span>
          </div>
          {simulation.subsidyValue > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
              <span className="text-foreground">Subsídio: {formatCurrency(simulation.subsidyValue)}</span>
            </div>
          )}
          {simulation.fgtsValue > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
              <span className="text-foreground">FGTS: {formatCurrency(simulation.fgtsValue)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-foreground">Entrada Construtora: {formatCurrency(simulation.downPaymentGap)} ({Math.round((simulation.downPaymentGap / propertyValue) * 100)}%)</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Parâmetros Caixa e Dados do Cliente (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Parâmetros Oficiais Caixa */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Variáveis da Simulação Caixa
              </h2>
              <span className="text-[11px] text-muted-foreground font-mono">Parâmetros Oficiais</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">
                  Valor Total do Imóvel (R$)
                </label>
                <input
                  type="number"
                  step="100"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground font-mono text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">
                  Renda Bruta Familiar (R$)
                </label>
                <input
                  type="number"
                  step="200"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground font-mono text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              {/* Data de Nascimento / Idade (Regra 80,5 anos e MIP) */}
              <div>
                <label className="text-muted-foreground block mb-1 font-medium flex items-center justify-between">
                  <span>Data de Nasc. (Proponente)</span>
                  <span className="text-[10px] text-emerald-600 dark:text-[#ccff00] font-mono">
                    {simulation.proponentAgeYears} anos ({simulation.appliedTermMonths}m teto)
                  </span>
                </label>
                <div className="grid grid-cols-12 gap-1.5">
                  <div className="col-span-8">
                    <input
                      type="date"
                      min="1940-01-01"
                      max="2008-12-31"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                      title="Selecione ou digite a data de nascimento (a partir de 1940)"
                    />
                  </div>
                  <div className="col-span-4">
                    <select
                      value={birthDate ? birthDate.split("-")[0] : "1994"}
                      onChange={(e) => {
                        const newYear = e.target.value;
                        const parts = (birthDate || "1994-05-15").split("-");
                        const month = parts[1] || "05";
                        const day = parts[2] || "15";
                        setBirthDate(`${newYear}-${month}-${day}`);
                      }}
                      className="w-full h-9 px-2 rounded-xl bg-muted border border-border text-foreground font-mono text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                      title="Ano rápido (vai de 2008 até 1940)"
                    >
                      {BIRTH_YEARS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Permite nascimentos de 1940 a 2008 (incluindo 1960)
                </span>
              </div>

              {/* Cidade e UF */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-muted-foreground block mb-1 font-medium">Cidade do Imóvel</label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">UF</label>
                  <input
                    type="text"
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-xl bg-muted border border-border text-foreground text-xs uppercase focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>
              </div>

              {/* Sistema SAC vs PRICE */}
              <div>
                <label className="text-muted-foreground block mb-1.5 font-medium">Sistema Amortização</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSystemType("SAC")}
                    className={`h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      systemType === "SAC"
                        ? "bg-emerald-600 dark:bg-[#ccff00] text-white dark:text-black border-emerald-600 dark:border-[#ccff00]"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    SAC (Decrescente)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSystemType("PRICE")}
                    className={`h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      systemType === "PRICE"
                        ? "bg-emerald-600 dark:bg-[#ccff00] text-white dark:text-black border-emerald-600 dark:border-[#ccff00]"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    PRICE (Fixa)
                  </button>
                </div>
              </div>

              {/* Prazo Caixa */}
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">
                  Prazo Desejado (Meses)
                </label>
                <select
                  value={termMonths}
                  onChange={(e) => setTermMonths(Number(e.target.value))}
                  className="w-full h-8 px-2.5 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                >
                  <option value={420}>420 meses (35 anos)</option>
                  <option value={360}>360 meses (30 anos)</option>
                  <option value={240}>240 meses (20 anos)</option>
                  <option value={180}>180 meses (15 anos)</option>
                </select>
              </div>

              {/* FGTS */}
              <div className="sm:col-span-2 p-2.5 rounded-xl bg-muted/60 border border-border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground text-xs">Utilização de FGTS</p>
                  <p className="text-[10px] text-muted-foreground">Marcar com "X" na proposta oficial</p>
                </div>
                <button
                  type="button"
                  onClick={() => setUseFgtsAsX(!useFgtsAsX)}
                  className={`h-7 px-3 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    useFgtsAsX
                      ? "bg-emerald-600 dark:bg-[#ccff00] text-white dark:text-black border-emerald-600 dark:border-[#ccff00]"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {useFgtsAsX ? <Check className="h-3 w-3" /> : null}
                  {useFgtsAsX ? "Marcado (X)" : "Não Utilizar"}
                </button>
              </div>
            </div>

            {/* Detalhamento dos Encargos Caixa (TAC + DFI + MIP) */}
            <div className="pt-3 border-t border-border space-y-2 text-xs">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-[#ccff00]" />
                Encargos Mensais Caixa (Embutidos na Parcela)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-muted/50 border border-border text-center">
                  <span className="text-[10px] text-muted-foreground block">TAC (Adm)</span>
                  <strong className="text-foreground font-mono">{formatCurrency(simulation.encargos.tac)}</strong>
                </div>
                <div className="p-2 rounded-lg bg-muted/50 border border-border text-center">
                  <span className="text-[10px] text-muted-foreground block">DFI (Imóvel)</span>
                  <strong className="text-foreground font-mono">{formatCurrency(simulation.encargos.dfi)}</strong>
                </div>
                <div className="p-2 rounded-lg bg-muted/50 border border-border text-center">
                  <span className="text-[10px] text-muted-foreground block">MIP (Vida: {simulation.proponentAgeYears}a)</span>
                  <strong className="text-foreground font-mono">{formatCurrency(simulation.encargos.mip)}</strong>
                </div>
              </div>
            </div>
          </Card>

          {/* Identificação do Imóvel para a Proposta */}
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Building className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
              Dados do Imóvel para a Proposta Oficial
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-muted-foreground block mb-1 font-medium">
                  Construtora / Empreendimento
                </label>
                <input
                  type="text"
                  value={construtoraEmpreendimento}
                  onChange={(e) => setConstrutoraEmpreendimento(e.target.value)}
                  className="w-full h-8 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Unidade / Apartamento</label>
                <input
                  type="text"
                  value={unidadeApartamento}
                  onChange={(e) => setUnidadeApartamento(e.target.value)}
                  className="w-full h-8 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Garagem / Box</label>
                <input
                  type="text"
                  value={garagemBox}
                  onChange={(e) => setGaragemBox(e.target.value)}
                  className="w-full h-8 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Coluna Direita: Dados Proponente/Cônjuge e Tabela do PDF (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Dados do Comprador e Cônjuge */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Dados do Comprador & Cônjuge
              </h2>
              <button
                type="button"
                onClick={() => setHasConjuge(!hasConjuge)}
                className={`text-xs px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                  hasConjuge
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-[#ccff00]"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {hasConjuge ? "Com Cônjuge" : "Sem Cônjuge"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-muted-foreground block mb-1 font-medium">Nome do Comprador</label>
                <input
                  type="text"
                  value={compradorNome}
                  onChange={(e) => setCompradorNome(e.target.value)}
                  className="w-full h-8 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">CPF do Comprador</label>
                <input
                  type="text"
                  value={compradorCpf}
                  onChange={(e) => setCompradorCpf(e.target.value)}
                  className="w-full h-8 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Estado Civil</label>
                <input
                  type="text"
                  value={compradorEstadoCivil}
                  onChange={(e) => setCompradorEstadoCivil(e.target.value)}
                  className="w-full h-8 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              {hasConjuge && (
                <>
                  <div className="sm:col-span-2 pt-2 border-t border-border">
                    <span className="text-[11px] font-semibold text-foreground block mb-2">Dados do Cônjuge:</span>
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1 font-medium">Nome do Cônjuge</label>
                    <input
                      type="text"
                      value={conjugeNome}
                      onChange={(e) => setConjugeNome(e.target.value)}
                      className="w-full h-8 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1 font-medium">CPF do Cônjuge</label>
                    <input
                      type="text"
                      value={conjugeCpf}
                      onChange={(e) => setConjugeCpf(e.target.value)}
                      className="w-full h-8 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                    />
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Tabela Oficial da Proposta & Botões de Download */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Tabela Oficial Gerada no PDF
              </h3>
              <Badge variant="outline" className="text-[10px]">
                {formatCurrency(propertyValue)}
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-muted/70 border border-border font-semibold text-muted-foreground text-[11px]">
                <span className="col-span-5">FORMA DE PAGAMENTO</span>
                <span className="col-span-3 text-right">VALOR (R$)</span>
                <span className="col-span-2 text-center">QTD</span>
                <span className="col-span-2 text-right">PRAZO</span>
              </div>

              {/* Sinal */}
              <div className="grid grid-cols-12 gap-2 p-2 rounded-xl bg-muted/40 border border-border items-center">
                <span className="col-span-5 font-medium text-foreground">Sinal / Entrada</span>
                <span className="col-span-3 text-right font-mono font-bold text-foreground">
                  {formatCurrency(simulation.builderPlan.sinal)}
                </span>
                <span className="col-span-2 text-center text-muted-foreground">-</span>
                <span className="col-span-2 text-right font-medium text-foreground">ato</span>
              </div>

              {/* Mensais */}
              <div className="grid grid-cols-12 gap-2 p-2 rounded-xl bg-muted/40 border border-border items-center">
                <span className="col-span-5 font-medium text-foreground">Parcelas mensais</span>
                <span className="col-span-3 text-right font-mono font-bold text-emerald-600 dark:text-[#ccff00]">
                  {formatCurrency(simulation.builderPlan.mensais.valorUnitario)}
                </span>
                <span className="col-span-2 text-center font-mono font-semibold text-foreground">
                  {simulation.builderPlan.mensais.qtd}
                </span>
                <span className="col-span-2 text-right text-muted-foreground">-</span>
              </div>

              {/* Reforços */}
              {simulation.builderPlan.reforcos.qtd > 0 && (
                <div className="grid grid-cols-12 gap-2 p-2 rounded-xl bg-muted/40 border border-border items-center">
                  <span className="col-span-5 font-medium text-foreground">Reforços</span>
                  <span className="col-span-3 text-right font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {formatCurrency(simulation.builderPlan.reforcos.valorUnitario)}
                  </span>
                  <span className="col-span-2 text-center font-mono font-semibold text-foreground">
                    {simulation.builderPlan.reforcos.qtd}
                  </span>
                  <span className="col-span-2 text-right text-foreground">semestral</span>
                </div>
              )}

              {/* FGTS */}
              <div className="grid grid-cols-12 gap-2 p-2 rounded-xl bg-muted/40 border border-border items-center">
                <span className="col-span-5 font-medium text-foreground">Utilização de FGTS</span>
                <span className="col-span-3 text-right font-bold text-foreground">
                  {useFgtsAsX ? "X" : formatCurrency(fgtsValue)}
                </span>
                <span className="col-span-2 text-center text-muted-foreground">-</span>
                <span className="col-span-2 text-right text-muted-foreground">-</span>
              </div>

              {/* Financiamento Caixa */}
              <div className="grid grid-cols-12 gap-2 p-2 rounded-xl bg-muted/40 border border-border items-center">
                <span className="col-span-5 font-medium text-foreground">Financiamento (CAIXA)</span>
                <span className="col-span-3 text-right font-mono font-bold text-foreground">
                  {formatCurrency(simulation.approvedFinancingValue)}
                </span>
                <span className="col-span-2 text-center text-muted-foreground">-</span>
                <span className="col-span-2 text-right text-muted-foreground">-</span>
              </div>
            </div>

            {/* Ações de Download no Rodapé */}
            <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                <span>1ª Parcela Caixa: </span>
                <strong className="text-foreground font-mono">
                  {formatCurrency(simulation.firstInstallmentCaixa)}
                </strong>
                <span className="text-[10px] text-muted-foreground ml-1">({systemType})</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDownloadPdf(true)}
                  disabled={generatingMode !== null}
                  size="sm"
                  className="rounded-full text-xs"
                >
                  <FileEdit className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-[#ccff00]" />
                  {generatingMode === "editable" ? "Gerando..." : "Gerar PDF Editável"}
                </Button>

                <Button
                  type="button"
                  onClick={() => handleDownloadPdf(false)}
                  disabled={generatingMode !== null}
                  size="sm"
                  className="rounded-full shadow-sm text-xs"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  {generatingMode === "normal" ? "Gerando..." : "Gerar PDF"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
