"use client";

import * as React from "react";
import {
  Calculator,
  Download,
  Building,
  User,
  Phone,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  FileText,
  DollarSign,
  TrendingDown,
  Calendar,
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
  // Input states
  const [propertyValue, setPropertyValue] = React.useState<number>(380000);
  const [grossIncome, setGrossIncome] = React.useState<number>(8500);
  const [fgtsValue, setFgtsValue] = React.useState<number>(25000);
  const [systemType, setSystemType] = React.useState<SimulationSystem>("SAC");
  const [termMonths, setTermMonths] = React.useState<number>(420);
  const [interestRate, setInterestRate] = React.useState<number>(9.25);
  const [builderMonths, setBuilderMonths] = React.useState<number>(36);
  const [builderReforcos, setBuilderReforcos] = React.useState<number>(4);
  const [sinalPercent, setSinalPercent] = React.useState<number>(10);

  // Client info for proposal
  const [clientName, setClientName] = React.useState("Eduardo Silveira");
  const [clientPhone, setClientPhone] = React.useState("(48) 99123-4567");
  const [propertyTitle, setPropertyTitle] = React.useState(
    "Residencial Jardins do Vale (Ap. 402)"
  );
  const [neighborhood, setNeighborhood] = React.useState("Centro, Criciúma");
  const [corretorName] = React.useState("Carlos Duzzi");
  const [creci] = React.useState("48.912-F");

  // Loading states
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const [pdfSuccess, setPdfSuccess] = React.useState(false);

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

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      setPdfSuccess(false);

      const payload = {
        proposalNumber: `P-${Date.now().toString().slice(-6)}`,
        clientName,
        clientPhone,
        propertyTitle,
        neighborhood,
        corretorName,
        creci,
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
      a.download = `proposta-${clientName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Falha ao gerar o PDF. Verifique os dados e tente novamente.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Simulador Habitacional Caixa & Construtora
            </h1>
            <Badge variant="default" className="text-xs">
              MCMV & SBPE
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Cálculo imediato de financiamento Caixa, amortização SAC/PRICE, subsídios e fluxo de parcelamento de entrada.
          </p>
        </div>

        <Button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="rounded-full shadow-sm dark:shadow-[0_0_20px_rgba(204,255,0,0.3)] text-xs font-semibold"
        >
          {isGeneratingPdf ? (
            "Gerando Documento..."
          ) : pdfSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              PDF Baixado com Sucesso!
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-1" />
              Emitir Proposta em PDF
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Formulário de Parâmetros (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Parâmetros Financeiros
              </h2>
              <span className="text-[11px] text-muted-foreground font-mono">Recálculo em Tempo Real</span>
            </div>

            {/* Inputs principais */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-muted-foreground block mb-1 font-medium">
                  Valor de Venda do Imóvel (R$)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border text-foreground font-mono text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">
                  Renda Bruta Familiar Comprovada (R$)
                </label>
                <input
                  type="number"
                  step="500"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border text-foreground font-mono text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-medium">
                  Saldo de FGTS a Utilizar (R$)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={fgtsValue}
                  onChange={(e) => setFgtsValue(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border text-foreground font-mono text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              {/* Sistema SAC vs PRICE */}
              <div>
                <label className="text-muted-foreground block mb-1.5 font-medium">
                  Sistema de Amortização
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSystemType("SAC")}
                    className={`h-9 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      systemType === "SAC"
                        ? "bg-emerald-600 dark:bg-[#ccff00] text-white dark:text-black border-emerald-600 dark:border-[#ccff00] shadow-sm"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    SAC (Decrescente)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSystemType("PRICE")}
                    className={`h-9 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      systemType === "PRICE"
                        ? "bg-emerald-600 dark:bg-[#ccff00] text-white dark:text-black border-emerald-600 dark:border-[#ccff00] shadow-sm"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    PRICE (Fixa)
                  </button>
                </div>
              </div>

              {/* Prazo Caixa */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">
                    Prazo Caixa (Meses)
                  </label>
                  <select
                    value={termMonths}
                    onChange={(e) => setTermMonths(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  >
                    <option value={420} className="bg-card text-foreground">420 meses (35 anos)</option>
                    <option value={360} className="bg-card text-foreground">360 meses (30 anos)</option>
                    <option value={240} className="bg-card text-foreground">240 meses (20 anos)</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">
                    Juros Estimados (% a.a.)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border text-foreground font-mono focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>
              </div>
            </div>

            {/* Configurações da Construtora */}
            <div className="pt-4 border-t border-border space-y-3 text-xs">
              <h3 className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-emerald-600 dark:text-[#ccff00]" />
                Condições de Pagamento da Construtora
              </h3>

              <div className="grid grid-cols-3 gap-2.5">
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

            {/* Dados do Cliente para Proposta */}
            <div className="pt-4 border-t border-border space-y-3 text-xs">
              <h3 className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-600 dark:text-[#ccff00]" />
                Dados do Lead para o PDF
              </h3>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nome do Cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
                <input
                  type="text"
                  placeholder="WhatsApp do Cliente"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
                <input
                  type="text"
                  placeholder="Título do Imóvel"
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Coluna Direita: Resultados Visuais e Cronograma (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 3 Cards de Destaque Superior */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-4 space-y-1 shadow-xs">
              <span className="text-[11px] text-muted-foreground">Financiamento Caixa</span>
              <p className="text-xl font-bold text-foreground font-mono">
                {formatCurrency(simulation.approvedFinancingValue)}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                {Math.round((simulation.approvedFinancingValue / propertyValue) * 100)}% do imóvel
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 space-y-1 shadow-xs">
              <span className="text-[11px] text-muted-foreground">1ª Parcela Estimada</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-[#ccff00] font-mono">
                {formatCurrency(simulation.firstInstallmentCaixa)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {systemType} • {termMonths}x
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 space-y-1 shadow-xs">
              <span className="text-[11px] text-muted-foreground">Gap Entrada Construtora</span>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                {formatCurrency(simulation.downPaymentGap)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                A parcelar em obras
              </p>
            </div>
          </div>

          {/* Gráfico Visual de Composição do Pagamento */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center justify-between">
              <span>Composição da Compra</span>
              <span className="text-xs font-mono text-muted-foreground">
                Total: {formatCurrency(propertyValue)}
              </span>
            </h3>

            {/* Barra empilhada proporcional */}
            <div className="h-6 w-full rounded-full bg-muted flex overflow-hidden p-0.5 gap-1 border border-border">
              <div
                style={{
                  width: `${(simulation.approvedFinancingValue / propertyValue) * 100}%`,
                }}
                className="bg-emerald-600 dark:bg-[#ccff00] rounded-l-full transition-all duration-300"
                title={`Caixa: ${formatCurrency(simulation.approvedFinancingValue)}`}
              />
              {simulation.subsidyValue > 0 && (
                <div
                  style={{
                    width: `${(simulation.subsidyValue / propertyValue) * 100}%`,
                  }}
                  className="bg-cyan-500 transition-all duration-300"
                  title={`Subsídio: ${formatCurrency(simulation.subsidyValue)}`}
                />
              )}
              {simulation.fgtsValue > 0 && (
                <div
                  style={{
                    width: `${(simulation.fgtsValue / propertyValue) * 100}%`,
                  }}
                  className="bg-teal-500 transition-all duration-300"
                  title={`FGTS: ${formatCurrency(simulation.fgtsValue)}`}
                />
              )}
              <div
                style={{
                  width: `${(simulation.downPaymentGap / propertyValue) * 100}%`,
                }}
                className="bg-amber-500 rounded-r-full transition-all duration-300"
                title={`Entrada Construtora: ${formatCurrency(simulation.downPaymentGap)}`}
              />
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-[#ccff00]" />
                <span className="text-foreground">Caixa ({formatCurrency(simulation.approvedFinancingValue)})</span>
              </div>
              {simulation.subsidyValue > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <span className="text-foreground">Subsídio ({formatCurrency(simulation.subsidyValue)})</span>
                </div>
              )}
              {simulation.fgtsValue > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                  <span className="text-foreground">FGTS ({formatCurrency(simulation.fgtsValue)})</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="text-foreground">Entrada Construtora ({formatCurrency(simulation.downPaymentGap)})</span>
              </div>
            </div>
          </Card>

          {/* Cronograma Detalhado da Construtora */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Cronograma Proposto para Construtora
              </h3>
              <Badge variant="outline" className="text-[10px]">
                Correção INCC
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border">
                <div>
                  <p className="font-semibold text-foreground">Sinal / Ato na Assinatura</p>
                  <p className="text-[11px] text-muted-foreground">Entrada imediata ({sinalPercent}%)</p>
                </div>
                <span className="font-mono font-bold text-foreground text-sm">
                  {formatCurrency(simulation.builderPlan.sinal)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border">
                <div>
                  <p className="font-semibold text-foreground">
                    Parcelas Mensais ({simulation.builderPlan.mensais.qtd}x)
                  </p>
                  <p className="text-[11px] text-muted-foreground">Durante o período de obras</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-600 dark:text-[#ccff00] text-sm">
                    {formatCurrency(simulation.builderPlan.mensais.valorUnitario)}
                  </span>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Total: {formatCurrency(simulation.builderPlan.mensais.total)}
                  </p>
                </div>
              </div>

              {simulation.builderPlan.reforcos.qtd > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border">
                  <div>
                    <p className="font-semibold text-foreground">
                      Balões / Reforços ({simulation.builderPlan.reforcos.qtd}x)
                    </p>
                    <p className="text-[11px] text-muted-foreground">Intermediárias semestrais</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                      {formatCurrency(simulation.builderPlan.reforcos.valorUnitario)}
                    </span>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      Total: {formatCurrency(simulation.builderPlan.reforcos.total)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border">
                <div>
                  <p className="font-semibold text-foreground">Parcela na Entrega das Chaves</p>
                  <p className="text-[11px] text-muted-foreground">Expedição do Habite-se</p>
                </div>
                <span className="font-mono font-bold text-foreground text-sm">
                  {formatCurrency(simulation.builderPlan.chaves)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-dashed border-border">
                <div>
                  <p className="font-semibold text-foreground">Despesas Cartorárias (ITBI + Registro)</p>
                  <p className="text-[11px] text-muted-foreground">Estimativa adicional de 4% do imóvel</p>
                </div>
                <span className="font-mono text-muted-foreground text-sm">
                  {formatCurrency(simulation.builderPlan.escrituraEstimada)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <Button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                size="sm"
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Baixar Proposta Oficial em PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
