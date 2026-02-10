"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchJson } from "@/lib/client";

function AdminVerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get("email") || "";
    const fromStorage = localStorage.getItem("admin_login_email") || "";
    const nextEmail = (fromQuery || fromStorage).trim().toLowerCase();
    if (nextEmail) {
      setEmail(nextEmail);
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    setLoading(true);
    setStatus(null);
    try {
      await fetchJson("/api/admin/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      router.push("/admin/questionnaires");
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <Card title="Vérification">
        <div className="stack">
          <label className="stack" style={{ gap: 6 }}>
            <span className="label">Email</span>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="stack" style={{ gap: 6 }}>
            <span className="label">Code</span>
            <Input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </label>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Vérification..." : "Valider"}
          </Button>
          {status ? <div className="alert">{status}</div> : null}
        </div>
      </Card>
    </div>
  );
}

export default function AdminVerifyPage() {
  return (
    <Suspense fallback={<div className="alert">Chargement...</div>}>
      <AdminVerifyForm />
    </Suspense>
  );
}
