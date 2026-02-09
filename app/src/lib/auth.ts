import jwt from "jsonwebtoken";

export type AdminJwtPayload = {
  email: string;
  role: "admin";
};

const JWT_EXPIRES_IN = "7d";

export function getAdminAllowedEmails(): string[] {
  const raw = process.env.ADMIN_ALLOWED_EMAILS || "";
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  const allowed = getAdminAllowedEmails();
  if (!allowed.length) return false;
  return allowed.includes(email.trim().toLowerCase());
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export function createAdminJwt(email: string): string {
  return jwt.sign({ email, role: "admin" } satisfies AdminJwtPayload, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyAdminJwt(token: string): AdminJwtPayload | null {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as AdminJwtPayload;
    if (payload.role !== "admin" || !payload.email) return null;
    if (!isAdminEmail(payload.email)) return null;
    return payload;
  } catch {
    return null;
  }
}
