import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();
    await prisma.domainTraining.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
