import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();
    const body = (await request.json()) as {
      value?: string;
      label?: string;
      score?: number;
      order?: number;
    };
    const data: Record<string, unknown> = {};
    if (typeof body.value === "string") data.value = body.value.trim();
    if (typeof body.label === "string") data.label = body.label.trim();
    if (typeof body.score === "number") data.score = body.score;
    if (typeof body.order === "number") data.order = body.order;

    const item = await prisma.answerOption.update({
      where: { id },
      data,
    });
    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();
    await prisma.answerOption.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
