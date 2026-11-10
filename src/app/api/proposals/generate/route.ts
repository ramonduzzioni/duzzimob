import { NextRequest, NextResponse } from "next/server";
import { generateProposalPdf, ProposalPdfData } from "@/lib/pdf/proposal-generator";

export async function POST(req: NextRequest) {
  try {
    const data: ProposalPdfData = await req.json();

    const client = data.compradorNome || data.clientName;
    if (!client) {
      return NextResponse.json(
        { error: "Nome do comprador/proponente é obrigatório." },
        { status: 400 }
      );
    }

    const pdfBytes = await generateProposalPdf(data);

    const safeName = client
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    const filenameSuffix = data.isEditable ? "-editavel" : "";

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=proposta-${safeName}${filenameSuffix}.pdf`,
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("Erro na geração do PDF:", err);
    return NextResponse.json(
      { error: "Falha ao gerar o PDF da proposta.", details: errorMessage },
      { status: 500 }
    );
  }
}
