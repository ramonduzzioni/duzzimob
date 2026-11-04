"use client";

import * as React from "react";
import {
  FileCheck2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  UploadCloud,
  Layers,
  ArrowRight,
  RefreshCw,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AiAuditResult } from "@/types/database";

const SAMPLE_CONTRACTS = [
  {
    title: "Minuta Edifício Jardins do Vale (Ap. 402)",
    text: `INSTRUMENTO PARTICULAR DE PROMESSA DE COMPRA E VENDA DE IMÓVEL
CLÁUSULA PRIMEIRA - DO OBJETO:
O VENDEDOR promete vender ao COMPRADOR o apartamento nº 402, do Edifício Jardins do Vale, localizado no Centro de Criciúma/SC, com área privativa de 84m², 1 vaga de garagem nº 12.

CLÁUSULA SEGUNDA - DO PREÇO E FORMA DE PAGAMENTO:
O preço total da transação é de R$ 485.000,00 (quatrocentos e oitenta e cinco mil reais), a ser pago da seguinte forma:
a) Sinal de R$ 48.500,00 na assinatura deste instrumento;
b) 36 parcelas mensais de R$ 3.200,00 corrigidas mensalmente pelo INCC-DI/FGV até a entrega das chaves;
c) 4 reforços semestrais de R$ 12.000,00 com vencimento a cada 6 meses;
d) Saldo devedor final a ser quitado através de financiamento bancário habitacional pela Caixa Econômica Federal.

CLÁUSULA TERCEIRA - DA TOLERÂNCIA DE ENTREGA:
A conclusão das obras está prevista para dezembro de 2027, admitindo-se tolerância improrrogável de 180 (cento e oitenta) dias úteis sem incidência de multa moratória.

CLÁUSULA QUARTA - DO DISTRATO E PENALIDADES:
Em caso de inadimplemento ou rescisão motivada pelo COMPRADOR, a VENDEDORA reterá 25% (vinte e cinco por cento) dos valores pagos a título de cláusula penal compensatória, além de despesas administrativas e comissão de corretagem integral.`,
  },
  {
    title: "Minuta Casa Térrea Alto Padrão - Bairro Michel",
    text: `COMPROMISSO DE VENDA E COMPRA DE IMÓVEL PRONTO RESIDENCIAL
CLÁUSULA 1ª: Imóvel matriculado sob nº 54.321 do 1º Ofício de Registro de Imóveis de Criciúma, livre e desembaraçado de quaisquer ônus judiciais ou extrajudiciais.
CLÁUSULA 2ª: Preço ajustado de R$ 890.000,00 à vista no ato da lavratura da escritura pública de compra e venda.
CLÁUSULA 3ª: Vendedores declaram inexistência de ações cíveis, fiscais ou trabalhistas em curso que possam convolar a alienação em fraude contra credores.
CLÁUSULA 4ª: A imissão na posse ocorrerá após a confirmação bancária da transferência e registro no cartório de imóveis competente.`,
  },
];

export default function ContractsPage() {
  const [contractTitle, setContractTitle] = React.useState(SAMPLE_CONTRACTS[0].title);
  const [contractText, setContractText] = React.useState(SAMPLE_CONTRACTS[0].text);
  const [isAuditing, setIsAuditing] = React.useState(false);
  const [auditResult, setAuditResult] = React.useState<AiAuditResult | null>(null);

  const handleAudit = async () => {
    if (!contractText.trim()) return;

    try {
      setIsAuditing(true);
      const res = await fetch("/api/crm/audit-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText, title: contractTitle }),
      });

      if (!res.ok) throw new Error("Erro na auditoria");
      const data = await res.json();
      setAuditResult(data.auditResult);
    } catch (err) {
      console.error(err);
      alert("Falha ao auditar contrato. Tente novamente.");
    } finally {
      setIsAuditing(false);
    }
  };

  const loadSample = (index: number) => {
    setContractTitle(SAMPLE_CONTRACTS[index].title);
    setContractText(SAMPLE_CONTRACTS[index].text);
    setAuditResult(null);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Auditoria Jurídica de Contratos com IA
            </h1>
            <Badge variant="default" className="text-xs">
              Gemini Jurídico Imobiliário
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Análise automatizada de minutas de compra e venda: detecção de cláusulas abusivas, checagem de certidões e validação da Lei do Distrato.
          </p>
        </div>

        <Button
          onClick={handleAudit}
          disabled={isAuditing || !contractText.trim()}
          className="rounded-full shadow-sm dark:shadow-[0_0_20px_rgba(204,255,0,0.3)] text-xs font-semibold"
        >
          {isAuditing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin mr-1.5" />
              Auditando com Gemini...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-1.5" />
              Executar Auditoria Jurídica
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Texto do Contrato & Upload (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                Minuta Contratual em Análise
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">Exemplos:</span>
                <button
                  type="button"
                  onClick={() => loadSample(0)}
                  className="px-2.5 py-0.5 rounded-full text-[11px] bg-muted hover:bg-muted/80 text-foreground border border-border cursor-pointer transition-colors"
                >
                  Planta (Ap)
                </button>
                <button
                  type="button"
                  onClick={() => loadSample(1)}
                  className="px-2.5 py-0.5 rounded-full text-[11px] bg-muted hover:bg-muted/80 text-foreground border border-border cursor-pointer transition-colors"
                >
                  Pronto (Casa)
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1 font-medium">
                  Título da Minuta / Negócio
                </label>
                <input
                  type="text"
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1 font-medium">
                  Texto Integral das Cláusulas
                </label>
                <textarea
                  rows={14}
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  placeholder="Cole aqui o texto da minuta ou arraste o PDF..."
                  className="w-full p-3.5 rounded-2xl bg-muted border border-border text-foreground font-mono text-xs leading-relaxed focus:outline-none focus:border-emerald-500 dark:focus:border-[#ccff00] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-muted-foreground">
                Suporta minutas residenciais, comerciais, lotes e promessas de cessão.
              </p>
              <Button
                onClick={handleAudit}
                disabled={isAuditing || !contractText.trim()}
                size="sm"
              >
                Auditar Agora
              </Button>
            </div>
          </Card>
        </div>

        {/* Coluna Direita: Laudo Pericial da IA (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {auditResult ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Score & Resumo */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                    Laudo Pericial de Segurança
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Score Jurídico:</span>
                    <span
                      className={`text-lg font-bold font-mono px-3 py-0.5 rounded-full ${
                        (auditResult.score || 80) >= 80
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {auditResult.score || 80}/100
                    </span>
                  </div>
                </div>

                <p className="text-xs text-foreground/90 leading-relaxed bg-muted/60 p-3.5 rounded-2xl border border-border">
                  {auditResult.summary}
                </p>
              </Card>

              {/* Alertas de Risco */}
              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  <h4>Alertas de Risco & Cláusulas Sensíveis</h4>
                </div>

                <div className="space-y-2">
                  {auditResult.risk_alerts?.map((alert, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="font-bold text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                      <span>{alert}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Certidões Obrigatórias */}
              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-[#ccff00]" />
                  <h4>Certidões e Documentos Faltantes / Exigidos</h4>
                </div>

                <div className="space-y-2 text-xs">
                  {auditResult.missing_certificates?.map((cert, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-muted/70 border border-border flex items-center gap-2.5 text-foreground/90"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        className="rounded border-border accent-emerald-600 dark:accent-[#ccff00] h-4 w-4"
                      />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Regras Financeiras */}
              <Card className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Info className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <h4>Regras Financeiras & Índices Identificados</h4>
                </div>

                <ul className="space-y-2 text-xs text-muted-foreground">
                  {auditResult.financial_rules?.map((rule, i) => (
                    <li
                      key={i}
                      className="p-2.5 rounded-xl bg-muted/40 border border-border text-foreground flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center flex flex-col items-center justify-center space-y-4 border-dashed h-full min-h-[450px]">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <FileCheck2 className="h-8 w-8 text-emerald-600 dark:text-[#ccff00]" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-bold text-foreground text-base">Nenhuma auditoria executada ainda</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Clique em "Executar Auditoria Jurídica" para enviar o texto ao Dr. Arthur (Gemini 2.5 Flash) e visualizar o parecer instantâneo de conformidade.
                </p>
              </div>
              <Button onClick={handleAudit} size="sm">
                Auditar Minuta Modelo
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
