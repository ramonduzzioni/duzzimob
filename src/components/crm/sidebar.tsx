"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  Calculator,
  MessageSquare,
  FileCheck2,
  Scale,
  Home,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";

export const NAV_ITEMS = [
  { href: "/crm/deals", label: "Funil Kanban", icon: Layers, description: "Pipeline de Negócios" },
  { href: "/crm/simulations", label: "Simulador Caixa", icon: Calculator, description: "Financiamento & Propostas" },
  { href: "/crm/waha", label: "WhatsApp & IA", icon: MessageSquare, description: "Atendimento Autônomo" },
  { href: "/crm/contracts", label: "Auditoria Jurídica", icon: FileCheck2, description: "Análise de Minutas" },
  { href: "/crm/valuation", label: "Avaliação Imobiliária", icon: Scale, description: "PTAM & Mercado" },
];

export function CrmSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("duzzimob_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("duzzimob_sidebar_collapsed", String(next));
      return next;
    });
  };

  // Fecha no mobile ao navegar
  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Barra Superior Mobile (somente visível em telas pequenas < md) */}
      <div className="md:hidden sticky top-0 z-40 w-full h-14 border-b border-border bg-card/95 backdrop-blur-md px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center text-foreground cursor-pointer"
            aria-label="Abrir menu"
          >
            {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-emerald-600 dark:bg-[#ccff00] flex items-center justify-center text-white dark:text-black font-extrabold text-xs shadow-xs">
              D
            </div>
            <span className="font-bold tracking-tight text-foreground text-sm">
              DUZZI<span className="text-emerald-600 dark:text-[#ccff00]">MOB</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="h-7 w-7 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-semibold text-foreground">
            CD
          </div>
        </div>
      </div>

      {/* Backdrop para Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-in fade-in"
        />
      )}

      {/* Sidebar Principal (Desktop lateral fixa/sticky, Mobile drawer deslizante) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen border-r border-border bg-card transition-all duration-300 ease-in-out flex flex-col justify-between shrink-0 ${
          isCollapsed ? "md:w-20" : "md:w-64"
        } ${
          isMobileOpen
            ? "translate-x-0 w-64 shadow-2xl"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Topo da Sidebar: Brand e Botão de Recolher */}
        <div className="p-4 border-b border-border flex items-center justify-between gap-2">
          <Link
            href="/"
            className={`flex items-center gap-2.5 overflow-hidden group ${
              isCollapsed ? "mx-auto" : ""
            }`}
          >
            <div className="h-9 w-9 rounded-full bg-emerald-600 dark:bg-[#ccff00] flex items-center justify-center text-white dark:text-black font-extrabold text-sm shadow-sm dark:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-transform group-hover:scale-105 shrink-0">
              D
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold tracking-tight text-foreground text-sm truncate">
                  DUZZI<span className="text-emerald-600 dark:text-[#ccff00]">MOB</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-mono -mt-1">
                  CRM Imobiliário
                </span>
              </div>
            )}
          </Link>

          {/* Botão de recolher/expandir (desktop) */}
          <button
            type="button"
            onClick={toggleCollapse}
            className={`hidden md:flex h-7 w-7 rounded-full bg-muted hover:bg-muted/80 border border-border items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer ${
              isCollapsed ? "absolute -right-3 top-5 bg-card shadow-md z-10" : ""
            }`}
            title={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral (apenas ícones)"}
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Corpo da Navegação */}
        <div className="flex-1 py-4 px-2 space-y-6 overflow-y-auto overflow-x-hidden">
          {/* Header da seção */}
          {!isCollapsed ? (
            <div className="px-3">
              <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase font-mono">
                Menu do Sistema
              </p>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <span className="h-1 w-4 rounded-full bg-muted-foreground/30" />
            </div>
          )}

          {/* Lista de Links */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl transition-all ${
                      isCollapsed
                        ? "h-11 w-11 justify-center mx-auto"
                        : "px-3.5 py-2.5 w-full text-xs font-medium"
                    } ${
                      isActive
                        ? "bg-emerald-500/10 dark:bg-[#ccff00]/15 text-emerald-800 dark:text-[#ccff00] border border-emerald-500/30 dark:border-[#ccff00]/30 shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Icon className={`shrink-0 ${isCollapsed ? "h-5 w-5" : "h-4 w-4"}`} />

                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>

                  {/* Tooltip flutuante quando recolhido */}
                  {isCollapsed && (
                    <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 text-xs font-medium rounded-lg bg-popover text-popover-foreground border border-border shadow-lg whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Status WAHA */}
          {!isCollapsed ? (
            <div className="px-2 pt-2">
              <div className="p-3 rounded-2xl bg-muted/50 border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-medium text-foreground">WAHA Online</span>
                </div>
                <Badge variant="default" className="text-[9px] py-0 px-1.5">
                  VPS
                </Badge>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center py-2" title="WAHA Online (VPS)">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </div>
          )}
        </div>

        {/* Rodapé da Sidebar: Home, ThemeToggle e Perfil */}
        <div className="p-3 border-t border-border space-y-2">
          {/* Link para a Home */}
          <div className="relative group">
            <Link
              href="/"
              className={`flex items-center gap-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
                isCollapsed
                  ? "h-10 w-10 justify-center mx-auto"
                  : "px-3 py-2 text-xs font-medium w-full"
              }`}
            >
              <Home className={`shrink-0 ${isCollapsed ? "h-4 w-4" : "h-3.5 w-3.5"}`} />
              {!isCollapsed && <span>Página Inicial</span>}
            </Link>

            {isCollapsed && (
              <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 text-xs font-medium rounded-lg bg-popover text-popover-foreground border border-border shadow-lg whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Página Inicial
              </div>
            )}
          </div>

          {/* Toggle de tema e Usuário */}
          <div
            className={`flex items-center ${
              isCollapsed ? "flex-col gap-2 pt-1" : "justify-between pt-1 px-1"
            }`}
          >
            <ThemeToggle />

            {!isCollapsed ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-foreground">
                  CD
                </div>
                <div className="flex flex-col text-[11px] leading-tight">
                  <span className="font-semibold text-foreground">Carlos Duzzi</span>
                  <span className="text-[10px] text-muted-foreground">Corretor</span>
                </div>
              </div>
            ) : (
              <div
                className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-foreground"
                title="Carlos Duzzi • Corretor"
              >
                CD
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
