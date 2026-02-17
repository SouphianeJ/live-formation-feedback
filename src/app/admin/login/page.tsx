"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchJson } from "@/lib/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setStatus(null);
    try {
      await fetchJson("/api/admin/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const normalized = email.trim().toLowerCase();
      if (normalized) {
        localStorage.setItem("admin_login_email", normalized);
      }
      setStatus("Code envoyé. Vérifiez votre email.");
      router.push(`/admin/verify?email=${encodeURIComponent(normalized)}`);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <Card title="Connexion admin">
        <div className="stack">
          <label className="stack" style={{ gap: 6 }}>
            <span className="label">Email</span>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Envoi..." : "Recevoir un code"}
          </Button>
          {status ? <div className="alert">{status}</div> : null}
          <Link href="/admin/verify" className="badge">
            J'ai un code
          </Link>
        </div>
      </Card>
    </div>
  );
}
