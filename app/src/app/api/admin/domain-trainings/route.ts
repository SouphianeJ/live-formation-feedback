import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { requireString } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    requireAdmin();
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get("domainId");

    const items = await prisma.domainTraining.findMany({
      where: domainId ? { domainId } : undefined,
      include: { training: true },
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
      trainingId?: string;
    };
    const domainId = requireString(body.domainId, "domainId");
    const trainingId = requireString(body.trainingId, "trainingId");

    const item = await prisma.domainTraining.create({
      data: {
        domainId,
        trainingId,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
