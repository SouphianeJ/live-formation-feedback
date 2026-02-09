import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();
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
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();
    await prisma.answerOption.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
