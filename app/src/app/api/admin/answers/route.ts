import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { requireNumber, requireString } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    requireAdmin();
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");

    const where = questionId ? { questionId } : undefined;
    const items = await prisma.answerOption.findMany({
      where,
      orderBy: [{ order: "asc" }],
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    requireAdmin();
    const body = (await request.json()) as {
      questionId?: string;
      value?: string;
      label?: string;
      score?: number;
      order?: number;
    };
    const questionId = requireString(body.questionId, "questionId");
    const value = requireString(body.value, "value");
    const label = requireString(body.label, "label");
    const score = requireNumber(body.score ?? 0, "score");
    const order = requireNumber(body.order ?? 0, "order");

    const item = await prisma.answerOption.create({
      data: {
        questionId,
        value,
        label,
        score,
        order,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
