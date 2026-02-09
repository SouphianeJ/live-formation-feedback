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
      name?: string;
      description?: string;
      order?: number;
    };
    const data: Record<string, unknown> = {};
    if (typeof body.name === "string") data.name = body.name.trim();
    if (typeof body.description === "string")
      data.description = body.description.trim();
    if (typeof body.order === "number") data.order = body.order;

    const item = await prisma.domain.update({
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
    await prisma.domain.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
