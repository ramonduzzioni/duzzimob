import Link from "next/link";
import {
  Building2,
  Sparkles,
  Bot,
  FileCheck2,
  Calculator,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Layers,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08090a] text-zinc-100 selection:bg-[#ccff00] selection:text-black">
      {/* Glow background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#ccff00]/[0.04] blur-[140px] rounded-full" />
        <div className="absolute top-96 left-1/4 w-[400px] h-[300px] bg-emerald-500/[0.02] blur-[120px] rounded-full" />
      </div>

      {/* Top Floating Navbar (Remoplus style) */}
      <header className="sticky top-4 z-50 px-4 max-w-6xl mx-auto">
        <nav className="flex items-center justify-between px-6 py-3 rounded-full bg-[#131619]/90 backdrop-blur-md border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#ccff00] flex items-center justify-center text-black font-black text-lg shadow-[0_0_15px_rgba(204,255,0,0.3)]">
              D
            </div>
            <span className="font-bold tracking-tight text-white text-base">
              DUZZI<span className="text-[#ccff00]">MOB</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#dashboard" className="hover:text-white transition-colors">
              Dashboard
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Recursos
            </a>
            <a href="#pipeline" className="hover:text-white transition-colors">
              Funil Kanban
            </a>
            <a href="#ia" className="hover:text-white transition-colors">
              Inteligência Artificial
            </a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button size="sm" className="hidden sm:inline-flex">
              Acessar CRM
              <ArrowRight className="h-4 w-4 ml-0.5" />
            </Button>
          </div>
        </nav>
      </header>

      <main className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-300">
            <span className="flex h-2 w-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-[#ccff00] font-semibold">DUZZIMOB v1.0</span>
            <span className="text-zinc-500">•</span>
            <span>CRM Imobiliário Inteligente & Automação</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Potencialize suas vendas imobiliárias com{" "}
            <span className="text-[#ccff00] drop-shadow-[0_0_25px_rgba(204,255,0,0.3)]">
              Inteligência Autônoma
            </span>
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Plataforma tudo-em-um para corretores de alta performance: triagem no WhatsApp
            via IA, simulações Caixa automáticas, funil visual Kanban e auditoria de contratos em segundos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button size="lg" className="rounded-full">
              Iniciar Demonstração
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              <Calculator className="h-4 w-4 text-[#ccff00]" />
              Simular Financiamento
            </Button>
          </div>
        </section>

        {/* Dashboard Preview Widget (Fiel à imagem de referência) */}
        <section id="dashboard" className="relative">
          <div className="rounded-[32px] p-2 sm:p-4 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[26px] bg-[#0e1113] border border-white/[0.06] p-5 sm:p-7 space-y-6">
              
              {/* Mini Header dentro do Mockup */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] font-bold text-xs">
                    DM
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Escritório Imobiliário Solo</h2>
                    <p className="text-xs text-zinc-500">Criciúma & Região • CRECI 48.912-F</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Badge variant="default" dot pulse>
                    WAHA Online
                  </Badge>
                  <Badge variant="secondary">
                    Gemini 2.5 Flash
                  </Badge>
                  <div className="h-8 w-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs text-zinc-300 font-semibold">
                    CD
                  </div>
                </div>
              </div>

              {/* 4 KPIs Topo */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#15181b] border border-white/[0.06] rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-zinc-400">VGV em Funil</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      R$ 4,85 M
                    </span>
                    <span className="text-[11px] text-[#ccff00] font-semibold">+18%</span>
                  </div>
                </div>

                <div className="bg-[#15181b] border border-white/[0.06] rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-zinc-400">Leads Ativos</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      42
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">9 novos hoje</span>
                  </div>
                </div>

                <div className="bg-[#15181b] border border-white/[0.06] rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-zinc-400">Visitas Agendadas</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      8
                    </span>
                    <span className="text-[11px] text-cyan-400 font-semibold">Esta semana</span>
                  </div>
                </div>

                <div className="bg-[#15181b] border border-white/[0.06] rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-zinc-400">Simulações Caixa</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      15
                    </span>
                    <span className="text-[11px] text-[#ccff00] font-semibold">SAC 420m</span>
                  </div>
                </div>
              </div>

              {/* Centro: Gráficos de Desempenho e Funil Visual */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* Gráfico de Barras Minimalista (Estilo Remoplus) */}
                <div className="bg-[#15181b] border border-white/[0.06] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">Atendimentos WhatsApp</h3>
                    <span className="text-xs text-[#ccff00] font-mono">Últimos 14 dias</span>
                  </div>
                  
                  <div className="h-32 flex items-end justify-between gap-1.5 pt-4 px-2">
                    {[35, 45, 60, 40, 75, 50, 65, 80, 55, 90, 70, 95, 85, 100].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          style={{ height: `${h}%` }}
                          className={`w-full rounded-full transition-all ${
                            i === 11
                              ? "bg-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.6)]"
                              : "bg-white/[0.08] hover:bg-white/20"
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-zinc-400 text-center">
                    IA autônoma qualificou <strong className="text-white">84%</strong> dos leads antes do contato telefônico.
                  </p>
                </div>

                {/* Medidor Circular (Gauge 68% Conversão) */}
                <div className="bg-[#15181b] border border-white/[0.06] rounded-2xl p-5 flex flex-col items-center justify-center space-y-3">
                  <h3 className="text-sm font-medium text-white self-start">Taxa de Qualificação</h3>
                  <div className="relative flex items-center justify-center h-28 w-28">
                    <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                    <div className="absolute inset-0 rounded-full border-4 border-[#ccff00] border-t-transparent border-l-transparent -rotate-45 shadow-[0_0_20px_rgba(204,255,0,0.3)]" />
                    <div className="text-center">
                      <span className="text-2xl font-extrabold text-white">68%</span>
                      <p className="text-[10px] text-zinc-400">Score Aprovado</p>
                    </div>
                  </div>
                  <Badge variant="default" className="text-[11px]">
                    Perfil Habitual Caixa Aderente
                  </Badge>
                </div>

                {/* Lista de Leads Rápidos em Negociação */}
                <div className="bg-[#15181b] border border-white/[0.06] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">Fila de Negociações</h3>
                    <span className="text-xs text-zinc-500">Ao vivo</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        name: "Eduardo Silveira",
                        prop: "Residencial Jardins (Ap. 402)",
                        val: "R$ 480.000",
                        stage: "Simulação Caixa",
                        badge: "SAC Aprovada",
                      },
                      {
                        name: "Mariana Althaus",
                        prop: "Casa Moderna Michel",
                        val: "R$ 890.000",
                        stage: "Visita Agendada",
                        badge: "Sábado 10h",
                      },
                      {
                        name: "Carlos & Patrícia",
                        prop: "Loteamento Pinheirinho",
                        val: "R$ 210.000",
                        stage: "Triagem IA",
                        badge: "WhatsApp Ativo",
                      },
                    ].map((lead, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{lead.name}</p>
                          <p className="text-[11px] text-zinc-400">{lead.prop}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-zinc-300">{lead.val}</p>
                          <span className="text-[10px] text-[#ccff00]">{lead.badge}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 4 Cards de Recursos com Design Escuro Futurista */}
        <section id="features" className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Arquitetura de Alta Performance
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
              Projetado para operar com fricção zero na captação, qualificação, simulação e fechamento imobiliário.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="hover:border-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.05)]">
              <CardContent className="p-6 space-y-4">
                <div className="h-11 w-11 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white text-base">Atendimento WAHA</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Conexão direta com container WhatsApp HTTP API na VPS. Webhooks em tempo real e controle de pausa por corretor.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.05)]">
              <CardContent className="p-6 space-y-4">
                <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Calculator className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white text-base">Simulador Caixa</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Cálculo de gap de entrada, subsídios, FGTS, amortização SAC/PRICE e geração automática do fluxo da construtora.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.05)]">
              <CardContent className="p-6 space-y-4">
                <div className="h-11 w-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white text-base">Auditoria com Gemini</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Upload de minutas contratuais em PDF para detecção automática de cláusulas abusivas, riscos e certidões faltantes.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.05)]">
              <CardContent className="p-6 space-y-4">
                <div className="h-11 w-11 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white text-base">Multi-Tenant Nativo</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  PostgreSQL com Row Level Security (RLS) isolando cada imobiliária por tenant, pronto para escalar como SaaS.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.08] pt-10 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">DUZZIMOB</span>
            <span>• Desenvolvido para máxima conversão imobiliária</span>
          </div>
          <p>© 2026 DUZZIMOB. Todos os direitos reservados.</p>
        </footer>
      </main>
    </div>
  );
}
