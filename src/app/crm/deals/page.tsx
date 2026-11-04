"use client";

import * as React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Search,
  Plus,
  Bot,
  User,
  Phone,
  Building,
  DollarSign,
  Calendar,
  AlertCircle,
  Pause,
  Play,
  X,
  Sparkles,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { DealStage } from "@/types/database";

interface KanbanDeal {
  id: string;
  leadName: string;
  phone: string;
  propertyTitle: string;
  neighborhood: string;
  value: number;
  stage: DealStage;
  aiPaused: boolean;
  createdAt: string;
  notes?: string;
  specs?: string;
}

const STAGES: { id: DealStage; label: string; color: string }[] = [
  { id: "novo_lead", label: "Novo Lead", color: "#64748b" },
  { id: "triagem_ia", label: "Triagem IA (WhatsApp)", color: "#16a34a" },
  { id: "contato_humano", label: "Contato Humano", color: "#0284c7" },
  { id: "visita_agendada", label: "Visita Agendada", color: "#6366f1" },
  { id: "proposta", label: "Proposta", color: "#eab308" },
  { id: "credito_contrato", label: "Crédito / Contrato", color: "#f97316" },
  { id: "fechado_ganho", label: "Fechado Ganho", color: "#22c55e" },
  { id: "perdido", label: "Perdido", color: "#ef4444" },
];

const INITIAL_DEALS: KanbanDeal[] = [
  {
    id: "deal-1",
    leadName: "Eduardo Silveira",
    phone: "(48) 99123-4567",
    propertyTitle: "Edifício Jardins do Vale (Ap. 402)",
    neighborhood: "Centro, Criciúma",
    value: 485000,
    stage: "proposta",
    aiPaused: true,
    createdAt: "Hoje às 14:20",
    specs: "3 qts (1 suíte) • 84m² • 2 vagas",
    notes: "Aguardando aprovação de crédito na agência Caixa Michel.",
  },
  {
    id: "deal-2",
    leadName: "Mariana Althaus",
    phone: "(48) 99876-5432",
    propertyTitle: "Casa Térrea Alto Padrão",
    neighborhood: "Michel, Criciúma",
    value: 890000,
    stage: "visita_agendada",
    aiPaused: true,
    createdAt: "Ontem às 18:40",
    specs: "3 suítes • 190m² • Piscina",
    notes: "Visita confirmada para sábado às 10h00 com marido.",
  },
  {
    id: "deal-3",
    leadName: "Lucas Mendes",
    phone: "(48) 98456-7890",
    propertyTitle: "Residencial Belluno",
    neighborhood: "Próspera, Criciúma",
    value: 320000,
    stage: "triagem_ia",
    aiPaused: false,
    createdAt: "Hoje às 16:05",
    specs: "2 qts • 62m² • Sacada c/ churrasqueira",
    notes: "Gemini coletando renda bruta familiar para cálculo Caixa.",
  },
  {
    id: "deal-4",
    leadName: "Patrícia & Carlos",
    phone: "(48) 99654-3210",
    propertyTitle: "Loteamento Pinheirinho",
    neighborhood: "Pinheirinho, Criciúma",
    value: 195000,
    stage: "novo_lead",
    aiPaused: false,
    createdAt: "Há 18 min",
    specs: "Terreno 360m² • Pronto para construir",
    notes: "Lead vindo de anúncio no Instagram (campanha de lotes).",
  },
  {
    id: "deal-5",
    leadName: "Rodrigo Fagundes",
    phone: "(48) 99112-2334",
    propertyTitle: "Condomínio Reserva da Mata",
    neighborhood: "Comerciário, Criciúma",
    value: 650000,
    stage: "credito_contrato",
    aiPaused: true,
    createdAt: "Há 3 dias",
    specs: "3 qts (1 suíte) • 105m²",
    notes: "Minuta de contrato enviada para auditoria jurídica IA.",
  },
  {
    id: "deal-6",
    leadName: "Juliana Becker",
    phone: "(48) 99778-8990",
    propertyTitle: "Edifício Torres Di Lucca",
    neighborhood: "Pio Corrêa, Criciúma",
    value: 720000,
    stage: "fechado_ganho",
    aiPaused: true,
    createdAt: "Há 1 semana",
    specs: "3 suítes • 130m²",
    notes: "Contrato assinado em cartório! Comissão faturada.",
  },
];

export default function KanbanPage() {
  const [deals, setDeals] = React.useState<KanbanDeal[]>(INITIAL_DEALS);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDeal, setSelectedDeal] = React.useState<KanbanDeal | null>(null);
  const [isNewDealOpen, setIsNewDealOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // New Deal Form State
  const [newLeadName, setNewLeadName] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [newProperty, setNewProperty] = React.useState("");
  const [newNeighborhood, setNewNeighborhood] = React.useState("Centro, Criciúma");
  const [newValue, setNewValue] = React.useState("");
  const [newStage, setNewStage] = React.useState<DealStage>("novo_lead");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const targetStage = destination.droppableId as DealStage;

    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id === draggableId) {
          const shouldPauseAi =
            targetStage !== "novo_lead" && targetStage !== "triagem_ia"
              ? true
              : deal.aiPaused;

          return {
            ...deal,
            stage: targetStage,
            aiPaused: shouldPauseAi,
          };
        }
        return deal;
      })
    );
  };

  const toggleAiPause = (dealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, aiPaused: !d.aiPaused } : d))
    );
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newPhone) return;

    const newDeal: KanbanDeal = {
      id: `deal-${Date.now()}`,
      leadName: newLeadName,
      phone: newPhone,
      propertyTitle: newProperty || "Imóvel sob Consulta",
      neighborhood: newNeighborhood,
      value: parseFloat(newValue) || 350000,
      stage: newStage,
      aiPaused: newStage !== "triagem_ia" && newStage !== "novo_lead",
      createdAt: "Agora mesmo",
      notes: "Lead criado manualmente no CRM.",
    };

    setDeals((prev) => [newDeal, ...prev]);
    setNewLeadName("");
    setNewPhone("");
    setNewProperty("");
    setNewValue("");
    setIsNewDealOpen(false);
  };

  const filteredDeals = deals.filter(
    (d) =>
      d.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVgv = deals.reduce((acc, curr) => acc + curr.value, 0);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground">
        Carregando Funil de Vendas...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto w-full">
      {/* Top Controls & Metrics Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Funil de Vendas Kanban
            </h1>
            <Badge variant="default" className="text-xs">
              VGV Total: {formatCurrency(totalVgv)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Arraste os cards entre os estágios. A IA de atendimento WhatsApp pausa automaticamente quando o corretor assume.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar lead, imóvel ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-full bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]/60 transition-colors shadow-xs"
            />
          </div>

          <Button onClick={() => setIsNewDealOpen(true)} size="sm">
            <Plus className="h-4 w-4" />
            Novo Negócio
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-max items-start">
            {STAGES.map((stage) => {
              const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
              const stageVgv = stageDeals.reduce((sum, d) => sum + d.value, 0);

              return (
                <div
                  key={stage.id}
                  className="w-80 flex flex-col rounded-3xl bg-slate-100 dark:bg-[#111316] border border-border p-3 space-y-3 shadow-sm dark:shadow-lg transition-colors"
                >
                  {/* Column Header */}
                  <div className="px-2 pt-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="font-semibold text-xs text-foreground">
                        {stage.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        ({stageDeals.length})
                      </span>
                    </div>

                    <span className="text-[10px] text-muted-foreground font-mono">
                      {stageVgv > 0 ? formatCurrency(stageVgv) : "R$ 0"}
                    </span>
                  </div>

                  {/* Droppable Card Area */}
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex flex-col gap-2.5 min-h-[450px] rounded-2xl p-1 transition-colors ${
                          snapshot.isDraggingOver
                            ? "bg-muted/60 ring-1 ring-emerald-500/30 dark:ring-[#ccff00]/30"
                            : "bg-transparent"
                        }`}
                      >
                        {stageDeals.map((deal, index) => (
                          <Draggable
                            key={deal.id}
                            draggableId={deal.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedDeal(deal)}
                                className={`group rounded-2xl bg-card border p-4 space-y-3 cursor-grab active:cursor-grabbing transition-all hover:border-slate-300 dark:hover:border-white/20 hover:shadow-md ${
                                  snapshot.isDragging
                                    ? "shadow-2xl ring-2 ring-emerald-500 dark:ring-[#ccff00] scale-105 z-50 border-transparent bg-card"
                                    : "border-border shadow-xs"
                                }`}
                              >
                                {/* Lead Name & AI Status Toggle */}
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-semibold text-foreground text-sm group-hover:text-emerald-600 dark:group-hover:text-[#ccff00] transition-colors">
                                      {deal.leadName}
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                      <Phone className="h-3 w-3 text-muted-foreground/80" />
                                      {deal.phone}
                                    </p>
                                  </div>

                                  <button
                                    onClick={(e) => toggleAiPause(deal.id, e)}
                                    title={
                                      deal.aiPaused
                                        ? "Retomar atendimento autônomo da IA"
                                        : "Pausar IA no WhatsApp (Corretor assume)"
                                    }
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 border transition-all cursor-pointer ${
                                      deal.aiPaused
                                        ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
                                        : "bg-emerald-500/10 dark:bg-[#ccff00]/10 border-emerald-500/30 dark:border-[#ccff00]/30 text-emerald-700 dark:text-[#ccff00] hover:bg-emerald-500/20"
                                    }`}
                                  >
                                    <Bot className="h-2.5 w-2.5" />
                                    {deal.aiPaused ? "IA Pausada" : "IA Ativa"}
                                  </button>
                                </div>

                                {/* Imóvel & Bairro */}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                                    <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <span className="truncate">{deal.propertyTitle}</span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground pl-5">
                                    {deal.neighborhood}
                                  </p>
                                </div>

                                {/* Valor & Tempo */}
                                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                                  <span className="font-bold text-foreground font-mono text-sm">
                                    {formatCurrency(deal.value)}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {deal.createdAt}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>

      {/* Modal / Drawer de Detalhes do Lead */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl relative text-foreground">
            <button
              onClick={() => setSelectedDeal(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Ficha do Lead</span>
                <Badge variant="default" className="text-[10px]">
                  {STAGES.find((s) => s.id === selectedDeal.stage)?.label}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {selectedDeal.leadName}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-muted p-3 rounded-2xl border border-border space-y-1">
                <span className="text-muted-foreground">Telefone / WhatsApp</span>
                <p className="font-semibold text-foreground">{selectedDeal.phone}</p>
              </div>

              <div className="bg-muted p-3 rounded-2xl border border-border space-y-1">
                <span className="text-muted-foreground">Valor em Negociação</span>
                <p className="font-bold text-emerald-600 dark:text-[#ccff00] font-mono text-sm">
                  {formatCurrency(selectedDeal.value)}
                </p>
              </div>

              <div className="col-span-2 bg-muted p-3 rounded-2xl border border-border space-y-1">
                <span className="text-muted-foreground">Imóvel de Interesse</span>
                <p className="font-semibold text-foreground">
                  {selectedDeal.propertyTitle}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {selectedDeal.neighborhood} • {selectedDeal.specs || "Padrão"}
                </p>
              </div>

              <div className="col-span-2 bg-muted p-3 rounded-2xl border border-border space-y-1">
                <span className="text-muted-foreground">Notas & Qualificação da IA</span>
                <p className="text-foreground/90 leading-relaxed">
                  {selectedDeal.notes || "Sem observações adicionais."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                onClick={(e) => toggleAiPause(selectedDeal.id, e)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                  selectedDeal.aiPaused
                    ? "bg-emerald-600 dark:bg-[#ccff00] text-white dark:text-black font-semibold shadow-sm"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
                }`}
              >
                {selectedDeal.aiPaused ? (
                  <>
                    <Play className="h-3.5 w-3.5" /> Retomar IA no WhatsApp
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5" /> Pausar Atendimento da IA
                  </>
                )}
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDeal(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação de Novo Negócio */}
      {isNewDealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateDeal}
            className="bg-card border border-border rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative text-foreground"
          >
            <button
              type="button"
              onClick={() => setIsNewDealOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Criar Novo Negócio</h3>
              <p className="text-xs text-muted-foreground">
                Cadastre um lead diretamente no funil de vendas do DUZZIMOB.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-muted-foreground block mb-1">Nome do Lead / Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  required
                  placeholder="(48) 99999-9999"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Imóvel de Interesse</label>
                <input
                  type="text"
                  placeholder="Ex: Residencial Jardins (Ap. 301)"
                  value={newProperty}
                  onChange={(e) => setNewProperty(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Valor do Negócio (R$)</label>
                  <input
                    type="number"
                    placeholder="350000"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Estágio Inicial</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as DealStage)}
                    className="w-full h-10 px-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id} className="bg-card text-foreground">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsNewDealOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm">
                Adicionar ao Funil
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
