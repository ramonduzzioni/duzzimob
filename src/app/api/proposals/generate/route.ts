import { NextRequest, NextResponse } from "next/server";
import { generateProposalPdf, ProposalPdfData } from "@/lib/pdf/proposal-generator";

export async function POST(req: NextRequest) {
  try {
    const data: ProposalPdfData = await req.json();

    if (!data.clientName || !data.simulation) {
      return NextResponse.json(
        { error: "Dados incompletos para geração de proposta." },
        { status: 400 }
      );
    }

    const pdfBytes = await generateProposalPdf(data);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=proposta-${data.proposalNumber || "duzzimob"}.pdf`,
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
