"use client";

import * as React from "react";
import { Scale, Sparkles, Plus, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ValuationPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Avaliação Imobiliária
            </h1>
            <Badge variant="default" className="text-xs">
              Módulo em Estruturação
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Espaço dedicado para laudos de avaliação, Parecer Técnico de Avaliação Mercadológica (PTAM) e análise comparativa de mercado.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" disabled className="opacity-70 cursor-not-allowed">
            <Plus className="h-4 w-4 mr-1" />
            Nova Avaliação
          </Button>
        </div>
      </div>

      {/* Placeholder Content Area */}
      <Card className="border-dashed p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[420px]">
        <div className="h-16 w-16 rounded-full bg-emerald-500/10 dark:bg-[#ccff00]/10 flex items-center justify-center text-emerald-600 dark:text-[#ccff00]">
          <Scale className="h-8 w-8" />
        </div>

        <div className="space-y-2 max-w-md">
          <CardTitle className="text-xl">Área de Avaliação Imobiliária</CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            A estrutura desta página está pronta para receber os formulários de vistoria, método comparativo direto de dados de mercado e emissão de parecer técnico.
          </CardDescription>
        </div>

        <div className="pt-2">
          <Badge variant="secondary" className="gap-1.5 text-xs py-1 px-3">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            Aguardando definições de conteúdo e regras de avaliação
          </Badge>
        </div>
      </Card>
    </div>
  );
}
