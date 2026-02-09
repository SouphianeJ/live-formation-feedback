import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { slug: params.slug },
      include: {
        domains: {
          orderBy: { order: "asc" },
          include: {
            questions: {
              orderBy: { order: "asc" },
              include: { answers: { orderBy: { order: "asc" } } },
            },
            resources: { orderBy: { order: "asc" } },
            domainTrainings: { include: { training: true } },
          },
        },
      },
    });

    if (!questionnaire || questionnaire.status !== "published") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ item: questionnaire });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
