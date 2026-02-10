import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireArray, requireString } from "@/lib/validation";
import { computeScoreSnapshot } from "@/lib/scoring";
import { sendMail } from "@/lib/email";
import { participantResultEmail } from "@/lib/templates";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
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

    const baseUrl = process.env.APP_BASE_URL || "";
    const trackedSnapshot = {
      domainScores: snapshot.domainScores,
      lowestDomains: snapshot.lowestDomains,
      recommendedTrainings: snapshot.recommendedTrainings,
      recommendedResources: snapshot.recommendedResources.map((resource) => ({
        resourceId: resource.resourceId,
        title: resource.title,
        type: resource.type,
        url: baseUrl
          ? `${baseUrl}/r/${attemptId}/resource/${resource.resourceId}`
          : `/r/${attemptId}/resource/${resource.resourceId}`,
      })),
    };

    const persistedSnapshot = {
      domainScores: snapshot.domainScores,
      lowestDomains: snapshot.lowestDomains,
      recommendedTrainings: snapshot.recommendedTrainings,
      recommendedResources: snapshot.recommendedResources.map((resource) => ({
        resourceId: resource.resourceId,
        title: resource.title,
        type: resource.type,
        url: resource.url,
      })),
    };

    const updated = await prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        status: "submitted",
        submittedAt: new Date(),
        lockedAt: new Date(),
        responses: responsesWithScore,
        scoreSnapshot: persistedSnapshot,
      },
    });

    const resultUrl = baseUrl ? `${baseUrl}/r/${updated.id}` : undefined;

    const emailContent = participantResultEmail({
      title: questionnaire.title,
      snapshot: trackedSnapshot,
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
