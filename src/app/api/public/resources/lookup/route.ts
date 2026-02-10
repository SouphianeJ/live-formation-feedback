import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids") || "";
    const ids = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (!ids.length) {
      return NextResponse.json({ items: [] });
    }

    const items = await prisma.resource.findMany({
      where: { id: { in: ids } },
      include: { domain: true },
    });

    return NextResponse.json({
      items: items.map(
        (resource: {
          id: string;
          domainId: string;
          domain: { name: string };
          title: string;
          type: string;
        }) => ({
          id: resource.id,
          domainId: resource.domainId,
          domainName: resource.domain.name,
          title: resource.title,
          type: resource.type,
        })
      ),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
