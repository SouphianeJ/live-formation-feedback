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
      type?: string;
      url?: string;
      order?: number;
    };
    const data: Record<string, unknown> = {};
    if (typeof body.title === "string") data.title = body.title.trim();
    if (typeof body.type === "string") data.type = body.type.trim();
    if (typeof body.url === "string") data.url = body.url.trim();
    if (typeof body.order === "number") data.order = body.order;

    const item = await prisma.resource.update({
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
    await prisma.resource.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
