"use client";

import * as React from "react";
import {
  Scale,
  Plus,
  RotateCcw,
  Printer,
  TrendingUp,
  Sparkles,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Home,
  Check,
  Percent,
  Sliders,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImovelAvaliando, AmostraMercado, PadraoConstrutivo, EstadoConservacao, TipoImovel } from "@/lib/valuation/types";
import { IMOVEL_PADRAO_EXEMPLO, AMOSTRAS_INICIAIS_PLANILHA } from "@/lib/valuation/mock-data";
import { calculateValuation } from "@/lib/valuation/engine";

export default function ValuationPage() {
  // Estado do Imóvel Avaliando
  const [imovel, setImovel] = React.useState<ImovelAvaliando>(IMOVEL_PADRAO_EXEMPLO);

  // Estado das Amostras de Mercado
  const [amostras, setAmostras] = React.useState<
    Array<Omit<AmostraMercado, "valorM2" | "isHomogeneizada" | "motivoDescarte">>
  >(AMOSTRAS_INICIAIS_PLANILHA);

  // Margem de Tolerância Estatística (10%, 15% NBR padrão, 20%)
  const [toleranciaPercent, setToleranciaPercent] = React.useState<number>(15);

  // Aba Ativa
  const [activeTab, setActiveTab] = React.useState<"imovel" | "amostras" | "estatistica" | "vistoria" | "laudo">("imovel");

  // Nome do Avaliador e CRECI
  const [nomeAvaliador, setNomeAvaliador] = React.useState("Duzzi Imóveis - Setor de Avaliações");
  const [creciAvaliador, setCreciAvaliador] = React.useState("CRECI/SC 00000-J | CNAI");
  const [dataParecer, setDataParecer] = React.useState("10/11/2026");

  React.useEffect(() => {
    setDataParecer(new Date().toLocaleDateString("pt-BR"));
  }, []);

  // Cálculo reativo usando o motor estatístico da NBR 14.653
  const { amostrasProcessadas, estatisticas } = React.useMemo(() => {
    return calculateValuation({
      imovel,
      amostras,
      intervaloToleranciaPercent: toleranciaPercent,
    });
  }, [imovel, amostras, toleranciaPercent]);

  // Manipulação de Amostras
  const handleAddSample = () => {
    const nextIndex = amostras.length + 1;
    const newSample: Omit<AmostraMercado, "valorM2" | "isHomogeneizada" | "motivoDescarte"> = {
      id: String(Date.now()),
      codigo: `A.${nextIndex}`,
      proprietarioOuFonte: "Oferta Nova",
      bairro: imovel.bairro || "Centro",
      cidade: imovel.cidade || "Criciúma",
      quartos: 3,
      vagas: 2,
      areaUtilM2: 180,
      valorOferta: 900000,
    };
    setAmostras([...amostras, newSample]);
  };

  const handleUpdateSample = (
    id: string,
    field: keyof Omit<AmostraMercado, "valorM2" | "isHomogeneizada" | "motivoDescarte">,
    value: any
  ) => {
    setAmostras((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveSample = (id: string) => {
    if (amostras.length <= 3) {
      alert("Recomenda-se manter pelo menos 3 amostras para cálculo estatístico.");
      return;
    }
    setAmostras(amostras.filter((a) => a.id !== id));
  };

  const handleResetToDefault = () => {
    if (confirm("Deseja restaurar as 15 amostras e dados de exemplo originais da planilha de Criciúma?")) {
      setImovel(IMOVEL_PADRAO_EXEMPLO);
      setAmostras(AMOSTRAS_INICIAIS_PLANILHA);
      setToleranciaPercent(15);
    }
  };

  const handleClearAll = () => {
    if (confirm("Deseja limpar todos os campos para iniciar uma nova avaliação do zero?")) {
      setImovel({
        ...IMOVEL_PADRAO_EXEMPLO,
        proponente: "",
        cpfProponente: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        matricula: "",
        areaConstruidaM2: 100,
        areaTerrenoM2: 250,
        demaisBenfeitoriasValor: 0,
        fatorApreciacaoPercent: 0,
      });
      setAmostras([
        { id: "1", codigo: "A.1", proprietarioOuFonte: "", bairro: "", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 120, valorOferta: 600000 },
        { id: "2", codigo: "A.2", proprietarioOuFonte: "", bairro: "", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 150, valorOferta: 750000 },
        { id: "3", codigo: "A.3", proprietarioOuFonte: "", bairro: "", cidade: "Criciúma", quartos: 3, vagas: 2, areaUtilM2: 180, valorOferta: 880000 },
      ]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Formatação em Real (BRL)
  const formatBRL = (val: number) => {
    return (val || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
  };

  const formatM2 = (val: number) => {
    return (val || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 print:hidden">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Scale className="h-6 w-6 text-emerald-500 dark:text-[#ccff00]" />
              Avaliação de Imóveis (PTAM)
            </h1>
            <Badge variant="default" className="text-xs bg-emerald-500/10 text-emerald-600 dark:bg-[#ccff00]/10 dark:text-[#ccff00] border-emerald-500/20 dark:border-[#ccff00]/20">
              NBR 14.653
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Método Comparativo Direto de Dados de Mercado com Saneamento Estatístico de Amostras e Formação de Preço Comercial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetToDefault}
            className="text-xs h-9 gap-1.5"
            title="Recarrega as 15 amostras originais da planilha de teste"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Exemplo Planilha
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearAll}
            className="text-xs h-9 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Nova Avaliação
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="text-xs h-9 gap-1.5 bg-[#ccff00] text-black hover:bg-[#b8e600] font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            Imprimir Laudo PTAM
          </Button>
        </div>
      </div>

      {/* STRIP DE KPIS PRINCIPAIS (Painel de Formação de Preço) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        {/* Preço para Fechar (Venda Rápida) */}
        <Card className="border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                Preço para Fechar
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] px-1.5 py-0 border-0">
                Liquidez Rápida
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-foreground mt-1">
              {formatBRL(estatisticas.precoFechamentoSugerido)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground pt-0">
            Base líquida com margem de 5% de desconto para fechamento imediato na mesa.
          </CardContent>
        </Card>

        {/* Preço de Avaliação Técnico (Base Mercadológica) */}
        <Card className="border border-[#ccff00]/40 bg-[#ccff00]/5 dark:bg-[#ccff00]/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#ccff00]/15 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-[#ccff00]" />
                Avaliação Base
              </span>
              <Badge className="bg-[#ccff00] text-black font-semibold text-[10px] px-1.5 py-0 border-0">
                Valor Justo
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-foreground mt-1">
              {formatBRL(estatisticas.valorAvaliacaoBase)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground pt-0 flex items-center justify-between">
            <span>{formatM2(estatisticas.valorM2Apreciado)}/m²</span>
            <span className="font-medium text-foreground">{imovel.areaConstruidaM2} m² úteis</span>
          </CardContent>
        </Card>

        {/* Preço para Anunciar (Preço de Gôndola) */}
        <Card className="border border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <ArrowUpRight className="h-4 w-4 text-blue-500" />
                Preço para Anunciar
              </span>
              <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0 border-0">
                +5% Margem
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-foreground mt-1">
              {formatBRL(estatisticas.precoAnuncioSugerido)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground pt-0">
            Preço sugerido para portal/vitrine com margem sadia de contraproposta.
          </CardContent>
        </Card>

        {/* Amostragem e Saneamento NBR */}
        <Card className="border border-border bg-card/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-emerald-500" />
                Amostragem Válida
              </span>
              <Badge variant="outline" className="text-[10px]">
                ±{toleranciaPercent}% Chauvenet
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-foreground mt-1 flex items-baseline gap-1.5">
              <span>{estatisticas.amostrasValidas}</span>
              <span className="text-sm font-normal text-muted-foreground">de {estatisticas.totalAmostras} coletadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground pt-0 flex items-center justify-between">
            <span>Média MF: {formatM2(estatisticas.mediaFinalSaneadaM2)}</span>
            <span className="text-amber-500 font-medium">{estatisticas.amostrasDescartadas} descartadas</span>
          </CardContent>
        </Card>
      </div>

      {/* NAVEGAÇÃO POR ABAS (Estilo Futurista & Minimalista) */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-2 scrollbar-none print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab("imovel")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "imovel"
              ? "bg-[#ccff00] text-black shadow-sm font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Home className="h-4 w-4" />
          1. Imóvel Avaliando
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("amostras")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "amostras"
              ? "bg-[#ccff00] text-black shadow-sm font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Building2 className="h-4 w-4" />
          2. Amostras de Mercado ({amostras.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("estatistica")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "estatistica"
              ? "bg-[#ccff00] text-black shadow-sm font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Sliders className="h-4 w-4" />
          3. Saneamento Estatístico
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("vistoria")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "vistoria"
              ? "bg-[#ccff00] text-black shadow-sm font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          4. Vistoria & Entorno
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("laudo")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "laudo"
              ? "bg-[#ccff00] text-black shadow-sm font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <FileText className="h-4 w-4" />
          5. Laudo Pericial (PTAM)
        </button>
      </div>

      {/* ============================================================== */}
      {/* ABA 1: IMÓVEL AVALIANDO (O Imóvel que está sendo avaliado)      */}
      {/* ============================================================== */}
      {activeTab === "imovel" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1 & 2: Dados Físicos e Cadastrais */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#ccff00]" />
                  Localização e Identificação do Imóvel
                </CardTitle>
                <CardDescription className="text-xs">
                  Dados cadastrais da unidade para composição do Parecer Técnico.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Solicitante / Proponente
                  </label>
                  <input
                    type="text"
                    value={imovel.proponente}
                    onChange={(e) => setImovel({ ...imovel, proponente: e.target.value })}
                    placeholder="Nome completo do proprietário"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    CPF / CNPJ
                  </label>
                  <input
                    type="text"
                    value={imovel.cpfProponente}
                    onChange={(e) => setImovel({ ...imovel, cpfProponente: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={imovel.endereco}
                    onChange={(e) => setImovel({ ...imovel, endereco: e.target.value })}
                    placeholder="Rua, Avenida, Servidão..."
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Número / Complemento
                  </label>
                  <input
                    type="text"
                    value={imovel.numero}
                    onChange={(e) => setImovel({ ...imovel, numero: e.target.value })}
                    placeholder="Ex: 120 / Casa"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={imovel.bairro}
                    onChange={(e) => setImovel({ ...imovel, bairro: e.target.value })}
                    placeholder="Ex: Jardim Maristela"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={imovel.cidade}
                    onChange={(e) => setImovel({ ...imovel, cidade: e.target.value })}
                    placeholder="Ex: Criciúma"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    UF
                  </label>
                  <input
                    type="text"
                    value={imovel.uf}
                    onChange={(e) => setImovel({ ...imovel, uf: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none uppercase"
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Matrícula Imobiliária
                  </label>
                  <input
                    type="text"
                    value={imovel.matricula}
                    onChange={(e) => setImovel({ ...imovel, matricula: e.target.value })}
                    placeholder="Ex: 45.890"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Cartório de Registro
                  </label>
                  <input
                    type="text"
                    value={imovel.cartorio}
                    onChange={(e) => setImovel({ ...imovel, cartorio: e.target.value })}
                    placeholder="Ex: 1º Ofício de Registro de Imóveis"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Características Construtivas */}
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#ccff00]" />
                  Tipologia e Metragens do Imóvel
                </CardTitle>
                <CardDescription className="text-xs">
                  A área construída privativa é a variável mestra para a multiplicação do valor de metro quadrado.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2 sm:col-span-2">
                  <label className="text-xs font-bold text-foreground mb-1 flex items-center justify-between">
                    <span>Área Útil / Privativa (m²)*</span>
                    <Badge className="bg-[#ccff00] text-black text-[10px]">Chave Principal</Badge>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={imovel.areaConstruidaM2}
                    onChange={(e) => setImovel({ ...imovel, areaConstruidaM2: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 text-base font-bold rounded-md bg-background border-2 border-emerald-500/40 dark:border-[#ccff00]/40 focus:border-[#ccff00] focus:outline-none text-foreground"
                  />
                </div>

                <div className="col-span-2 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Área Total do Terreno (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={imovel.areaTerrenoM2}
                    onChange={(e) => setImovel({ ...imovel, areaTerrenoM2: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Tipo do Imóvel
                  </label>
                  <select
                    value={imovel.tipo}
                    onChange={(e) => setImovel({ ...imovel, tipo: e.target.value as TipoImovel })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="casa">Casa Residencial</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="sobrado">Sobrado</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Padrão Construtivo
                  </label>
                  <select
                    value={imovel.padrao}
                    onChange={(e) => setImovel({ ...imovel, padrao: e.target.value as PadraoConstrutivo })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="minimo">Mínimo / Econômico</option>
                    <option value="baixo">Baixo</option>
                    <option value="medio">Normal / Médio</option>
                    <option value="alto">Alto Padrão</option>
                    <option value="luxo">Luxo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Estado Conservação
                  </label>
                  <select
                    value={imovel.estadoConservacao}
                    onChange={(e) => setImovel({ ...imovel, estadoConservacao: e.target.value as EstadoConservacao })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="novo">Novo / Primeira Ocupação</option>
                    <option value="otimo">Ótimo Estado</option>
                    <option value="bom">Bom Estado</option>
                    <option value="regular">Regular / Usado</option>
                    <option value="reforma">Necessita Reforma</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Idade Aparente (anos)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={imovel.idadeAparenteAnos}
                    onChange={(e) => setImovel({ ...imovel, idadeAparenteAnos: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Dormitórios
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={imovel.quartos}
                    onChange={(e) => setImovel({ ...imovel, quartos: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Suítes
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={imovel.suites}
                    onChange={(e) => setImovel({ ...imovel, suites: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Vagas de Garagem
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={imovel.vagas}
                    onChange={(e) => setImovel({ ...imovel, vagas: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Nº Pavimentos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={imovel.pavimentos}
                    onChange={(e) => setImovel({ ...imovel, pavimentos: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 3: Fatores de Ajuste & Benfeitorias */}
          <div className="space-y-6">
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#ccff00]" />
                  Apreciação & Benfeitorias
                </CardTitle>
                <CardDescription className="text-xs">
                  Fatores de valorização aplicados sobre o m² homogeneizado.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Percent className="h-3.5 w-3.5 text-[#ccff00]" />
                      Fator de Apreciação (%)
                    </label>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted">
                      {imovel.fatorApreciacaoPercent > 0 ? `+${imovel.fatorApreciacaoPercent}%` : `${imovel.fatorApreciacaoPercent}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="30"
                    step="1"
                    value={imovel.fatorApreciacaoPercent}
                    onChange={(e) => setImovel({ ...imovel, fatorApreciacaoPercent: Number(e.target.value) })}
                    className="w-full accent-[#ccff00] cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                    Na planilha modelo foi utilizado <strong>+15%</strong> devido ao padrão de acabamento, insolação e estado de conservação superior à média dos usados.
                  </p>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Demais Benfeitorias Não Computadas no m² (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={imovel.demaisBenfeitoriasValor}
                    onChange={(e) => setImovel({ ...imovel, demaisBenfeitoriasValor: Number(e.target.value) || 0 })}
                    placeholder="Ex: 50.000 (Piscina, Energia Solar)"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Itens que agregam valor fechado além da estrutura bruta.
                  </p>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Fatores Valorizantes Notáveis
                  </label>
                  <input
                    type="text"
                    value={imovel.fatoresValorizantes}
                    onChange={(e) => setImovel({ ...imovel, fatoresValorizantes: e.target.value })}
                    placeholder="Ex: Vista para o parque, rua tranquila"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resumo Rápido da Unidade */}
            <Card className="border border-border bg-muted/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Média das Amostras Saneadas (MF):</span>
                  <span className="font-semibold">{formatM2(estatisticas.mediaFinalSaneadaM2)}/m²</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Fator de Apreciação:</span>
                  <span className="font-semibold text-emerald-500">+{imovel.fatorApreciacaoPercent}%</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-border pt-2 font-bold text-foreground">
                  <span>Valor Viável do m² Calculado:</span>
                  <span className="text-[#ccff00]">{formatM2(estatisticas.valorM2Apreciado)}/m²</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-border pt-2 font-bold text-foreground">
                  <span>Valor de Avaliação do Imóvel:</span>
                  <span>{formatBRL(estatisticas.valorAvaliacaoBase)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 2: AMOSTRAS DE MERCADO (Tabela Interativa dos Comparáveis)   */}
      {/* ============================================================== */}
      {activeTab === "amostras" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 p-4 rounded-xl border border-border">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#ccff00]" />
                Banco de Amostras de Mercado (Método Comparativo)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Imóveis ofertados ou transacionados na mesma microrregião ({imovel.cidade || "Criciúma"}). A NBR 14.653 recomenda no mínimo 5 a 12 amostras confiáveis.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleAddSample}
                className="text-xs h-8 gap-1 bg-[#ccff00] text-black hover:bg-[#b8e600] font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                Nova Amostra
              </Button>
            </div>
          </div>

          {/* Tabela de Amostras */}
          <div className="border border-border rounded-xl overflow-hidden bg-card/60 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Cód</th>
                    <th className="py-2.5 px-3 font-semibold">Fonte / Proprietário</th>
                    <th className="py-2.5 px-3 font-semibold">Bairro</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Dorm</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Vagas</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Área Útil</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Valor Oferta (R$)</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Valor R$/m²</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Status NBR</th>
                    <th className="py-2.5 px-2 text-center w-10">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {amostrasProcessadas.map((item) => (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        item.isHomogeneizada
                          ? "bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-950/10"
                          : "bg-red-500/5 hover:bg-red-500/10 dark:bg-red-950/10 opacity-75"
                      }`}
                    >
                      <td className="py-2 px-3 font-mono font-bold text-foreground">
                        {item.codigo}
                      </td>

                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.proprietarioOuFonte}
                          onChange={(e) => handleUpdateSample(item.id, "proprietarioOuFonte", e.target.value)}
                          placeholder="Ex: Imobiliária X"
                          className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-[#ccff00] focus:outline-none px-1 py-0.5 text-xs text-foreground"
                        />
                      </td>

                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.bairro}
                          onChange={(e) => handleUpdateSample(item.id, "bairro", e.target.value)}
                          placeholder="Bairro"
                          className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-[#ccff00] focus:outline-none px-1 py-0.5 text-xs text-foreground"
                        />
                      </td>

                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          value={item.quartos}
                          onChange={(e) => handleUpdateSample(item.id, "quartos", Number(e.target.value) || 0)}
                          className="w-12 text-center bg-transparent border-b border-transparent hover:border-border focus:border-[#ccff00] focus:outline-none px-1 py-0.5 text-xs text-foreground"
                        />
                      </td>

                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          value={item.vagas}
                          onChange={(e) => handleUpdateSample(item.id, "vagas", Number(e.target.value) || 0)}
                          className="w-12 text-center bg-transparent border-b border-transparent hover:border-border focus:border-[#ccff00] focus:outline-none px-1 py-0.5 text-xs text-foreground"
                        />
                      </td>

                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          min="1"
                          value={item.areaUtilM2}
                          onChange={(e) => handleUpdateSample(item.id, "areaUtilM2", Number(e.target.value) || 1)}
                          className="w-20 text-right bg-transparent border-b border-transparent hover:border-border focus:border-[#ccff00] focus:outline-none px-1 py-0.5 text-xs font-semibold text-foreground"
                        />
                        <span className="text-[10px] text-muted-foreground ml-1">m²</span>
                      </td>

                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          min="1000"
                          step="10000"
                          value={item.valorOferta}
                          onChange={(e) => handleUpdateSample(item.id, "valorOferta", Number(e.target.value) || 0)}
                          className="w-28 text-right bg-transparent border-b border-transparent hover:border-border focus:border-[#ccff00] focus:outline-none px-1 py-0.5 text-xs font-bold text-foreground"
                        />
                      </td>

                      <td className="py-2 px-3 text-right font-mono font-bold text-foreground whitespace-nowrap">
                        {formatM2(item.valorM2)}
                      </td>

                      <td className="py-2 px-3 text-center">
                        {item.isHomogeneizada ? (
                          <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] gap-1 px-2 py-0.5">
                            <Check className="h-3 w-3" />
                            Válida NBR
                          </Badge>
                        ) : (
                          <Badge
                            variant="danger"
                            className="text-[10px] gap-1 px-2 py-0.5 bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30"
                            title={
                              item.motivoDescarte === "ACIMA_TETO"
                                ? `Outlier Superior (> ${formatM2(estatisticas.limiteSuperiorM2)})`
                                : `Outlier Inferior (< ${formatM2(estatisticas.limiteInferiorM2)})`
                            }
                          >
                            <AlertCircle className="h-3 w-3" />
                            {item.motivoDescarte === "ACIMA_TETO" ? "Descarte > Teto" : "Descarte < Piso"}
                          </Badge>
                        )}
                      </td>

                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSample(item.id)}
                          className="text-muted-foreground hover:text-red-500 p-1 rounded transition-colors"
                          title="Remover amostra"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rodapé explicativo do saneamento */}
            <div className="p-3 bg-muted/40 border-t border-border flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {estatisticas.amostrasValidas} Amostras Homogeneizadas
                </span>
                <span className="flex items-center gap-1.5 text-red-500 font-medium">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {estatisticas.amostrasDescartadas} Outliers Descartados
                </span>
              </div>
              <div className="text-[11px]">
                Intervalo Permitido: <strong>{formatM2(estatisticas.limiteInferiorM2)}</strong> até <strong>{formatM2(estatisticas.limiteSuperiorM2)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 3: SANEAMENTO ESTATÍSTICO (Motor Matemático NBR 14.653)     */}
      {/* ============================================================== */}
      {activeTab === "estatistica" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bloco 1: Determinação da Média Aritmética (MA) */}
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit text-[10px]">Passo 1</Badge>
                <CardTitle className="text-base font-bold text-foreground">
                  Média Aritmética Bruta (MA)
                </CardTitle>
                <CardDescription className="text-xs">
                  Soma de todos os m² dividida pelo total de dados coletados.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="p-3 rounded-lg bg-muted/50 font-mono text-xs space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Soma m² ({estatisticas.totalAmostras} amostras):</span>
                    <span>{formatM2(estatisticas.somaM2TodasAmostras)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Divisor (n):</span>
                    <span>{estatisticas.totalAmostras}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1 font-bold text-foreground text-sm">
                    <span>MA =</span>
                    <span className="text-[#ccff00]">{formatM2(estatisticas.mediaAritmeticaBrutaM2)}/m²</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Reflete o valor médio bruto de todas as ofertas do bairro sem qualquer filtro de discrepância.
                </p>
              </CardContent>
            </Card>

            {/* Bloco 2: Campo de Arbítrio / Intervalo de Saneamento */}
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit text-[10px]">Passo 2</Badge>
                <CardTitle className="text-base font-bold text-foreground">
                  Saneamento Amostral (NBR 14.653)
                </CardTitle>
                <CardDescription className="text-xs">
                  Eliminação de dados atípicos e discrepantes do mercado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Tolerância de Desvio:</span>
                  <div className="flex gap-1">
                    {[10, 15, 20].map((tol) => (
                      <button
                        key={tol}
                        type="button"
                        onClick={() => setToleranciaPercent(tol)}
                        className={`px-2 py-0.5 text-xs rounded font-bold cursor-pointer transition-colors ${
                          toleranciaPercent === tol
                            ? "bg-[#ccff00] text-black"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        ±{tol}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 font-mono text-xs space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Limite Superior (+{toleranciaPercent}%):</span>
                    <span className="text-red-400 font-bold">{formatM2(estatisticas.limiteSuperiorM2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Média Central (MA):</span>
                    <span>{formatM2(estatisticas.mediaAritmeticaBrutaM2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Limite Inferior (-{toleranciaPercent}%):</span>
                    <span className="text-amber-400 font-bold">{formatM2(estatisticas.limiteInferiorM2)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Conforme a norma, amostras fora deste intervalo são excluídas para evitar distorções de preços especulativos ou subavaliados.
                </p>
              </CardContent>
            </Card>

            {/* Bloco 3: Média Final Saneada (MF) */}
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit text-[10px]">Passo 3</Badge>
                <CardTitle className="text-base font-bold text-foreground">
                  Média Final Saneada (MF)
                </CardTitle>
                <CardDescription className="text-xs">
                  Recálculo do m² utilizando somente as amostras homogeneizadas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="p-3 rounded-lg bg-muted/50 font-mono text-xs space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Soma m² Válidos:</span>
                    <span>{formatM2(estatisticas.somaM2AmostrasValidas)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Amostras Restantes:</span>
                    <span>{estatisticas.amostrasValidas} unidades</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1 font-bold text-foreground text-sm">
                    <span>MF =</span>
                    <span className="text-emerald-400">{formatM2(estatisticas.mediaFinalSaneadaM2)}/m²</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Valor Viável com +{imovel.fatorApreciacaoPercent}%:</span>
                    <span className="text-[#ccff00] font-bold">{formatM2(estatisticas.valorM2Apreciado)}/m²</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico Visual de Dispersão das Amostras */}
          <Card className="border border-border bg-card/60">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#ccff00]" />
                  Dispersão das Amostras e Linhas de Corte
                </span>
                <Badge variant="outline" className="text-xs">
                  Intervalo Normativo: {formatM2(estatisticas.limiteInferiorM2)} ~ {formatM2(estatisticas.limiteSuperiorM2)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                {amostrasProcessadas.map((item) => {
                  const maxChart = Math.max(
                    ...amostrasProcessadas.map((a) => a.valorM2),
                    estatisticas.limiteSuperiorM2 * 1.1
                  );
                  const barWidthPercent = Math.min(100, Math.max(5, (item.valorM2 / maxChart) * 100));

                  return (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <span className="font-mono w-8 font-bold text-foreground">{item.codigo}</span>
                      <span className="w-28 truncate text-muted-foreground">{item.proprietarioOuFonte}</span>
                      
                      <div className="flex-1 bg-muted/40 h-5 rounded-md overflow-hidden relative flex items-center">
                        <div
                          className={`h-full transition-all duration-300 rounded ${
                            item.isHomogeneizada
                              ? "bg-emerald-500/70 dark:bg-[#ccff00]/70"
                              : "bg-red-500/40"
                          }`}
                          style={{ width: `${barWidthPercent}%` }}
                        />
                        <span className="absolute right-2 font-mono text-[10px] font-bold text-foreground">
                          {formatM2(item.valorM2)}
                        </span>
                      </div>

                      <div className="w-24 text-right">
                        {item.isHomogeneizada ? (
                          <span className="text-emerald-500 font-semibold text-[11px]">Válida</span>
                        ) : (
                          <span className="text-red-400 font-semibold text-[11px]">
                            {item.motivoDescarte === "ACIMA_TETO" ? "Acima" : "Abaixo"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 4: VISTORIA E ENTORNO (Checklist Normativo da Vistoria)     */}
      {/* ============================================================== */}
      {activeTab === "vistoria" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Infraestrutura Urbana e Serviços */}
          <Card className="border border-border bg-card/60">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
                Infraestrutura Urbana da Microrregião
              </CardTitle>
              <CardDescription className="text-xs">
                Serviços públicos e equipamentos urbanos disponíveis na via pública.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[
                { label: "Rede de Água Potável", key: "temAguaPotavel" },
                { label: "Rede de Energia Elétrica", key: "temEnergiaEletrica" },
                { label: "Rede Coletora de Esgoto", key: "temEsgoto" },
                { label: "Pavimentação Asfáltica / Lajotas", key: "temPavimentacao" },
                { label: "Iluminação Pública na Via", key: "temIluminacaoPublica" },
                { label: "Gás Canalizado", key: "temGasCanalizado" },
                { label: "Comércio Local Próximo", key: "temComercioProximo" },
                { label: "Escolas e Creches", key: "temEscolasProximas" },
                { label: "Transporte Coletivo Regular", key: "temTransporteColetivo" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer text-xs"
                >
                  <span className="font-medium text-foreground">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(imovel[item.key as keyof ImovelAvaliando])}
                    onChange={(e) => setImovel({ ...imovel, [item.key]: e.target.checked })}
                    className="h-4 w-4 accent-[#ccff00] rounded cursor-pointer"
                  />
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Vistoria Técnica e Condições Físicas */}
          <Card className="border border-border bg-card/60">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Scale className="h-4 w-4 text-[#ccff00]" />
                Condições Estruturais e Vícios Construtivos
              </CardTitle>
              <CardDescription className="text-xs">
                Parecer de vistoria física conforme exigências normativas da ABNT.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="p-3 rounded-lg bg-muted/40 space-y-2">
                <span className="text-xs font-semibold text-foreground block">
                  Condições de Estabilidade e Solidez:
                </span>
                <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  SIM. Imóvel apresenta perfeitas condições estruturais e de habitabilidade.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Apresenta vícios construtivos aparentes?
                  </span>
                  <input
                    type="checkbox"
                    checked={imovel.temViciosConstrucao}
                    onChange={(e) => setImovel({ ...imovel, temViciosConstrucao: e.target.checked })}
                    className="h-4 w-4 accent-red-500 rounded cursor-pointer"
                  />
                </div>
                {imovel.temViciosConstrucao ? (
                  <textarea
                    rows={2}
                    value={imovel.descricaoVicios}
                    onChange={(e) => setImovel({ ...imovel, descricaoVicios: e.target.value })}
                    placeholder="Descreva as patologias, trincas, infiltrações encontradas na vistoria..."
                    className="w-full mt-2 p-2 text-xs rounded bg-background border border-border focus:border-red-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Nenhum vício aparente observado no momento da vistoria técnica.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Fatores Depreciativos no Entorno (se houver)
                </label>
                <input
                  type="text"
                  value={imovel.fatoresDepreciativos}
                  onChange={(e) => setImovel({ ...imovel, fatoresDepreciativos: e.target.value })}
                  placeholder="Ex: Córregos, linhas de alta tensão, etc."
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 5: LAUDO PERICIAL PTAM (Layout Formal para Impressão/PDF)    */}
      {/* ============================================================== */}
      {activeTab === "laudo" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-muted/40 p-4 rounded-xl border border-border print:hidden">
            <div>
              <h3 className="text-sm font-bold text-foreground">Visualização do Parecer Técnico de Avaliação Mercadológica (PTAM)</h3>
              <p className="text-xs text-muted-foreground">
                Documento oficial pronto para impressão ou salvamento em PDF para apresentação ao proprietário ou anexação processual.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handlePrint}
              className="text-xs h-8 gap-1.5 bg-[#ccff00] text-black hover:bg-[#b8e600] font-semibold"
            >
              <Printer className="h-3.5 w-3.5" />
              Imprimir / Salvar PDF
            </Button>
          </div>

          {/* O LAUDO TÉCNICO FORMAL */}
          <div className="bg-card border border-border rounded-xl p-8 max-w-4xl mx-auto shadow-sm print:border-none print:shadow-none print:p-0 space-y-6 text-foreground">
            {/* Cabeçalho do Laudo */}
            <div className="border-b-2 border-foreground pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                  Parecer Técnico de Avaliação Mercadológica (PTAM)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Método Comparativo Direto de Dados de Mercado — NBR 14.653-2
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold block">DUZZIMOB</span>
                <span className="text-[11px] text-muted-foreground">Data: {dataParecer}</span>
              </div>
            </div>

            {/* Identificação do Imóvel e Proponente */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">1. Solicitante / Proponente</span>
                <p className="font-semibold text-foreground text-sm">{imovel.proponente || "Não informado"}</p>
                <p className="text-muted-foreground">CPF/CNPJ: {imovel.cpfProponente || "Não informado"}</p>
                <p className="text-muted-foreground">Finalidade: {imovel.objetivo}</p>
              </div>

              <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">2. Identificação do Imóvel</span>
                <p className="font-semibold text-foreground text-sm">
                  {imovel.endereco}, {imovel.numero} {imovel.complemento && `(${imovel.complemento})`}
                </p>
                <p className="text-muted-foreground">
                  Bairro: {imovel.bairro} — {imovel.cidade}/{imovel.uf}
                </p>
                <p className="text-muted-foreground">Matrícula: {imovel.matricula || "Em regularização"}</p>
              </div>
            </div>

            {/* Resumo Físico */}
            <div className="border border-border rounded-lg p-4 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/10">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Área Construída</span>
                <span className="font-bold text-foreground text-sm">{imovel.areaConstruidaM2} m²</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Área Terreno</span>
                <span className="font-bold text-foreground text-sm">{imovel.areaTerrenoM2} m²</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Tipologia</span>
                <span className="font-bold text-foreground capitalize text-sm">{imovel.tipo}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Conservação / Padrão</span>
                <span className="font-bold text-foreground capitalize text-sm">{imovel.padrao} ({imovel.estadoConservacao})</span>
              </div>
            </div>

            {/* Memória Estatística Resumida */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground border-b border-border pb-1">
                3. Síntese do Tratamento Amostral de Mercado (NBR 14.653)
              </h4>
              <div className="text-xs space-y-2 leading-relaxed">
                <p>
                  Foram coletadas <strong>{estatisticas.totalAmostras} amostras</strong> de imóveis comparáveis ofertados na microrregião de {imovel.cidade}.
                  Após aplicação do saneamento estatístico por campo de arbítrio (intervalo de confiança de ±{toleranciaPercent}%), restaram{" "}
                  <strong>{estatisticas.amostrasValidas} amostras válidas</strong> devidamente homogeneizadas.
                </p>
                
                <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/30 border border-border font-mono text-center">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Média Amostral (MF)</span>
                    <span className="font-bold text-foreground">{formatM2(estatisticas.mediaFinalSaneadaM2)}/m²</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Fator de Apreciação</span>
                    <span className="font-bold text-emerald-500">+{imovel.fatorApreciacaoPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Valor Viável do m²</span>
                    <span className="font-bold text-foreground text-sm">{formatM2(estatisticas.valorM2Apreciado)}/m²</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conclusão de Valor Comercial */}
            <div className="p-6 rounded-xl bg-muted/40 border-2 border-foreground/30 space-y-4">
              <h4 className="text-sm font-black uppercase text-foreground tracking-tight text-center">
                4. Conclusão de Valores Comerciais Recomendados
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-card border border-emerald-500/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                    Preço para Fechamento Rápido
                  </span>
                  <span className="text-lg font-black text-foreground block mt-1">
                    {formatBRL(estatisticas.precoFechamentoSugerido)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Margem de 5% p/ fechar</span>
                </div>

                <div className="p-4 rounded-lg bg-card border-2 border-[#ccff00] text-center shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-[#ccff00] block">
                    Valor Técnico de Avaliação
                  </span>
                  <span className="text-xl font-black text-foreground block mt-1">
                    {formatBRL(estatisticas.valorAvaliacaoBase)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Valor de Mercado Justo</span>
                </div>

                <div className="p-3 rounded-lg bg-card border border-blue-500/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 block">
                    Preço para Anúncio
                  </span>
                  <span className="text-lg font-black text-foreground block mt-1">
                    {formatBRL(estatisticas.precoAnuncioSugerido)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Com margem de negociação</span>
                </div>
              </div>
            </div>

            {/* Assinatura do Avaliador */}
            <div className="pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs">
              <div>
                <input
                  type="text"
                  value={nomeAvaliador}
                  onChange={(e) => setNomeAvaliador(e.target.value)}
                  className="font-bold text-foreground bg-transparent border-b border-border/50 text-sm focus:outline-none"
                />
                <input
                  type="text"
                  value={creciAvaliador}
                  onChange={(e) => setCreciAvaliador(e.target.value)}
                  className="text-muted-foreground text-xs bg-transparent border-b border-border/50 block mt-0.5 focus:outline-none"
                />
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold block text-foreground">DUZZIMOB Gestão Imobiliária</span>
                <span className="text-[10px] text-muted-foreground">Parecer emitido em conformidade com o COFECI / ABNT</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
