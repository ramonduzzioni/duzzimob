import { NextRequest, NextResponse } from "next/server";
import { processLeadMessageWithAi, ChatMessage } from "@/lib/waha/ai-handler";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = (await req.json()) as {
      message: string;
      history: ChatMessage[];
    };

    if (!message) {
      return NextResponse.json({ error: "Mensagem obrigatória" }, { status: 400 });
    }

    const result = await processLeadMessageWithAi(message, history || []);

    return NextResponse.json({
      reply: result.replyText,
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
