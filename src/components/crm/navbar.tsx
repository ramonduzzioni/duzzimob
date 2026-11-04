"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  Calculator,
  MessageSquare,
  Building2,
  Users,
  Sparkles,
  Bot,
  Plus,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/crm/deals", label: "Funil Kanban", icon: Layers },
  { href: "/crm/simulations", label: "Simulador Caixa", icon: Calculator },
  { href: "/crm/waha", label: "WhatsApp & IA", icon: MessageSquare },
];

export function CrmNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-full bg-emerald-600 dark:bg-[#ccff00] flex items-center justify-center text-white dark:text-black font-extrabold text-sm shadow-sm dark:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-transform group-hover:scale-105">
              D
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-foreground text-sm">
                DUZZI<span className="text-emerald-600 dark:text-[#ccff00]">MOB</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono -mt-1">CRM v1.0</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/10 dark:bg-[#ccff00]/15 text-emerald-800 dark:text-[#ccff00] border border-emerald-500/30 dark:border-[#ccff00]/30 shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          <Badge variant="default" dot pulse className="hidden sm:inline-flex text-[11px]">
            WAHA Online
          </Badge>

          <ThemeToggle />

          <Link href="/">
            <Button variant="outline" size="sm" className="hidden lg:inline-flex text-xs">
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              Visão Geral
            </Button>
          </Link>

          <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-foreground">
            CD
          </div>
        </div>
      </div>
    </header>
  );
}
