import { cookies } from "next/headers";
import { verifyAdminJwt } from "@/lib/auth";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) {
    throw new Error("Unauthorized");
  }
  const payload = verifyAdminJwt(token);
  if (!payload) {
    throw new Error("Unauthorized");
  }
  return payload;
}
