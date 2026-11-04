import { NextRequest, NextResponse } from "next/server";
import { auditContractWithAi } from "@/lib/gemini/contract-auditor";

export async function POST(req: NextRequest) {
  try {
    const { contractText, title } = await req.json();

    if (!contractText || contractText.trim().length < 20) {
      return NextResponse.json(
        { error: "O texto do contrato é muito curto ou inválido para auditoria." },
        { status: 400 }
      );
    }

    const auditResult = await auditContractWithAi(contractText);

    return NextResponse.json({
      title: title || "Minuta Contratual",
      auditResult,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
