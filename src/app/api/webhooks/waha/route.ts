import { NextRequest, NextResponse } from "next/server";
import { processLeadMessageWithAi } from "@/lib/waha/ai-handler";
import { wahaClient } from "@/lib/waha/client";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Eventos típicos do WAHA: "message" ou "message.any"
    const event = payload.event;
    const messageData = payload.payload;

    if (!messageData || messageData.fromMe) {
      // Ignora mensagens enviadas pelo próprio robô/corretor
      return NextResponse.json({ status: "ignored" });
    }

    const chatId = messageData.from; // ex: 554899999999@c.us
    const text = messageData.body || "";

    if (!text.trim()) {
      return NextResponse.json({ status: "no_text" });
    }

    console.log(`[WAHA Webhook] Mensagem recebida de ${chatId}: "${text}"`);

    // Processa a resposta com a IA autônoma (Gemini)
    const aiResult = await processLeadMessageWithAi(text);

    // Envia resposta automática pelo WhatsApp se houver texto gerado
    if (aiResult.replyText) {
      await wahaClient.sendTextMessage(chatId, aiResult.replyText);
    }

    return NextResponse.json({
      status: "success",
      reply: aiResult.replyText,
      tokensUsed: (aiResult.promptTokens || 0) + (aiResult.completionTokens || 0),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("[WAHA Webhook] Erro ao processar webhook:", err);
    return NextResponse.json(
      { error: "Erro interno no processamento do webhook", details: errorMessage },
      { status: 500 }
    );
  }
}
