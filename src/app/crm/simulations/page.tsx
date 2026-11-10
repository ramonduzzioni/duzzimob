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
  Check,
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

export default function SimulationsPage() {
  // Parâmetros Financeiros
  const [propertyValue, setPropertyValue] = React.useState<number>(273700);
  const [grossIncome, setGrossIncome] = React.useState<number>(7500);
  const [fgtsValue, setFgtsValue] = React.useState<number>(0);
  const [useFgtsAsX, setUseFgtsAsX] = React.useState<boolean>(true);
  const [systemType, setSystemType] = React.useState<SimulationSystem>("SAC");
  const [termMonths, setTermMonths] = React.useState<number>(420);
  const [interestRate, setInterestRate] = React.useState<number>(9.25);
  const [builderMonths, setBuilderMonths] = React.useState<number>(60);
  const [builderReforcos, setBuilderReforcos] = React.useState<number>(0);
  const [sinalPercent, setSinalPercent] = React.useState<number>(10);

  // Identificação do Imóvel
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

  // Local e Data
  const [cidade, setCidade] = React.useState("CRICIÚMA");
  const [dataDia, setDataDia] = React.useState("04");
  const [dataMes, setDataMes] = React.useState("NOVEMBRO");
  const [dataAno, setDataAno] = React.useState("2026");

  React.useEffect(() => {
    const now = new Date();
    const months = [
      "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
      "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];
    setDataDia(String(now.getDate()).padStart(2, "0"));
    setDataMes(months[now.getMonth()]);
    setDataAno(String(now.getFullYear()));
  }, []);

  // Observações personalizadas
  const [observacoes, setObservacoes] = React.useState(
    "TELEFONES: EMILI 48 99944-7670 / KEILA 48 99651-3475"
  );

  // Loading states
  const [generatingMode, setGeneratingMode] = React.useState<"normal" | "editable" | null>(null);
  const [pdfSuccessMessage, setPdfSuccessMessage] = React.useState<string | null>(null);

  // Recalculate on any input change
  const simulation: SimulationResult = React.useMemo(() => {
    return calculateCaixaSimulation({
      propertyValue,
      grossIncome,
      fgtsValue,
      systemType,
      termMonths,
      interestRateAnnual: interestRate,
      builderInstallmentsCount: builderMonths,
      builderReforcosCount: builderReforcos,
      sinalPercent,
    });
  }, [
    propertyValue,
    grossIncome,
    fgtsValue,
    systemType,
    termMonths,
    interestRate,
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
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Proposta de Compra de Imóvel & Simulação Caixa
            </h1>
            <Badge variant="default" className="text-xs">
              Modelo Oficial Ramon Duzzioni
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Geração de proposta no layout oficial com dados da construtora, comprador, cônjuge e condições de pagamento.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Dados do Imóvel, Proponente e Cônjuge (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Identificação do Imóvel */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Building className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Identificação do Imóvel
              </h2>
              <span className="text-[11px] text-muted-foreground font-mono">Empreendimento</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-muted-foreground block mb-1 font-medium">
                  Construtora / Empreendimento
                </label>
                <input
                  type="text"
                  value={construtoraEmpreendimento}
                  onChange={(e) => setConstrutoraEmpreendimento(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">
                  Unidade / Apartamento
                </label>
                <input
                  type="text"
                  value={unidadeApartamento}
                  onChange={(e) => setUnidadeApartamento(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">
                  Garagem / Box
                </label>
                <input
                  type="text"
                  value={garagemBox}
                  onChange={(e) => setGaragemBox(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-muted-foreground block mb-1 font-medium">
                  Outras Informações
                </label>
                <input
                  type="text"
                  placeholder="Ex: Andar alto, sol da manhã, depósito"
                  value={outrasInformacoes}
                  onChange={(e) => setOutrasInformacoes(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>
            </div>
          </Card>

          {/* Dados do Comprador (Proponente) */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Dados do Comprador (Proponente)
              </h2>
              <span className="text-[11px] text-muted-foreground font-mono">Titular</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-muted-foreground block mb-1 font-medium">Nome Completo</label>
                <input
                  type="text"
                  value={compradorNome}
                  onChange={(e) => setCompradorNome(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">CPF</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={compradorCpf}
                  onChange={(e) => setCompradorCpf(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">RG</label>
                <input
                  type="text"
                  placeholder="0.000.000"
                  value={compradorRg}
                  onChange={(e) => setCompradorRg(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Estado Civil</label>
                <input
                  type="text"
                  placeholder="SOLTEIRO(A), CASADO(A)"
                  value={compradorEstadoCivil}
                  onChange={(e) => setCompradorEstadoCivil(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Profissão</label>
                <input
                  type="text"
                  value={compradorProfissao}
                  onChange={(e) => setCompradorProfissao(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">E-mail</label>
                <input
                  type="email"
                  value={compradorEmail}
                  onChange={(e) => setCompradorEmail(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">Telefone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="(48) 99999-9999"
                  value={compradorTelefone}
                  onChange={(e) => setCompradorTelefone(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>
            </div>
          </Card>

          {/* Dados do Cônjuge */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Dados do Cônjuge (Quando Aplicável)
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
                {hasConjuge ? "Habilitado" : "Não Aplicável"}
              </button>
            </div>

            {hasConjuge && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in duration-200">
                <div className="sm:col-span-2">
                  <label className="text-muted-foreground block mb-1 font-medium">Nome Completo</label>
                  <input
                    type="text"
                    value={conjugeNome}
                    onChange={(e) => setConjugeNome(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">CPF</label>
                  <input
                    type="text"
                    value={conjugeCpf}
                    onChange={(e) => setConjugeCpf(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">RG</label>
                  <input
                    type="text"
                    value={conjugeRg}
                    onChange={(e) => setConjugeRg(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">Profissão</label>
                  <input
                    type="text"
                    value={conjugeProfissao}
                    onChange={(e) => setConjugeProfissao(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">E-mail</label>
                  <input
                    type="email"
                    value={conjugeEmail}
                    onChange={(e) => setConjugeEmail(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-muted-foreground block mb-1 font-medium">Telefone</label>
                  <input
                    type="text"
                    value={conjugeTelefone}
                    onChange={(e) => setConjugeTelefone(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Observações / Condições Especiais & Data */}
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
              Observações & Data da Proposta
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">
                  Observações / Condições Especiais (Ex: Telefones de Contato)
                </label>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00] resize-none"
                />
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                <div className="col-span-4 sm:col-span-1">
                  <label className="text-muted-foreground block mb-1 text-[11px]">Cidade</label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1 text-[11px]">Dia</label>
                  <input
                    type="text"
                    value={dataDia}
                    onChange={(e) => setDataDia(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1 text-[11px]">Mês</label>
                  <input
                    type="text"
                    value={dataMes}
                    onChange={(e) => setDataMes(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1 text-[11px]">Ano</label>
                  <input
                    type="text"
                    value={dataAno}
                    onChange={(e) => setDataAno(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Coluna Direita: Parâmetros Financeiros e Visualização do Fluxo (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Parâmetros Financeiros */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Condições de Pagamento & Financiamento
              </h2>
              <span className="text-[11px] text-muted-foreground font-mono">Simulador</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">
                  Valor Total do Imóvel (R$)
                </label>
                <input
                  type="number"
                  step="100"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border text-foreground font-mono text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">
                    Renda Bruta Familiar (R$)
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={grossIncome}
                    onChange={(e) => setGrossIncome(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-xl bg-muted border border-border text-foreground font-mono text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">
                    Sistema Amortização
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setSystemType("SAC")}
                      className={`h-9 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        systemType === "SAC"
                          ? "bg-emerald-600 dark:bg-[#ccff00] text-white dark:text-black border-emerald-600 dark:border-[#ccff00]"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      SAC
                    </button>
                    <button
                      type="button"
                      onClick={() => setSystemType("PRICE")}
                      className={`h-9 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        systemType === "PRICE"
                          ? "bg-emerald-600 dark:bg-[#ccff00] text-white dark:text-black border-emerald-600 dark:border-[#ccff00]"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      PRICE
                    </button>
                  </div>
                </div>
              </div>

              {/* FGTS */}
              <div className="p-3 rounded-xl bg-muted/60 border border-border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Utilização de FGTS</p>
                  <p className="text-[11px] text-muted-foreground">Marcar com "X" na proposta</p>
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

              {/* Parcelamento Construtora */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="text-muted-foreground block mb-1 text-[11px]">Sinal (%)</label>
                  <input
                    type="number"
                    value={sinalPercent}
                    onChange={(e) => setSinalPercent(Number(e.target.value))}
                    className="w-full h-9 px-2.5 rounded-lg bg-muted border border-border text-foreground font-mono text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1 text-[11px]">Mensais (Qtd)</label>
                  <input
                    type="number"
                    value={builderMonths}
                    onChange={(e) => setBuilderMonths(Number(e.target.value))}
                    className="w-full h-9 px-2.5 rounded-lg bg-muted border border-border text-foreground font-mono text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1 text-[11px]">Reforços (Qtd)</label>
                  <input
                    type="number"
                    value={builderReforcos}
                    onChange={(e) => setBuilderReforcos(Number(e.target.value))}
                    className="w-full h-9 px-2.5 rounded-lg bg-muted border border-border text-foreground font-mono text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Resumo da Proposta (Tabela que vai pro PDF) */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Tabela que será gerada no PDF
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
              <div className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-muted/40 border border-border items-center">
                <span className="col-span-5 font-medium text-foreground">Sinal / Entrada</span>
                <span className="col-span-3 text-right font-mono font-bold text-foreground">
                  {formatCurrency(simulation.builderPlan.sinal)}
                </span>
                <span className="col-span-2 text-center text-muted-foreground">-</span>
                <span className="col-span-2 text-right font-medium text-foreground">ato</span>
              </div>

              {/* Mensais */}
              <div className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-muted/40 border border-border items-center">
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
                <div className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-muted/40 border border-border items-center">
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
              <div className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-muted/40 border border-border items-center">
                <span className="col-span-5 font-medium text-foreground">Utilização de FGTS</span>
                <span className="col-span-3 text-right font-bold text-foreground">
                  {useFgtsAsX ? "X" : formatCurrency(fgtsValue)}
                </span>
                <span className="col-span-2 text-center text-muted-foreground">-</span>
                <span className="col-span-2 text-right text-muted-foreground">-</span>
              </div>

              {/* Financiamento Caixa */}
              <div className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-muted/40 border border-border items-center">
                <span className="col-span-5 font-medium text-foreground">Financiamento (CAIXA)</span>
                <span className="col-span-3 text-right font-mono font-bold text-foreground">
                  {formatCurrency(simulation.approvedFinancingValue)}
                </span>
                <span className="col-span-2 text-center text-muted-foreground">-</span>
                <span className="col-span-2 text-right text-muted-foreground">-</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                <span>1ª Parcela Caixa estimada: </span>
                <strong className="text-foreground font-mono">
                  {formatCurrency(simulation.firstInstallmentCaixa)}
                </strong>
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
