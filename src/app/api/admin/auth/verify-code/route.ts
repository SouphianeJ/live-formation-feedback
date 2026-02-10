import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/validation";
import { createAdminJwt, isAdminEmail } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; code?: string };
    const email = (body.email || "").trim().toLowerCase();
    const code = (body.code || "").trim();

    if (!email || !code || !isValidEmail(email)) {
      return NextResponse.json({ error: "Email ou code invalide" }, { status: 400 });
    }

    if (!isAdminEmail(email)) {
      return NextResponse.json({ error: "Email non autorisé" }, { status: 403 });
    }

    const loginCode = await prisma.adminLoginCode.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!loginCode) {
      return NextResponse.json({ error: "Code expiré" }, { status: 400 });
    }

    if (loginCode.usedAt) {
      return NextResponse.json({ error: "Code déjà utilisé" }, { status: 400 });
    }

    const match = await bcrypt.compare(code, loginCode.codeHash);
    if (!match) {
      return NextResponse.json({ error: "Code invalide" }, { status: 400 });
    }

    if (loginCode.expiresAt <= new Date()) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Admin code expired", {
          email,
          expiresAt: loginCode.expiresAt,
          serverNow: new Date(),
        });
      }
      return NextResponse.json({ error: "Code expiré" }, { status: 400 });
    }

    await prisma.adminLoginCode.update({
      where: { id: loginCode.id },
      data: { usedAt: new Date() },
    });

    const token = createAdminJwt(email);
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
