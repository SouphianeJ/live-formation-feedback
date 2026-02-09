import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { requireNumber, requireString } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    requireAdmin();
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get("domainId");

    const where = domainId ? { domainId } : undefined;
    const items = await prisma.resource.findMany({
      where,
      orderBy: [{ order: "asc" }],
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
      title?: string;
      type?: string;
      url?: string;
      order?: number;
    };
    const domainId = requireString(body.domainId, "domainId");
    const title = requireString(body.title, "title");
    const type = requireString(body.type, "type");
    const url = requireString(body.url, "url");
    const order = requireNumber(body.order ?? 0, "order");

    const item = await prisma.resource.create({
      data: {
        domainId,
        title,
        type,
        url,
        order,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
