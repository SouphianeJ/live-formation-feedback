import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { requireNumber, requireString } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    requireAdmin();
    const { searchParams } = new URL(request.url);
    const questionnaireId = searchParams.get("questionnaireId");

    const where = questionnaireId ? { questionnaireId } : undefined;
    const items = await prisma.domain.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
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
      questionnaireId?: string;
      name?: string;
      description?: string;
      order?: number;
    };
    const questionnaireId = requireString(body.questionnaireId, "questionnaireId");
    const name = requireString(body.name, "name");
    const order = requireNumber(body.order ?? 0, "order");

    const item = await prisma.domain.create({
      data: {
        questionnaireId,
        name,
        description: body.description?.trim() || null,
        order,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
