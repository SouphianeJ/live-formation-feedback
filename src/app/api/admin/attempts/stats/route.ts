import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const questionnaireId = searchParams.get("questionnaireId");

    if (!questionnaireId) {
      return NextResponse.json({ error: "questionnaireId requis" }, { status: 400 });
    }

    const total = await prisma.attempt.count({
      where: { questionnaireId },
    });
    const submitted = await prisma.attempt.count({
      where: { questionnaireId, status: "submitted" },
    });

    const completionRate = total > 0 ? (submitted / total) * 100 : 0;

    return NextResponse.json({
      total,
      submitted,
      completionRate,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
