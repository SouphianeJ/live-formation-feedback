import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();
    const item = await prisma.questionnaire.findUnique({
      where: { id },
    });
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      status?: string;
      slug?: string;
    };

    const data: Record<string, unknown> = {};
    if (typeof body.title === "string") {
      data.title = body.title.trim();
      data.slug = slugify(body.slug || body.title);
    }
    if (typeof body.description === "string") {
      data.description = body.description.trim();
    }
    if (typeof body.status === "string") {
      data.status = body.status;
    }
    if (typeof body.slug === "string") {
      data.slug = slugify(body.slug);
    }

    const item = await prisma.questionnaire.update({
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
    await prisma.questionnaire.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
