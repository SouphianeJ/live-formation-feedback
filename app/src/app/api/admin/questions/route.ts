import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { requireNumber, requireString } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    requireAdmin();
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get("domainId");

    const where = domainId ? { domainId } : undefined;
    const items = await prisma.question.findMany({
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
      domainId?: string;
      type?: string;
      prompt?: string;
      helpText?: string;
      order?: number;
      isRequired?: boolean;
    };
    const domainId = requireString(body.domainId, "domainId");
    const prompt = requireString(body.prompt, "prompt");
    const order = requireNumber(body.order ?? 0, "order");

    const item = await prisma.question.create({
      data: {
        domainId,
        type: body.type || "single_choice",
        prompt,
        helpText: body.helpText?.trim() || null,
        order,
        isRequired: body.isRequired ?? true,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
