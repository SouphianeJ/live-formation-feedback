import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidEmail, requireString } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      questionnaireId?: string;
    };
    const email = requireString(body.email, "email").toLowerCase();
    const questionnaireId = requireString(body.questionnaireId, "questionnaireId");

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
    });

    if (!questionnaire || questionnaire.status !== "published") {
      return NextResponse.json({ error: "Questionnaire indisponible" }, { status: 404 });
    }

    const attempt = await prisma.attempt.create({
      data: {
        questionnaireId,
        email,
        status: "in_progress",
      },
    });

    return NextResponse.json({ item: attempt });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
