"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchJson } from "@/lib/client";

export default function AdminLoginPage() {
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
      setStatus("Code envoyé. Vérifiez votre email.");
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
          <a href="/admin/verify" className="badge">
            J'ai un code
          </a>
        </div>
      </Card>
    </div>
  );
}
