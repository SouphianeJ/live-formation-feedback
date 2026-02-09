import { cookies } from "next/headers";
import { verifyAdminJwt } from "@/lib/auth";

export function requireAdmin() {
  const token = cookies().get("admin_token")?.value;
  if (!token) {
    throw new Error("Unauthorized");
  }
  const payload = verifyAdminJwt(token);
  if (!payload) {
    throw new Error("Unauthorized");
  }
  return payload;
}
