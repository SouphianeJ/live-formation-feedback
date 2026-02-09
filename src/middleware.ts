import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicAdminPaths = new Set([
  "/admin/login",
  "/admin/verify",
  "/api/admin/auth/request-code",
  "/api/admin/auth/verify-code",
]);

function getAllowedEmails(): string[] {
  const raw = process.env.ADMIN_ALLOWED_EMAILS || "";
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicAdminPaths.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = getJwtSecret();
  if (!secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const email = String(payload.email || "").toLowerCase();
    const role = String(payload.role || "");
    const allowed = getAllowedEmails();

    if (role !== "admin" || !email || !allowed.includes(email)) {
      throw new Error("Invalid token");
    }
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
