"use client";

import * as React from "react";
import {
  MessageSquare,
  Bot,
  Send,
  Sparkles,
  Phone,
  Server,
  Zap,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Pause,
  Play,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ChatEntry {
  id: string;
  sender: "lead" | "ai" | "broker";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatEntry[] = [
  {
    id: "m-1",
    sender: "lead",
    text: "Olá, vi um anúncio de vocês no Instagram sobre um apartamento de 3 quartos no Centro. Ainda está disponível?",
    time: "16:20",
  },
  {
    id: "m-2",
    sender: "ai",
    text: "Olá! Tudo bem? Me chamo Sofia, consultora do DUZZIMOB. 🏡 Sim! Temos excelentes unidades de 3 quartos no Centro, tanto prontas para morar quanto com entrega para o próximo ano. Você procura com suíte e vaga dupla?",
    time: "16:21",
  },
  {
    id: "m-3",
    sender: "lead",
    text: "Com certeza com suíte. E gostaria de saber como fica o financiamento Caixa, temos uma renda familiar de 9 mil.",
    time: "16:22",
  },
  {
    id: "m-4",
    sender: "ai",
    text: "Excelente! Com essa renda familiar na Caixa, conseguimos aprovar um crédito aproximado de até R$ 380 mil no sistema SAC. O restante da entrada podemos parcelar direto com a construtora durante as obras. Qual seu melhor horário para eu te enviar a simulação completa?",
    time: "16:23",
  },
];

export default function WahaPage() {
  const [messages, setMessages] = React.useState<ChatEntry[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [aiEnabled, setAiEnabled] = React.useState(true);
  const [sessionStatus, setSessionStatus] = React.useState<"CONNECTED" | "CONNECTING">("CONNECTED");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const newLeadMsg: ChatEntry = {
      id: `lead-${Date.now()}`,
      sender: "lead",
      text: userText,
      time: timeStr,
    };

    setMessages((prev) => [...prev, newLeadMsg]);

    if (!aiEnabled) return;

    setIsTyping(true);

    try {
      const history = messages.map((m) => ({
        role: (m.sender === "lead" ? "user" : "assistant") as "user" | "assistant",
        content: m.text,
      }));

      const res = await fetch("/api/crm/chat-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history }),
      });

      const data = await res.json();
      const reply = data.reply || "Obrigado pela mensagem! Entrarei em contato em breve.";

      const aiMsg: ChatEntry = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: reply,
        time: timeStr,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "Perfeito! Anotei seu interesse e vou compartilhar opções exclusivas.",
          time: timeStr,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendQuickPrompt = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Gateway WhatsApp & IA Autônoma (WAHA)
            </h1>
            <Badge variant="default" dot pulse className="text-xs">
              VPS Conectada
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Recepção autônoma de leads via WhatsApp, qualificação conversacional com Gemini e controle de pausa por corretor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              aiEnabled
                ? "bg-emerald-600 dark:bg-[#ccff00] text-white dark:text-black border-emerald-600 dark:border-[#ccff00] shadow-sm dark:shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
            }`}
          >
            {aiEnabled ? (
              <>
                <Bot className="h-4 w-4" /> IA Sofia Ativa no WhatsApp
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" /> IA Pausada (Atendimento Humano)
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Status da Conexão & Configurações da IA (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card de Conexão WAHA */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Server className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">WAHA Container (Docker)</h3>
                  <p className="text-[11px] text-muted-foreground">WhatsApp HTTP API • VPS Externa</p>
                </div>
              </div>

              <Badge variant="success" dot pulse className="text-[10px]">
                {sessionStatus}
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border">
                <span className="text-muted-foreground">Sessão WhatsApp:</span>
                <span className="font-mono text-foreground font-semibold">default (DUZZIMOB)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border">
                <span className="text-muted-foreground">Número Conectado:</span>
                <span className="font-mono text-emerald-700 dark:text-[#ccff00] font-semibold">(48) 99123-4567</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border">
                <span className="text-muted-foreground">Endpoint Webhook:</span>
                <span className="font-mono text-foreground text-[11px]">/api/webhooks/waha</span>
              </div>
            </div>
          </Card>

          {/* Card de Configurações da IA Sofia */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Bot className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Perfil do Agente Sofia
              </h3>
              <Badge variant="outline" className="text-[10px]">
                Gemini 2.5 Flash
              </Badge>
            </div>

            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <p>
                A Sofia atua como primeira linha de contato, recepcionando leads de campanhas (Meta Ads / Instagram) e portais imobiliários 24 horas por dia.
              </p>

              <div className="p-3.5 rounded-2xl bg-muted/60 border border-border space-y-2">
                <span className="font-semibold text-foreground text-xs block">
                  Regras de Qualificação Ativas:
                </span>
                <ul className="space-y-1.5 text-[11px] text-foreground/90">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-[#ccff00]" />
                    Coleta de renda familiar para cálculo de margem Caixa
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-[#ccff00]" />
                    Mapeamento de bairros de preferência em Criciúma
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-[#ccff00]" />
                    Tentativa de agendamento de visita presencial
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-[#ccff00]" />
                    Pausa imediata quando o corretor assume a conversa
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Dados Qualificados Extraídos */}
          <Card className="p-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
              Dados Extraídos da Conversa Atual
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-muted p-2.5 rounded-xl border border-border">
                <span className="text-muted-foreground text-[10px]">Perfil:</span>
                <p className="font-semibold text-foreground">Apartamento 3 qts</p>
              </div>
              <div className="bg-muted p-2.5 rounded-xl border border-border">
                <span className="text-muted-foreground text-[10px]">Localização:</span>
                <p className="font-semibold text-foreground">Centro</p>
              </div>
              <div className="bg-muted p-2.5 rounded-xl border border-border">
                <span className="text-muted-foreground text-[10px]">Renda Bruta:</span>
                <p className="font-semibold text-emerald-600 dark:text-[#ccff00] font-mono">R$ 9.000 /mês</p>
              </div>
              <div className="bg-muted p-2.5 rounded-xl border border-border">
                <span className="text-muted-foreground text-[10px]">Temperatura:</span>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">🔥 Quente (Pronto p/ Proposta)</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Coluna Direita: Simulador Visual do WhatsApp (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="border-border overflow-hidden flex flex-col h-[700px] shadow-sm dark:shadow-2xl">
            {/* Header do Chat (Estilo WhatsApp) */}
            <div className="px-5 py-4 bg-muted/70 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                    ES
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-card" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">Eduardo Silveira (Lead)</h3>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <span>(48) 99123-4567</span>
                    <span>•</span>
                    <span className="text-emerald-700 dark:text-[#ccff00]">Atendimento Sofia IA</span>
                  </p>
                </div>
              </div>

              <Badge variant={aiEnabled ? "default" : "warning"} className="text-[10px]">
                {aiEnabled ? "Sofia Respondendo" : "Aguardando Corretor"}
              </Badge>
            </div>

            {/* Lista de Mensagens */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50 dark:bg-[#0c0e10] transition-colors">
              {messages.map((msg) => {
                const isLead = msg.sender === "lead";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isLead ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-1 shadow-sm ${
                        isLead
                          ? "bg-white dark:bg-[#181c20] text-foreground border border-slate-200 dark:border-white/5 rounded-tl-sm"
                          : "bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-[#1f2712] dark:text-white dark:border-[#ccff00]/30 rounded-tr-sm dark:shadow-[0_0_12px_rgba(204,255,0,0.1)]"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={`text-[9px] text-right ${
                          isLead ? "text-muted-foreground" : "text-emerald-700 dark:text-[#ccff00]/80"
                        }`}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                  <Bot className="h-3.5 w-3.5 text-emerald-600 dark:text-[#ccff00] animate-spin" />
                  Sofia está digitando...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Pílulas de Prompts Rápidos */}
            <div className="px-4 py-2 bg-muted/60 border-t border-border flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-muted-foreground whitespace-nowrap">Testar:</span>
              <button
                type="button"
                onClick={() => sendQuickPrompt("Qual a documentação necessária para o financiamento Caixa?")}
                className="px-3 py-1 rounded-full bg-card border border-border text-foreground hover:border-emerald-500/50 dark:hover:border-[#ccff00]/40 whitespace-nowrap cursor-pointer transition-colors shadow-xs"
              >
                Documentos Caixa?
              </button>
              <button
                type="button"
                onClick={() => sendQuickPrompt("Gostaria de agendar uma visita neste sábado de manhã.")}
                className="px-3 py-1 rounded-full bg-card border border-border text-foreground hover:border-emerald-500/50 dark:hover:border-[#ccff00]/40 whitespace-nowrap cursor-pointer transition-colors shadow-xs"
              >
                Agendar visita sábado
              </button>
              <button
                type="button"
                onClick={() => sendQuickPrompt("Aceita meu carro de 60 mil como entrada?")}
                className="px-3 py-1 rounded-full bg-card border border-border text-foreground hover:border-emerald-500/50 dark:hover:border-[#ccff00]/40 whitespace-nowrap cursor-pointer transition-colors shadow-xs"
              >
                Carro na entrada?
              </button>
            </div>

            {/* Input de Envio de Mensagem */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-muted/70 border-t border-border flex items-center gap-3"
            >
              <input
                type="text"
                placeholder={
                  aiEnabled
                    ? "Digite uma mensagem como se fosse o lead do WhatsApp..."
                    : "IA pausada. Responda manualmente como corretor..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 h-11 px-4 rounded-full bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00] shadow-xs"
              />

              <Button
                type="submit"
                size="icon"
                disabled={!inputText.trim()}
                className="h-11 w-11 rounded-full shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
