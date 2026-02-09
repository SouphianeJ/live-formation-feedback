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
      title?: string;
      description?: string;
      duration?: string;
      format?: string;
      url?: string;
    };
    const data: Record<string, unknown> = {};
    if (typeof body.title === "string") data.title = body.title.trim();
    if (typeof body.description === "string")
      data.description = body.description.trim();
    if (typeof body.duration === "string") data.duration = body.duration.trim();
    if (typeof body.format === "string") data.format = body.format.trim();
    if (typeof body.url === "string") data.url = body.url.trim();

    const item = await prisma.training.update({
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
    await prisma.training.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
