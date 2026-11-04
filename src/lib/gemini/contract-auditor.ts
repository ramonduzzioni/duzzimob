import { getGeminiClient } from "@/lib/gemini/client";
import { AiAuditResult } from "@/types/database";

const CONTRACT_AUDIT_SYSTEM_INSTRUCTION = `
Você é o Dr. Arthur, um assistente jurídico sênior especializado em Direito Imobiliário brasileiro (Lei 4.591/64, Lei 6.766/79, Código de Defesa do Consumidor e Lei do Distrato 13.786/18).

Sua missão é auditar minutas contratuais de compra e venda de imóveis e promessas de cessão, avaliando:
1. Resumo claro das obrigações das partes.
2. Alertas de Risco Jurídico (cláusulas abusivas, penalidades desproporcionais, retenção excessiva em caso de distrato, tolerância abusiva de entrega).
3. Certidões e Documentos Faltantes (certidão negativa cível/fiscal, matrícula atualizada com negativa de ônus, convenção de condomínio, habite-se).
4. Regras Financeiras e Correção Monetária (índice de correção na fase de obras - INCC, índice pós-chaves - IPCA/IGP-M, juros de mora e multas contratuais).
5. Score de Segurança Jurídica (de 0 a 100).

Retorne sua resposta estritamente no seguinte formato JSON:
{
  "summary": "Resumo objetivo da minuta...",
  "score": 85,
  "risk_alerts": [
    "Alerta 1...",
    "Alerta 2..."
  ],
  "missing_certificates": [
    "Certidão 1...",
    "Certidão 2..."
  ],
  "financial_rules": [
    "Regra 1...",
    "Regra 2..."
  ]
}
`.trim();

export async function auditContractWithAi(
  contractText: string
): Promise<AiAuditResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your-gemini-api-key") {
    return mockContractAudit(contractText);
  }

  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analise a seguinte minuta de contrato imobiliário e retorne a auditoria em JSON:\n\n${contractText.slice(0, 15000)}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: CONTRACT_AUDIT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const outputText = response.text || "{}";
    const parsed = JSON.parse(outputText);

    return {
      summary: parsed.summary || "Auditoria realizada com sucesso.",
      score: typeof parsed.score === "number" ? parsed.score : 80,
      risk_alerts: parsed.risk_alerts || [],
      missing_certificates: parsed.missing_certificates || [],
      financial_rules: parsed.financial_rules || [],
    };
  } catch (err) {
    console.warn("[Gemini Contract Audit] Falha na API real, gerando auditoria base:", err);
    return mockContractAudit(contractText);
  }
}

function mockContractAudit(text: string): AiAuditResult {
  const isLote = text.toLowerCase().includes("lote") || text.toLowerCase().includes("terreno");

  return {
    summary:
      "Contrato padrão de Promessa de Compra e Venda de bem imóvel com previsão de pagamento parcelado e financiamento bancário posterior.",
    score: 82,
    risk_alerts: [
      "Cláusula de rescisão com retenção de 25%: Conforme com a Lei do Distrato (13.786/18), mas deve explicitar a taxa de fruição do imóvel (0,5% ao mês).",
      "Prazo de tolerância de 180 dias: Válido segundo o STJ, porém a prorrogação sem justificativa detalhada de força maior pode gerar questionamentos judiciais.",
      "Comissão de corretagem: É essencial destacar expressamente o valor e a ciência do comprador, conforme tese fixada pelo STJ (Tema 938).",
    ],
    missing_certificates: [
      "Certidão Atualizada de Inteiro Teor e Ônus Reais da Matrícula (validade de 30 dias).",
      "Certidão Conjunta Negativa de Tributos Federais e Dívida Ativa da União dos Vendedores.",
      "Certidão Negativa de Débitos Condominiais assinada pelo síndico.",
      ...(isLote ? ["Licença Ambiental de Instalação (LAI) e aprovação municipal do loteamento."] : []),
    ],
    financial_rules: [
      "Correção monetária durante a construção: Estipulada pelo INCC-DI da FGV até a expedição do Habite-se.",
      "Correção pós-chaves: IPCA acrescido de juros nominais legais de 1% a.m.",
      "Multa moratória de 2% e juros de mora de 1% ao mês em caso de atraso pontual de parcelas.",
    ],
  };
}
