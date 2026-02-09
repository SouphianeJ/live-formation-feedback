import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { requireString } from "@/lib/validation";
import { slugify } from "@/lib/slug";

export async function GET() {
  try {
    requireAdmin();
    const items = await prisma.questionnaire.findMany({
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
    requireAdmin();
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      status?: string;
    };
    const title = requireString(body.title, "title");
    const status = body.status || "draft";
    const slug = slugify(title);

    const created = await prisma.questionnaire.create({
      data: {
        title,
        description: body.description?.trim() || null,
        status,
        slug,
      },
    });

    return NextResponse.json({ item: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
