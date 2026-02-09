import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: { questionnaire: true },
    });

    if (!attempt || !attempt.scoreSnapshot) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      item: {
        id: attempt.id,
        email: attempt.email,
        submittedAt: attempt.submittedAt,
        questionnaireTitle: attempt.questionnaire.title,
        scoreSnapshot: attempt.scoreSnapshot,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
