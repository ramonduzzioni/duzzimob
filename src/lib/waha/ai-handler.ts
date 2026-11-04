import { getGeminiClient } from "@/lib/gemini/client";

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

const DUZZIMOB_SYSTEM_PROMPT = `
Você é a Sofia, consultora de atendimento inteligente do DUZZIMOB (escritório imobiliário de alta performance).
Seu objetivo principal é qualificar potenciais compradores com simpatia, agilidade e persuasão profissional no WhatsApp.

Diretrizes de Atendimento:
1. Saudação inicial calorosa e direta (máximo 2 a 3 frases por mensagem, estilo WhatsApp humano).
2. Descubra os pontos-chave de compra:
   - Tipo de imóvel (Apartamento, Casa, Terreno ou Lançamento).
   - Bairros de preferência (Ex: Centro, Michel, Pio Corrêa, Próspera, Comerciário, etc.).
   - Faixa de valor pretendida ou renda familiar aproximada para simulação Caixa.
   - Prazo pretendido de mudança (imediato ou na planta).
3. Nunca invente dados técnicos que não tenha certeza; convide para agendar uma visita presencial ou simulação com o corretor responsável.
4. Mantenha tom amigável, confiável e consultivo. Use emojis de forma moderada.
`.trim();

export interface AiQualificationResult {
  replyText: string;
  detectedData?: {
    propertyType?: string;
    budget?: number;
    neighborhood?: string;
    income?: number;
  };
  promptTokens?: number;
  completionTokens?: number;
}

export async function processLeadMessageWithAi(
  userMessage: string,
  history: ChatMessage[] = []
): Promise<AiQualificationResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Se a chave não estiver configurada ou for placeholder, responda com qualificador inteligente
  if (!apiKey || apiKey === "your-gemini-api-key") {
    return mockIntelligentReply(userMessage);
  }

  try {
    const ai = getGeminiClient();

    // Formata o histórico no formato esperado pelo Gemini
    const contents = [
      ...history.map((msg) => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: DUZZIMOB_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Olá! Como posso te ajudar na busca do seu novo imóvel hoje?";
    const usage = response.usageMetadata;

    return {
      replyText,
      promptTokens: usage?.promptTokenCount || 0,
      completionTokens: usage?.candidatesTokenCount || 0,
    };
  } catch (err) {
    console.warn("[Gemini AI] Erro ao chamar API real, usando resposta de contingência:", err);
    return mockIntelligentReply(userMessage);
  }
}

function mockIntelligentReply(userMessage: string): AiQualificationResult {
  const lower = userMessage.toLowerCase();

  if (lower.includes("olá") || lower.includes("oi") || lower.includes("bom dia") || lower.includes("boa tarde")) {
    return {
      replyText:
        "Olá! Tudo bem? Me chamo Sofia, consultora do DUZZIMOB. 🏡 Que excelente ter seu contato! Você está buscando um apartamento, casa ou investimento em lançamento na região?",
    };
  }

  if (lower.includes("apartamento") || lower.includes("casa") || lower.includes("terreno") || lower.includes("preço") || lower.includes("valor")) {
    return {
      replyText:
        "Perfeito! Temos opções incríveis prontas e em construção nos melhores bairros (Centro, Michel, Pio Corrêa). Qual faixa de valor você tem em mente para essa aquisição?",
    };
  }

  if (lower.includes("financiamento") || lower.includes("caixa") || lower.includes("simular") || lower.includes("renda")) {
    return {
      replyText:
        "Trabalhamos com financiamento direto pela Caixa (SAC/PRICE) e planos facilitados com a construtora! Para calcularmos sua entrada exata e primeira parcela, qual é a renda bruta aproximada da família?",
    };
  }

  return {
    replyText:
      "Entendido! Estou registrando seu perfil no nosso sistema. O que acha de agendarmos uma visita rápida para você conhecer de perto essa oportunidade?",
  };
}
