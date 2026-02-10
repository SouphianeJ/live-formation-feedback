import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const nextCount = (resource.clickCount ?? 0) + 1;
    await prisma.resource.update({
      where: { id: resource.id },
      data: { clickCount: nextCount },
    });

    return NextResponse.redirect(resource.url, 302);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
