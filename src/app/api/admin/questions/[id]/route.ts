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
      type?: string;
      prompt?: string;
      helpText?: string;
      order?: number;
      isRequired?: boolean;
    };
    const data: Record<string, unknown> = {};
    if (typeof body.type === "string") data.type = body.type;
    if (typeof body.prompt === "string") data.prompt = body.prompt.trim();
    if (typeof body.helpText === "string") data.helpText = body.helpText.trim();
    if (typeof body.order === "number") data.order = body.order;
    if (typeof body.isRequired === "boolean") data.isRequired = body.isRequired;

    const item = await prisma.question.update({
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
    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
