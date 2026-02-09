import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArray, requireString } from "@/lib/validation";
import { computeScoreSnapshot } from "@/lib/scoring";
import { sendMail } from "@/lib/email";
import { participantResultEmail } from "@/lib/templates";

export async function POST(
  request: Request,
  { params }: { params: { attemptId: string } }
) {
  try {
    const attempt = await prisma.attempt.findUnique({
      where: { id: params.attemptId },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Tentative introuvable" }, { status: 404 });
    }

    if (attempt.lockedAt) {
      return NextResponse.json({ error: "Tentative verrouillée" }, { status: 409 });
    }

    const body = (await request.json()) as {
      responses?: { questionId?: string; answerId?: string }[];
    };
    const responsesInput = requireArray<{ questionId?: string; answerId?: string }>(
      body.responses,
      "responses"
    );

    const responses = responsesInput.map((response) => ({
      questionId: requireString(response.questionId, "questionId"),
      answerId: requireString(response.answerId, "answerId"),
    }));

    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id: attempt.questionnaireId },
      include: {
        domains: {
          include: {
            questions: {
              include: { answers: true },
            },
            resources: true,
            domainTrainings: { include: { training: true } },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!questionnaire) {
      return NextResponse.json({ error: "Questionnaire indisponible" }, { status: 404 });
    }

    const { responsesWithScore, snapshot } = computeScoreSnapshot({
      domains: questionnaire.domains,
      responses,
    });

    const updated = await prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        status: "submitted",
        submittedAt: new Date(),
        lockedAt: new Date(),
        responses: responsesWithScore,
        scoreSnapshot: snapshot,
      },
    });

    const baseUrl = process.env.APP_BASE_URL || "";
    const resultUrl = baseUrl ? `${baseUrl}/r/${updated.id}` : undefined;

    const emailContent = participantResultEmail({
      title: questionnaire.title,
      snapshot,
      resultUrl,
    });
    await sendMail({
      to: updated.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
