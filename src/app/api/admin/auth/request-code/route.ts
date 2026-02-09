import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/validation";
import { isAdminEmail } from "@/lib/auth";
import { hasMailConfig, sendMail } from "@/lib/email";
import { adminCodeEmail } from "@/lib/templates";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    let body: { email?: string } = {};
    try {
      body = (await request.json()) as { email?: string };
    } catch {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    if (!isAdminEmail(email)) {
      return NextResponse.json({ error: "Email non autorisé" }, { status: 403 });
    }

    if (!hasMailConfig()) {
      return NextResponse.json(
        { error: "Configuration email manquante" },
        { status: 503 },
      );
    }

    const code = generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.adminLoginCode.create({
      data: {
        email,
        codeHash,
        expiresAt,
      },
    });

    const emailContent = adminCodeEmail(code);
    await sendMail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
