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
  ShieldCheck,
  Layers,
  Building,
  Award,
  Calendar,
  UserCheck,
  Briefcase,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ImovelAvaliando,
  AmostraMercado,
  PadraoConstrutivo,
  EstadoConservacao,
  TipoImovel,
  TopografiaTerreno,
  CotaGreide,
  SuperficieTerreno,
  FormatoTerreno,
  SituacaoQuadra,
  DisposicaoEdificacao,
  PosicaoEdificacao,
  SituacaoOcupacao,
  FechamentoParede,
  TipoEsquadrias,
  RevestimentoFachada,
  GrauFundamentacao,
  GrauPrecisao,
} from "@/lib/valuation/types";
import { IMOVEL_PADRAO_EXEMPLO, AMOSTRAS_INICIAIS_PLANILHA } from "@/lib/valuation/mock-data";
import { calculateValuation } from "@/lib/valuation/engine";

export default function ValuationPage() {
  // Estado do Imóvel Avaliando (estruturado conforme normas do COFECI / ABNT)
  const [imovel, setImovel] = React.useState<ImovelAvaliando>(IMOVEL_PADRAO_EXEMPLO);

  // Amostras Coletadas no Mercado
  const [amostras, setAmostras] = React.useState<
    Array<Omit<AmostraMercado, "valorM2" | "isHomogeneizada" | "motivoDescarte">>
  >(AMOSTRAS_INICIAIS_PLANILHA);

  // Campo de Arbítrio / Intervalo de Saneamento da NBR 14.653
  const [toleranciaPercent, setToleranciaPercent] = React.useState<number>(15);

  // Navegação do Módulo Pericial
  const [activeTab, setActiveTab] = React.useState<
    "imovel" | "bairro_condo" | "amostras" | "estatistica" | "vistoria" | "laudo"
  >("imovel");

  // Data formatada para apresentação
  const [dataParecerFormatada, setDataParecerFormatada] = React.useState("21/09/2022");

  React.useEffect(() => {
    if (imovel.dataParecer) {
      const parts = imovel.dataParecer.split("-");
      if (parts.length === 3) {
        setDataParecerFormatada(`${parts[2]}/${parts[1]}/${parts[0]}`);
        return;
      }
    }
    setDataParecerFormatada(new Date().toLocaleDateString("pt-BR"));
  }, [imovel.dataParecer]);

  // Motor Estatístico de Engenharia de Avaliações (NBR 14.653)
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
      proprietarioOuFonte: "Nova Oferta Coletada",
      bairro: imovel.bairro || "Centro",
      cidade: imovel.cidade || "Criciúma",
      quartos: 3,
      vagas: 2,
      areaUtilM2: 180,
      valorOferta: 900000,
      anotacoes: "Imóvel comparável na mesma microrregião",
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
      alert("A norma técnica ABNT NBR 14.653 exige no mínimo 3 a 5 amostras para manter a fundamentação pericial.");
      return;
    }
    setAmostras(amostras.filter((a) => a.id !== id));
  };

  const handleLoadReferenceStudy = () => {
    if (confirm("Deseja carregar o estudo de caso completo com 15 amostras e laudo de vistoria técnica?")) {
      setImovel(IMOVEL_PADRAO_EXEMPLO);
      setAmostras(AMOSTRAS_INICIAIS_PLANILHA);
      setToleranciaPercent(15);
    }
  };

  const handleClearAll = () => {
    if (confirm("Deseja iniciar um novo laudo de avaliação em branco?")) {
      setImovel({
        ...IMOVEL_PADRAO_EXEMPLO,
        proponente: "",
        cpfProponente: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        matricula: "",
        cartorio: "",
        areaConstruidaM2: 120,
        areaTerrenoM2: 300,
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
      {/* Top Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 print:hidden">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Scale className="h-6 w-6 text-emerald-500 dark:text-[#ccff00]" />
              Parecer Técnico de Avaliação Mercadológica (PTAM)
            </h1>
            <Badge variant="default" className="text-xs bg-emerald-500/10 text-emerald-600 dark:bg-[#ccff00]/10 dark:text-[#ccff00] border-emerald-500/20 dark:border-[#ccff00]/20 font-bold">
              ABNT NBR 14.653-2
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Sistema pericial de engenharia de avaliações em conformidade com a Resolução COFECI nº 1.066/2007.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleLoadReferenceStudy}
            className="text-xs h-9 gap-1.5"
            title="Carrega um caso de avaliação completo com 15 amostras e vistoria"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Exemplo de Avaliação
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearAll}
            className="text-xs h-9 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo Laudo
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="text-xs h-9 gap-1.5 bg-[#ccff00] text-black hover:bg-[#b8e600] font-bold shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            Emitir Laudo Pericial (PDF)
          </Button>
        </div>
      </div>

      {/* STRIP DE KPIS PRINCIPAIS (Painel de Valores Conclusivos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        {/* Preço para Fechar (Venda Rápida / Liquidação Justa) */}
        <Card className="border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                Fechamento Rápido
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] px-1.5 py-0 border-0">
                Alta Liquidez
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-foreground mt-1">
              {formatBRL(estatisticas.precoFechamentoSugerido)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground pt-0">
            Margem sadia (-5%) para fechamento em até 30 a 60 dias sem desvalorizar o bem.
          </CardContent>
        </Card>

        {/* Preço de Avaliação Técnico (Valor de Mercado Médio) */}
        <Card className="border border-[#ccff00]/40 bg-[#ccff00]/5 dark:bg-[#ccff00]/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#ccff00]/15 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-[#ccff00]" />
                Valor Técnico Pericial
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
            <span className="font-medium text-foreground">{imovel.areaConstruidaM2} m² privativos</span>
          </CardContent>
        </Card>

        {/* Preço para Anunciar (Preço de Gôndola) */}
        <Card className="border border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <ArrowUpRight className="h-4 w-4 text-blue-500" />
                Preço de Anúncio
              </span>
              <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0 border-0">
                Com Margem
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-foreground mt-1">
              {formatBRL(estatisticas.precoAnuncioSugerido)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground pt-0">
            Valor de posicionamento em portais e vitrine com margem de negociação na mesa.
          </CardContent>
        </Card>

        {/* Amostragem e Saneamento NBR */}
        <Card className="border border-border bg-card/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Conformidade Amostral
              </span>
              <Badge variant="outline" className="text-[10px]">
                ±{toleranciaPercent}% Campo de Arbítrio
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-foreground mt-1 flex items-baseline gap-1.5">
              <span>{estatisticas.amostrasValidas}</span>
              <span className="text-sm font-normal text-muted-foreground">de {estatisticas.totalAmostras} comparáveis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground pt-0 flex items-center justify-between">
            <span>MF Homog.: {formatM2(estatisticas.mediaFinalSaneadaM2)}</span>
            <span className="text-amber-500 font-medium">{estatisticas.amostrasDescartadas} dados atípicos</span>
          </CardContent>
        </Card>
      </div>

      {/* NAVEGAÇÃO DO MÓDULO PERICIAL */}
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
          1. Identificação & Terreno
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bairro_condo")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "bairro_condo"
              ? "bg-[#ccff00] text-black shadow-sm font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Building className="h-4 w-4" />
          2. Região & Infraestrutura
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
          3. Pesquisa Amostral ({amostras.length})
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
          4. Diagnóstico Estatístico NBR
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
          5. Vistoria & Diagnóstico
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
          6. Parecer Conclusivo (PTAM)
        </button>
      </div>

      {/* ============================================================== */}
      {/* ABA 1: IDENTIFICAÇÃO DO BEM E CARACTERIZAÇÃO DO TERRENO        */}
      {/* ============================================================== */}
      {activeTab === "imovel" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* 1 & 2. Solicitante e Identificação do Bem */}
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#ccff00]" />
                  Identificação do Solicitante e Registro Imobiliário
                </CardTitle>
                <CardDescription className="text-xs">
                  Qualificação do proponente, finalidade avaliatória e dados de registro em cartório.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Solicitante / Proprietário do Bem
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

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Finalidade da Avaliação
                  </label>
                  <input
                    type="text"
                    value={imovel.objetivo}
                    onChange={(e) => setImovel({ ...imovel, objetivo: e.target.value })}
                    placeholder="Ex: Determinação de Valor de Mercado para Alienação"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Logradouro / Endereço
                  </label>
                  <input
                    type="text"
                    value={imovel.endereco}
                    onChange={(e) => setImovel({ ...imovel, endereco: e.target.value })}
                    placeholder="Rua, avenida, praça..."
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
                    Município
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
                    Matrícula Imobiliária nº
                  </label>
                  <input
                    type="text"
                    value={imovel.matricula}
                    onChange={(e) => setImovel({ ...imovel, matricula: e.target.value })}
                    placeholder="Ex: 12.345"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Cartório de Registro
                  </label>
                  <input
                    type="text"
                    value={imovel.cartorio}
                    onChange={(e) => setImovel({ ...imovel, cartorio: e.target.value })}
                    placeholder="Ex: 1º Ofício RI"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Data da Certidão de Matrícula
                  </label>
                  <input
                    type="date"
                    value={imovel.dataEmissaoMatricula}
                    onChange={(e) => setImovel({ ...imovel, dataEmissaoMatricula: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Geometria e Caracterização do Terreno */}
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#ccff00]" />
                  Caracterização do Terreno e Geometria do Lote
                </CardTitle>
                <CardDescription className="text-xs">
                  Dimensões periciais, testada, cota greide, formato geométrico e relevo.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Área Total Terreno (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={imovel.areaTerrenoM2}
                    onChange={(e) => setImovel({ ...imovel, areaTerrenoM2: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Testada Principal (m)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={imovel.testadaMetros}
                    onChange={(e) => setImovel({ ...imovel, testadaMetros: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Nº de Frentes
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={imovel.numFrentes}
                    onChange={(e) => setImovel({ ...imovel, numFrentes: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Posição na Quadra
                  </label>
                  <select
                    value={imovel.situacaoQuadra}
                    onChange={(e) => setImovel({ ...imovel, situacaoQuadra: e.target.value as SituacaoQuadra })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="meio_quadra">Meio de Quadra</option>
                    <option value="esquina">Esquina</option>
                    <option value="fundo">Fundos</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Topografia
                  </label>
                  <select
                    value={imovel.topografia}
                    onChange={(e) => setImovel({ ...imovel, topografia: e.target.value as TopografiaTerreno })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="plano">Plano</option>
                    <option value="aclive">Aclive</option>
                    <option value="declive">Declive</option>
                    <option value="irregular">Irregular</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Cota Greide
                  </label>
                  <select
                    value={imovel.cotaGreide}
                    onChange={(e) => setImovel({ ...imovel, cotaGreide: e.target.value as CotaGreide })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="mesmo_nivel">Mesmo Nível do Logradouro</option>
                    <option value="aclive_10">Aclive 10%</option>
                    <option value="declive_10">Declive 10%</option>
                    <option value="acima">Acima do Nível</option>
                    <option value="abaixo">Abaixo do Nível</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Condição do Solo / Superfície
                  </label>
                  <select
                    value={imovel.superficieTerreno}
                    onChange={(e) => setImovel({ ...imovel, superficieTerreno: e.target.value as SuperficieTerreno })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="seco">Seco / Firme</option>
                    <option value="brejo">Brejo / Úmido</option>
                    <option value="alagavel">Sujeito a Alagamento</option>
                    <option value="outra">Outra</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Formato Perimetral
                  </label>
                  <select
                    value={imovel.formatoTerreno}
                    onChange={(e) => setImovel({ ...imovel, formatoTerreno: e.target.value as FormatoTerreno })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="regular">Regular (Retangular/Poligonal)</option>
                    <option value="irregular">Irregular</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Descrição Detalhada da Unidade Avalianda */}
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#ccff00]" />
                  Descrição Física da Edificação e Acabamentos
                </CardTitle>
                <CardDescription className="text-xs">
                  Tipologia construtiva, distribuição de cômodos, fechamentos estruturais e padrão.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-foreground mb-1 flex items-center justify-between">
                    <span>Área Construída Privativa (m²)*</span>
                    <Badge className="bg-[#ccff00] text-black text-[10px]">Variável Mestra</Badge>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={imovel.areaConstruidaM2}
                    onChange={(e) => setImovel({ ...imovel, areaConstruidaM2: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 text-base font-bold rounded-md bg-background border-2 border-emerald-500/40 dark:border-[#ccff00]/40 focus:border-[#ccff00] focus:outline-none text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Tipologia
                  </label>
                  <select
                    value={imovel.tipo}
                    onChange={(e) => setImovel({ ...imovel, tipo: e.target.value as TipoImovel })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="casa">Casa Unifamiliar</option>
                    <option value="apartamento">Apartamento Padrão</option>
                    <option value="sobrado">Sobrado</option>
                    <option value="duplex">Duplex</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="loft">Loft</option>
                    <option value="kitnet">Kitnet / Studio</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Disposição no Lote
                  </label>
                  <select
                    value={imovel.disposicaoEdificacao}
                    onChange={(e) => setImovel({ ...imovel, disposicaoEdificacao: e.target.value as DisposicaoEdificacao })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="convencional">Convencional</option>
                    <option value="isolada_centro">Isolada no Centro do Terreno</option>
                    <option value="isolada_frente">Isolada na Frente do Terreno</option>
                    <option value="geminada_lateral">Geminada em uma Lateral</option>
                    <option value="geminada_laterais">Geminada em Ambas as Laterais</option>
                    <option value="junto_fundos">Junto aos Fundos</option>
                    <option value="ocupa_todo_terreno">Ocupa Todo o Terreno</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Posicionamento Solar / Fachada
                  </label>
                  <select
                    value={imovel.posicaoEdificacao}
                    onChange={(e) => setImovel({ ...imovel, posicaoEdificacao: e.target.value as PosicaoEdificacao })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="frente">Frente para Via Pública</option>
                    <option value="frente_canto">Frente / Canto</option>
                    <option value="meio">Meio / Centro</option>
                    <option value="fundos">Fundos</option>
                    <option value="fundos_canto">Fundos / Canto</option>
                    <option value="lateral">Lateral</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Regime de Ocupação
                  </label>
                  <select
                    value={imovel.ocupacao}
                    onChange={(e) => setImovel({ ...imovel, ocupacao: e.target.value as SituacaoOcupacao })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="ocupado_proprietario">Ocupado pelo Proprietário</option>
                    <option value="desocupado">Desocupado / Vago</option>
                    <option value="locado_arrendado">Locado a Terceiros</option>
                    <option value="cedido_comodato">Cedido / Comodato</option>
                    <option value="invadido">Invadido</option>
                    <option value="em_implantacao">Em Implantação</option>
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
                    Nº Pavimentos da Unidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={imovel.pavimentos}
                    onChange={(e) => setImovel({ ...imovel, pavimentos: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Dormitórios (sem suíte)
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
                    Banheiros Sociais
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={imovel.banheirosSociais}
                    onChange={(e) => setImovel({ ...imovel, banheirosSociais: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Lavabos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={imovel.lavabos}
                    onChange={(e) => setImovel({ ...imovel, lavabos: Number(e.target.value) || 0 })}
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
                    Padrão de Acabamento
                  </label>
                  <select
                    value={imovel.padrao}
                    onChange={(e) => setImovel({ ...imovel, padrao: e.target.value as PadraoConstrutivo })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="minimo">Mínimo / Econômico</option>
                    <option value="baixo">Baixo</option>
                    <option value="medio">Normal / Médio</option>
                    <option value="alto">Alto</option>
                    <option value="luxo">Luxo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Estado de Conservação
                  </label>
                  <select
                    value={imovel.estadoConservacao}
                    onChange={(e) => setImovel({ ...imovel, estadoConservacao: e.target.value as EstadoConservacao })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="novo">Novo / Primeira Ocupação</option>
                    <option value="otimo">Ótimo Estado</option>
                    <option value="bom">Bom Estado</option>
                    <option value="regular">Regular</option>
                    <option value="ruim">Necessita Reparos Importantes</option>
                    <option value="em_construcao">Em Construção</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Fechamento Estrutural de Paredes
                  </label>
                  <select
                    value={imovel.fechamentoParede}
                    onChange={(e) => setImovel({ ...imovel, fechamentoParede: e.target.value as FechamentoParede })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="alvenaria">Alvenaria Convencional</option>
                    <option value="concreto">Paredes de Concreto Armado</option>
                    <option value="drywall">Drywall / Gesso Acartonado</option>
                    <option value="madeira">Madeira Nobre / Tratada</option>
                    <option value="outro">Outro Sistema</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 3: Fatores de Apreciação e Parâmetros Avaliatórios */}
          <div className="space-y-6">
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#ccff00]" />
                  Apreciação Pericial & Benfeitorias
                </CardTitle>
                <CardDescription className="text-xs">
                  Fator de ponderação aplicado sobre o m² homogeneizado por diferenciais físicos.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Percent className="h-3.5 w-3.5 text-[#ccff00]" />
                      Fator de Ponderação / Padrão (%)
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
                    Fator pericial de <strong>+{imovel.fatorApreciacaoPercent}%</strong> refletindo estado de conservação, acabamento e orientação solar superiores à amostra média.
                  </p>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Benfeitorias Exclusivas Não Computadas na Área (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={imovel.demaisBenfeitoriasValor}
                    onChange={(e) => setImovel({ ...imovel, demaisBenfeitoriasValor: Number(e.target.value) || 0 })}
                    placeholder="Ex: 0 (Piscina aquecida, usina solar)"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Equipamentos que agregam valor fechado além da área construída.
                  </p>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Cota Condominial Mensal (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={imovel.taxaCondominioMensal}
                    onChange={(e) => setImovel({ ...imovel, taxaCondominioMensal: Number(e.target.value) || 0 })}
                    placeholder="Ex: 0"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    IPTU Anual (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={imovel.iptuAnual}
                    onChange={(e) => setImovel({ ...imovel, iptuAnual: Number(e.target.value) || 0 })}
                    placeholder="Ex: 1200"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resumo Rápido da Unidade */}
            <Card className="border border-border bg-muted/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Média Homogeneizada (MF):</span>
                  <span className="font-semibold">{formatM2(estatisticas.mediaFinalSaneadaM2)}/m²</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Ponderação de Padrão:</span>
                  <span className="font-semibold text-emerald-500">+{imovel.fatorApreciacaoPercent}%</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-border pt-2 font-bold text-foreground">
                  <span>Valor Unitário Final Adotado:</span>
                  <span className="text-[#ccff00]">{formatM2(estatisticas.valorM2Apreciado)}/m²</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-border pt-2 font-bold text-foreground">
                  <span>Valor Técnico do Imóvel:</span>
                  <span>{formatBRL(estatisticas.valorAvaliacaoBase)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 2: REGIÃO, EQUIPAMENTOS PÚBLICOS E INFRAESTRUTURA          */}
      {/* ============================================================== */}
      {activeTab === "bairro_condo" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#ccff00]" />
                  Diagnóstico da Microrregião e Dinâmica de Mercado
                </CardTitle>
                <CardDescription className="text-xs">
                  Vocação imobiliária predominante, condições de acesso e velocidade de absorção.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Uso Predominante do Bairro
                  </label>
                  <select
                    value={imovel.usoPredominante}
                    onChange={(e) => setImovel({ ...imovel, usoPredominante: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="comercial">Comercial</option>
                    <option value="unifamiliar">Residencial Unifamiliar</option>
                    <option value="multifamiliar">Residencial Multifamiliar</option>
                    <option value="misto">Misto</option>
                    <option value="industrial">Industrial</option>
                    <option value="terreno">Glebas / Terrenos</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Padrão Construtivo do Entorno
                  </label>
                  <select
                    value={imovel.padraoConstrutivoPredominante}
                    onChange={(e) => setImovel({ ...imovel, padraoConstrutivoPredominante: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="medio">Normal / Médio</option>
                    <option value="baixo">Baixo</option>
                    <option value="minimo">Mínimo</option>
                    <option value="alto">Alto Padrão</option>
                    <option value="luxo">Luxo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Condições de Acesso
                  </label>
                  <select
                    value={imovel.acessoBairro}
                    onChange={(e) => setImovel({ ...imovel, acessoBairro: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="bom">Bom</option>
                    <option value="otimo">Ótimo</option>
                    <option value="razoavel">Razoável</option>
                    <option value="dificil">Difícil</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Comportamento do Mercado
                  </label>
                  <select
                    value={imovel.desempenhoMercado}
                    onChange={(e) => setImovel({ ...imovel, desempenhoMercado: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="recessivo">Mercado Recessivo</option>
                    <option value="normal">Mercado Equilibrado / Normal</option>
                    <option value="aquecido">Mercado Aquecido / Alta Demanda</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Velocidade Média de Absorção do Mercado Local
                  </label>
                  <select
                    value={imovel.absorcaoMercado}
                    onChange={(e) => setImovel({ ...imovel, absorcaoMercado: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="baixa_mais_6m">Baixa Absorção (Superior a 6 meses para venda)</option>
                    <option value="media_3_a_6m">Média Absorção (Entre 3 e 6 meses para venda)</option>
                    <option value="alta_ate_3m">Alta Absorção (Giro rápido inferior a 3 meses)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Redes e Equipamentos Urbanos */}
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
                  Infraestrutura Urbana & Serviços Comunitários
                </CardTitle>
                <CardDescription className="text-xs">
                  Redes de serviços públicos e comunitários instalados na via pública.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Rede de Água Tratada", key: "temAguaPotavel" },
                  { label: "Rede Elétrica e Iluminação", key: "temEnergiaEletrica" },
                  { label: "Rede Telefônica / Dados", key: "temTelefonia" },
                  { label: "Iluminação Pública em Poste", key: "temIluminacaoPublica" },
                  { label: "Drenagem Pluvial Subterrânea", key: "temAguaPluvial" },
                  { label: "Rede Coletora de Esgoto", key: "temEsgoto" },
                  { label: "Pavimentação Definitiva", key: "temPavimentacao" },
                  { label: "Gás Canalizado Subterrâneo", key: "temGasCanalizado" },
                  { label: "Comércio Varejista Consolidado", key: "temComercio" },
                  { label: "Agências / Postos Bancários", key: "temRedeBancaria" },
                  { label: "Unidades Básicas de Saúde", key: "temSaude" },
                  { label: "Equipamentos de Lazer / Parques", key: "temLazer" },
                  { label: "Transporte Coletivo com Paradas", key: "temTransporteColetivo" },
                  { label: "Postos Policiais / Ronda", key: "temSegurancaPublica" },
                  { label: "Coleta Regular de Resíduos", key: "temColetaLixo" },
                  { label: "Rede de Ensino / Creches", key: "temEscolas" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(imovel[item.key as keyof ImovelAvaliando])}
                      onChange={(e) => setImovel({ ...imovel, [item.key]: e.target.checked })}
                      className="h-3.5 w-3.5 accent-[#ccff00] rounded cursor-pointer"
                    />
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Dados do Condomínio / Empreendimento */}
          <div className="space-y-6">
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#ccff00]" />
                  Condomínio, Fachada & Prevenção contra Sinistros
                </CardTitle>
                <CardDescription className="text-xs">
                  Especificações do empreendimento, revestimentos e sistemas de emergência.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Padrão de Acabamento
                    </label>
                    <select
                      value={imovel.predioPadraoAcabamento}
                      onChange={(e) => setImovel({ ...imovel, predioPadraoAcabamento: e.target.value as any })}
                      className="w-full px-2 py-1.5 text-xs rounded bg-background border border-border"
                    >
                      <option value="medio">Médio</option>
                      <option value="baixo">Baixo</option>
                      <option value="alto">Alto</option>
                      <option value="luxo">Luxo</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Esquadrias
                    </label>
                    <select
                      value={imovel.predioEsquadrias}
                      onChange={(e) => setImovel({ ...imovel, predioEsquadrias: e.target.value as any })}
                      className="w-full px-2 py-1.5 text-xs rounded bg-background border border-border"
                    >
                      <option value="aluminio">Alumínio Anodizado</option>
                      <option value="madeira">Madeira Nobre</option>
                      <option value="pvc">PVC Termoacústico</option>
                      <option value="vidro_temperado">Vidro Temperado</option>
                      <option value="ferro">Ferro / Aço</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Revestimento Externo
                    </label>
                    <select
                      value={imovel.predioRevestimentoFachada}
                      onChange={(e) => setImovel({ ...imovel, predioRevestimentoFachada: e.target.value as any })}
                      className="w-full px-2 py-1.5 text-xs rounded bg-background border border-border"
                    >
                      <option value="textura">Textura Acrílica</option>
                      <option value="pintura">Pintura Especial</option>
                      <option value="ceramica">Pastilha Cerâmica</option>
                      <option value="granito">Granito / Porcelanato</option>
                      <option value="marmore">Mármore</option>
                      <option value="pele_vidro">Pele / Lâmina de Vidro</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <span className="text-xs font-bold text-foreground block mb-2">
                    Lazer e Serviços Coletivos:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { label: "Piscina", key: "condoPiscina" },
                      { label: "Playground", key: "condoPlayground" },
                      { label: "Salão de Festas", key: "condoSalaoFestas" },
                      { label: "Portaria 24 horas", key: "condoPortaria24h" },
                      { label: "Quadra Poliesportiva", key: "condoQuadra" },
                      { label: "Grupo Gerador", key: "condoGerador" },
                      { label: "Sauna / Spa", key: "condoSauna" },
                      { label: "Interfonia Integrada", key: "condoInterfone" },
                      { label: "Churrasqueira Coletiva", key: "condoChurrasqueira" },
                      { label: "Portão Automatizado", key: "condoPortaoEletronico" },
                      { label: "Poço Artesiano Outorgado", key: "condoPocoArtesiano" },
                      { label: "Circuito CFTV", key: "condoCftv" },
                      { label: "Hidrômetro Individual", key: "condoHidrometroIndividual" },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center justify-between p-2 rounded bg-muted/20 hover:bg-muted/40 cursor-pointer"
                      >
                        <span className="text-[11px]">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={Boolean(imovel[item.key as keyof ImovelAvaliando])}
                          onChange={(e) => setImovel({ ...imovel, [item.key]: e.target.checked })}
                          className="h-3.5 w-3.5 accent-[#ccff00] rounded cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <span className="text-xs font-bold text-foreground block mb-2">
                    Prevenção e Combate a Incêndio (AVCB):
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { label: "Extintores Portáteis", key: "incendioExtintores" },
                      { label: "Rede Hidrante Pressurizada", key: "incendioHidrantes" },
                      { label: "Central de Alarme e Detecção", key: "incendioAlarme" },
                      { label: "Escada Pressurizada de Emergência", key: "incendioEscadaEmergencia" },
                      { label: "Luminárias de Balizamento e Fuga", key: "incendioIluminacaoEmergencia" },
                      { label: "Não Possui Sistema Específico", key: "incendioNaoPossui" },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center justify-between p-2 rounded bg-muted/20 hover:bg-muted/40 cursor-pointer"
                      >
                        <span className="text-[11px]">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={Boolean(imovel[item.key as keyof ImovelAvaliando])}
                          onChange={(e) => setImovel({ ...imovel, [item.key]: e.target.checked })}
                          className="h-3.5 w-3.5 accent-[#ccff00] rounded cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 3: PESQUISA AMOSTRAL DE MERCADO (Comparáveis)              */}
      {/* ============================================================== */}
      {activeTab === "amostras" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 p-4 rounded-xl border border-border">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#ccff00]" />
                Pesquisa Amostral de Mercado (Dados Comparáveis)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Imóveis assemelhados identificados no mercado de {imovel.cidade || "Criciúma"}. O motor pericial executa a identificação automática de dados atípicos.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleAddSample}
                className="text-xs h-8 gap-1 bg-[#ccff00] text-black hover:bg-[#b8e600] font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar Comparável
              </Button>
            </div>
          </div>

          <div className="border border-border rounded-xl overflow-hidden bg-card/60 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Cód</th>
                    <th className="py-2.5 px-3 font-semibold">Fonte / Imobiliária</th>
                    <th className="py-2.5 px-3 font-semibold">Bairro / Localização</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Dorm</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Vagas</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Área Útil</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Valor de Oferta (R$)</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Valor Unitário (R$/m²)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Enquadramento NBR</th>
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
                          placeholder="Ex: Fonte da oferta"
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
                            Homogeneizada
                          </Badge>
                        ) : (
                          <Badge
                            variant="danger"
                            className="text-[10px] gap-1 px-2 py-0.5 bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30"
                            title={
                              item.motivoDescarte === "ACIMA_TETO"
                                ? `Dado discrepante acima do limite superior (${formatM2(estatisticas.limiteSuperiorM2)})`
                                : `Dado discrepante abaixo do limite inferior (${formatM2(estatisticas.limiteInferiorM2)})`
                            }
                          >
                            <AlertCircle className="h-3 w-3" />
                            {item.motivoDescarte === "ACIMA_TETO" ? "Atípico Superior" : "Atípico Inferior"}
                          </Badge>
                        )}
                      </td>

                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSample(item.id)}
                          className="text-muted-foreground hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Remover dado amostral"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-muted/40 border-t border-border flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {estatisticas.amostrasValidas} Dados Amostrais Homogeneizados
                </span>
                <span className="flex items-center gap-1.5 text-red-500 font-medium">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {estatisticas.amostrasDescartadas} Dados Discrepantes Saneados
                </span>
              </div>
              <div className="text-[11px]">
                Campo de Arbítrio: <strong>{formatM2(estatisticas.limiteInferiorM2)}</strong> até <strong>{formatM2(estatisticas.limiteSuperiorM2)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 4: DIAGNÓSTICO ESTATÍSTICO & ESPECIFICAÇÃO NBR 14.653      */}
      {/* ============================================================== */}
      {activeTab === "estatistica" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit text-[10px]">Etapa 1</Badge>
                <CardTitle className="text-base font-bold text-foreground">
                  Média Amostral Bruta
                </CardTitle>
                <CardDescription className="text-xs">
                  Soma integral de todos os valores unitários coletados na região.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="p-3 rounded-lg bg-muted/50 font-mono text-xs space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Somatório ({estatisticas.totalAmostras} dados):</span>
                    <span>{formatM2(estatisticas.somaM2TodasAmostras)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Número de Amostras (n):</span>
                    <span>{estatisticas.totalAmostras}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1 font-bold text-foreground text-sm">
                    <span>Média Bruta =</span>
                    <span className="text-[#ccff00]">{formatM2(estatisticas.mediaAritmeticaBrutaM2)}/m²</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit text-[10px]">Etapa 2</Badge>
                <CardTitle className="text-base font-bold text-foreground">
                  Campo de Arbítrio & Saneamento
                </CardTitle>
                <CardDescription className="text-xs">
                  Filtro normativo para exclusão fundamentada de outliers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Tolerância Normativa:</span>
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
                    <span>Média Amostral Central:</span>
                    <span>{formatM2(estatisticas.mediaAritmeticaBrutaM2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Limite Inferior (-{toleranciaPercent}%):</span>
                    <span className="text-amber-400 font-bold">{formatM2(estatisticas.limiteInferiorM2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/60">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit text-[10px]">Etapa 3</Badge>
                <CardTitle className="text-base font-bold text-foreground">
                  Valor Unitário Homogeneizado
                </CardTitle>
                <CardDescription className="text-xs">
                  Média saneada ponderada pelo fator de valorização pericial.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="p-3 rounded-lg bg-muted/50 font-mono text-xs space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Soma dos Dados Válidos:</span>
                    <span>{formatM2(estatisticas.somaM2AmostrasValidas)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Amostras Efetivas:</span>
                    <span>{estatisticas.amostrasValidas} unidades</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1 font-bold text-foreground text-sm">
                    <span>Média Saneada =</span>
                    <span className="text-emerald-400">{formatM2(estatisticas.mediaFinalSaneadaM2)}/m²</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Valor Unitário Ajustado (+{imovel.fatorApreciacaoPercent}%):</span>
                    <span className="text-[#ccff00] font-bold">{formatM2(estatisticas.valorM2Apreciado)}/m²</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Especificação Técnica da Avaliação */}
          <Card className="border border-border bg-card/60">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Award className="h-4 w-4 text-[#ccff00]" />
                Enquadramento e Especificação Técnica da Avaliação
              </CardTitle>
              <CardDescription className="text-xs">
                Graus de fundamentação e precisão atingidos conforme Tabela 1 da ABNT NBR 14.653-2.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Metodologia Aplicada
                </label>
                <select
                  value={imovel.metodologia}
                  onChange={(e) => setImovel({ ...imovel, metodologia: e.target.value as any })}
                  className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border"
                >
                  <option value="MCDDM">Método Comparativo Direto de Dados de Mercado</option>
                  <option value="SEM_METODOLOGIA">Sem Metodologia Definida</option>
                  <option value="OUTRO">Outro Método</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Tratamento de Dados
                </label>
                <select
                  value={imovel.tratamentoDados}
                  onChange={(e) => setImovel({ ...imovel, tratamentoDados: e.target.value as any })}
                  className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border"
                >
                  <option value="ESTATISTICA_INFERENCIAL">Estatística Inferencial / Amostral</option>
                  <option value="FATORES">Tratamento por Fatores</option>
                  <option value="NUMERO_DADOS_INSUFICIENTE">Nº de Dados Insuficientes</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Grau de Fundamentação
                </label>
                <select
                  value={imovel.fundamentacao}
                  onChange={(e) => setImovel({ ...imovel, fundamentacao: e.target.value as GrauFundamentacao })}
                  className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border"
                >
                  <option value="GRAU_I">Grau I (Simplificado)</option>
                  <option value="GRAU_II">Grau II (Intermediário)</option>
                  <option value="GRAU_III">Grau III (Rigoroso)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Grau de Precisão
                </label>
                <select
                  value={imovel.precisao}
                  onChange={(e) => setImovel({ ...imovel, precisao: e.target.value as GrauPrecisao })}
                  className="w-full px-2.5 py-2 text-xs rounded-md bg-background border border-border"
                >
                  <option value="GRAU_I">Grau I (Campo de Arbítrio)</option>
                  <option value="GRAU_II">Grau II</option>
                  <option value="GRAU_III">Grau III</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Dispersão */}
          <Card className="border border-border bg-card/60">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#ccff00]" />
                  Curva de Dispersão dos Valores Amostrais
                </span>
                <Badge variant="outline" className="text-xs">
                  Faixa Válida: {formatM2(estatisticas.limiteInferiorM2)} ~ {formatM2(estatisticas.limiteSuperiorM2)}
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
                      <span className="w-32 truncate text-muted-foreground">{item.proprietarioOuFonte}</span>
                      
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

                      <div className="w-28 text-right">
                        {item.isHomogeneizada ? (
                          <span className="text-emerald-500 font-semibold text-[11px]">Homogeneizada</span>
                        ) : (
                          <span className="text-red-400 font-semibold text-[11px]">
                            {item.motivoDescarte === "ACIMA_TETO" ? "Atípico Superior" : "Atípico Inferior"}
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
      {/* ABA 5: VISTORIA TÉCNICA E EXAME PERICIAL FÍSICO                 */}
      {/* ============================================================== */}
      {activeTab === "vistoria" && (
        <div className="space-y-6">
          <Card className="border border-border bg-card/60">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
                Relatório de Vistoria Pericial In Loco
              </CardTitle>
              <CardDescription className="text-xs">
                Inspeção física sobre regularidade documental, solidez estrutural, patologias aparentes e salubridade.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              {/* Conformidade Documental */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    1. As informações da certidão de matrícula e projeto aprovado correspondem às verificadas in loco?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setImovel({ ...imovel, docCorrespondeVistoria: true })}
                      className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                        imovel.docCorrespondeVistoria ? "bg-emerald-500 text-black font-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      SIM
                    </button>
                    <button
                      type="button"
                      onClick={() => setImovel({ ...imovel, docCorrespondeVistoria: false })}
                      className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                        !imovel.docCorrespondeVistoria ? "bg-red-500 text-white font-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      NÃO
                    </button>
                  </div>
                </div>
                {!imovel.docCorrespondeVistoria && (
                  <input
                    type="text"
                    value={imovel.justificativaDocumentacao}
                    onChange={(e) => setImovel({ ...imovel, justificativaDocumentacao: e.target.value })}
                    placeholder="Em caso negativo, aponte divergências de área construída ou averbações pendentes..."
                    className="w-full p-2 text-xs rounded bg-background border border-border"
                  />
                )}
              </div>

              {/* Estabilidade e Solidez */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    2. A edificação aparenta perfeitas condições de estabilidade e solidez estrutural?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setImovel({ ...imovel, aparentaEstabilidadeSolidez: true })}
                      className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                        imovel.aparentaEstabilidadeSolidez ? "bg-emerald-500 text-black font-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      SIM
                    </button>
                    <button
                      type="button"
                      onClick={() => setImovel({ ...imovel, aparentaEstabilidadeSolidez: false })}
                      className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                        !imovel.aparentaEstabilidadeSolidez ? "bg-red-500 text-white font-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      NÃO
                    </button>
                  </div>
                </div>
                {!imovel.aparentaEstabilidadeSolidez && (
                  <input
                    type="text"
                    value={imovel.justificativaSolidez}
                    onChange={(e) => setImovel({ ...imovel, justificativaSolidez: e.target.value })}
                    placeholder="Em caso negativo, aponte anomalias na fundação, pilares ou vigas..."
                    className="w-full p-2 text-xs rounded bg-background border border-border"
                  />
                )}
              </div>

              {/* Vícios de Construção */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    3. Foram constatados vícios aparentes de construção ou patologias nas vedações e coberturas?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setImovel({ ...imovel, temViciosConstrucao: true })}
                      className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                        imovel.temViciosConstrucao ? "bg-red-500 text-white font-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      SIM
                    </button>
                    <button
                      type="button"
                      onClick={() => setImovel({ ...imovel, temViciosConstrucao: false })}
                      className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                        !imovel.temViciosConstrucao ? "bg-emerald-500 text-black font-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      NÃO
                    </button>
                  </div>
                </div>
                {imovel.temViciosConstrucao && (
                  <input
                    type="text"
                    value={imovel.descricaoVicios}
                    onChange={(e) => setImovel({ ...imovel, descricaoVicios: e.target.value })}
                    placeholder="Descreva as manifestações patológicas (trincas, umidade ascendente, infiltração)..."
                    className="w-full p-2 text-xs rounded bg-background border border-border"
                  />
                )}
              </div>

              {/* Habitabilidade */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    4. O imóvel reúne plenas condições de habitabilidade, salubridade e segurança para uso imediato?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setImovel({ ...imovel, aparentaHabitabilidade: true })}
                      className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                        imovel.aparentaHabitabilidade ? "bg-emerald-500 text-black font-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      SIM
                    </button>
                    <button
                      type="button"
                      onClick={() => setImovel({ ...imovel, aparentaHabitabilidade: false })}
                      className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                        !imovel.aparentaHabitabilidade ? "bg-red-500 text-white font-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      NÃO
                    </button>
                  </div>
                </div>
                {!imovel.aparentaHabitabilidade && (
                  <input
                    type="text"
                    value={imovel.justificativaHabitabilidade}
                    onChange={(e) => setImovel({ ...imovel, justificativaHabitabilidade: e.target.value })}
                    placeholder="Em caso negativo, aponte os impeditivos de habitabilidade..."
                    className="w-full p-2 text-xs rounded bg-background border border-border"
                  />
                )}
              </div>

              {/* Fatores de Influência */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Fatores Valorizantes de Entorno
                  </label>
                  <input
                    type="text"
                    value={imovel.fatoresValorizantes}
                    onChange={(e) => setImovel({ ...imovel, fatoresValorizantes: e.target.value })}
                    placeholder="Ex: Vista perene para área verde, insolação matutina, proximidade de polos"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Fatores Depreciativos de Entorno
                  </label>
                  <input
                    type="text"
                    value={imovel.fatoresDepreciativos}
                    onChange={(e) => setImovel({ ...imovel, fatoresDepreciativos: e.target.value })}
                    placeholder="Ex: Poluição sonora de rodovia, linhas de alta tensão, córrego a céu aberto"
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-[#ccff00] focus:outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 6: PARECER TÉCNICO DE AVALIAÇÃO MERCADOLÓGICA (PTAM OFICIAL)*/}
      {/* ============================================================== */}
      {activeTab === "laudo" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-muted/40 p-4 rounded-xl border border-border print:hidden">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#ccff00]" />
                Laudo Oficial — Parecer Técnico de Avaliação Mercadológica (PTAM)
              </h3>
              <p className="text-xs text-muted-foreground">
                Documento técnico pericial estruturado conforme os requisitos da ABNT NBR 14.653-2 e do COFECI.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handlePrint}
              className="text-xs h-8 gap-1.5 bg-[#ccff00] text-black hover:bg-[#b8e600] font-bold"
            >
              <Printer className="h-3.5 w-3.5" />
              Imprimir / Salvar PDF
            </Button>
          </div>

          {/* O LAUDO TÉCNICO FORMAL */}
          <div className="bg-card border border-border rounded-xl p-8 max-w-4xl mx-auto shadow-sm print:border-none print:shadow-none print:p-0 space-y-6 text-foreground">
            {/* Cabeçalho Oficial do Laudo */}
            <div className="border-b-2 border-foreground pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                  DUZZIMOB GESTÃO IMOBILIÁRIA • SETOR DE ENGENHARIA E AVALIAÇÕES
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground mt-0.5">
                  Parecer Técnico de Avaliação Mercadológica (PTAM)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Método Comparativo Direto de Dados de Mercado — ABNT NBR 14.653-2 | Resolução COFECI nº 1.066/2007
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold block">PARECER Nº {imovel.ano || 2022}/PTAM-01</span>
                <span className="text-[11px] text-muted-foreground">Emissão: {dataParecerFormatada}</span>
                <span className="text-[11px] text-muted-foreground block">Vistoria: {imovel.dataVistoria}</span>
              </div>
            </div>

            {/* 1. Solicitante e Identificação do Bem */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg border border-border/80 bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">1. Solicitante / Finalidade</span>
                <p className="font-bold text-foreground text-sm">{imovel.proponente || "Não informado"}</p>
                <p className="text-muted-foreground">CPF/CNPJ: {imovel.cpfProponente || "Não informado"}</p>
                <p className="text-muted-foreground">Finalidade: <strong>{imovel.objetivo}</strong></p>
              </div>

              <div className="p-3.5 rounded-lg border border-border/80 bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">2. Identificação do Bem Avaliando</span>
                <p className="font-bold text-foreground text-sm">
                  {imovel.endereco}, {imovel.numero} {imovel.complemento && `(${imovel.complemento})`}
                </p>
                <p className="text-muted-foreground">
                  Bairro {imovel.bairro} — {imovel.cidade}/{imovel.uf}
                </p>
                <p className="text-muted-foreground">Matrícula: <strong>{imovel.matricula || "Em regularização"}</strong> ({imovel.cartorio})</p>
              </div>
            </div>

            {/* 3. Região e Terreno */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">3. Caracterização da Microrregião</span>
                <p><span className="text-muted-foreground">Uso Predominante:</span> <strong className="capitalize">{imovel.usoPredominante}</strong></p>
                <p><span className="text-muted-foreground">Padrão Construtivo:</span> <strong className="capitalize">{imovel.padraoConstrutivoPredominante}</strong></p>
                <p><span className="text-muted-foreground">Acesso:</span> <strong className="capitalize">{imovel.acessoBairro}</strong> | Mercado: <strong>{imovel.desempenhoMercado}</strong></p>
              </div>

              <div className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">4. Dados Físicos do Terreno</span>
                <p><span className="text-muted-foreground">Área Total:</span> <strong>{imovel.areaTerrenoM2} m²</strong> | Testada: <strong>{imovel.testadaMetros} m</strong></p>
                <p><span className="text-muted-foreground">Topografia:</span> <strong className="capitalize">{imovel.topografia}</strong> | Cota: <strong>{imovel.cotaGreide}</strong></p>
                <p><span className="text-muted-foreground">Geometria:</span> <strong className="capitalize">{imovel.formatoTerreno}</strong> | Situação: <strong>{imovel.situacaoQuadra}</strong></p>
              </div>
            </div>

            {/* 4. Características Físicas da Edificação */}
            <div className="border border-border rounded-lg p-4 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/10">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Área Construída Privativa</span>
                <span className="font-bold text-foreground text-sm">{imovel.areaConstruidaM2} m²</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Tipologia Construtiva</span>
                <span className="font-bold text-foreground capitalize text-sm">{imovel.tipo} ({imovel.disposicaoEdificacao})</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Composição de Cômodos</span>
                <span className="font-bold text-foreground text-sm">{imovel.quartos} dormitórios ({imovel.suites} suíte) | {imovel.vagas} vagas</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Padrão & Conservação</span>
                <span className="font-bold text-foreground capitalize text-sm">{imovel.padrao} ({imovel.estadoConservacao})</span>
              </div>
            </div>

            {/* 5. Vistoria Técnica e Parecer de Solidez */}
            <div className="p-3 rounded-lg border border-border bg-muted/20 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">5. Vistoria Pericial In Loco</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>Conformidade Documental: <strong>{imovel.docCorrespondeVistoria ? "SIM" : "NÃO"}</strong></div>
                <div>Estabilidade e Solidez: <strong>{imovel.aparentaEstabilidadeSolidez ? "SIM" : "NÃO"}</strong></div>
                <div>Vícios Aparentes: <strong>{imovel.temViciosConstrucao ? "SIM" : "NÃO"}</strong></div>
                <div>Condições de Habitabilidade: <strong>{imovel.aparentaHabitabilidade ? "SIM" : "NÃO"}</strong></div>
              </div>
              {imovel.fatoresValorizantes && (
                <p className="pt-1 text-muted-foreground">Fatores Valorizantes Observados: <strong className="text-foreground">{imovel.fatoresValorizantes}</strong></p>
              )}
            </div>

            {/* 6. Memória do Tratamento Estatístico Amostral */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground border-b border-border pb-1">
                6. Diagnóstico do Tratamento Amostral de Mercado (NBR 14.653-2)
              </h4>
              <div className="text-xs space-y-2 leading-relaxed">
                <p>
                  Foi realizada prospecção de mercado coletando <strong>{estatisticas.totalAmostras} imóveis comparáveis</strong> na microrregião de {imovel.cidade}.
                  Aplicado o saneamento estatístico por campo de arbítrio (intervalo de confiança de ±{toleranciaPercent}%), restaram{" "}
                  <strong>{estatisticas.amostrasValidas} amostras válidas</strong> devidamente homogeneizadas.
                  O presente trabalho pericial atinge a classificação técnica em <strong>{imovel.fundamentacao}</strong> e <strong>{imovel.precisao}</strong>.
                </p>
                
                <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/30 border border-border font-mono text-center">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Média Homogeneizada (MF)</span>
                    <span className="font-bold text-foreground">{formatM2(estatisticas.mediaFinalSaneadaM2)}/m²</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Ponderação de Padrão</span>
                    <span className="font-bold text-emerald-500">+{imovel.fatorApreciacaoPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Valor Unitário Final Adotado</span>
                    <span className="font-bold text-foreground text-sm">{formatM2(estatisticas.valorM2Apreciado)}/m²</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conclusão de Valores Comerciais */}
            <div className="p-6 rounded-xl bg-muted/40 border-2 border-foreground/30 space-y-4">
              <h4 className="text-sm font-black uppercase text-foreground tracking-tight text-center">
                7. Conclusão Pericial e Faixas de Valor Mercadológico
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-card border border-emerald-500/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                    Preço para Fechamento Rápido
                  </span>
                  <span className="text-lg font-black text-foreground block mt-1">
                    {formatBRL(estatisticas.precoFechamentoSugerido)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Valor de alta liquidez (-5%)</span>
                </div>

                <div className="p-4 rounded-lg bg-card border-2 border-[#ccff00] text-center shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-[#ccff00] block">
                    Valor Técnico Pericial do Bem
                  </span>
                  <span className="text-xl font-black text-foreground block mt-1">
                    {formatBRL(estatisticas.valorAvaliacaoBase)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Valor Justo de Avaliação</span>
                </div>

                <div className="p-3 rounded-lg bg-card border border-blue-500/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 block">
                    Preço Sugerido para Anúncio
                  </span>
                  <span className="text-lg font-black text-foreground block mt-1">
                    {formatBRL(estatisticas.precoAnuncioSugerido)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Margem para negociação (+5%)</span>
                </div>
              </div>
            </div>

            {/* Assinatura do Perito Avaliador */}
            <div className="pt-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs">
              <div>
                <input
                  type="text"
                  value={imovel.nomeAvaliador}
                  onChange={(e) => setImovel({ ...imovel, nomeAvaliador: e.target.value })}
                  className="font-bold text-foreground bg-transparent border-b border-border/50 text-sm focus:outline-none"
                />
                <input
                  type="text"
                  value={imovel.creciAvaliador}
                  onChange={(e) => setImovel({ ...imovel, creciAvaliador: e.target.value })}
                  className="text-muted-foreground text-xs bg-transparent border-b border-border/50 block mt-0.5 focus:outline-none"
                />
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold block text-foreground">DUZZIMOB Gestão Imobiliária</span>
                <span className="text-[10px] text-muted-foreground">Parecer emitido em estrita conformidade com a ABNT NBR 14.653</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
