import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { requireString } from "@/lib/validation";

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.training.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      duration?: string;
      format?: string;
      url?: string;
    };
    const title = requireString(body.title, "title");

    const item = await prisma.training.create({
      data: {
        title,
        description: body.description?.trim() || null,
        duration: body.duration?.trim() || null,
        format: body.format?.trim() || null,
        url: body.url?.trim() || null,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
