"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchJson } from "@/lib/client";

export default function HomePage() {
  const [slug, setSlug] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchJson<{ ok: boolean }>("/api/admin/me")
      .then((res) => setIsAdmin(Boolean(res.ok)))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <div className="stack" style={{ gap: 24 }}>
      <Card title="Live Formation Feedback">
        <p className="subtitle">
          Plateforme de questionnaires diagnostiques avec scoring par domaines et
          recommandations.
        </p>
      </Card>
      <Card title="Accéder à un questionnaire">
        <div className="stack">
          <Input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="Slug du questionnaire"
          />
          <Button onClick={() => (window.location.href = `/q/${slug}`)}>
            Ouvrir
          </Button>
        </div>
      </Card>
      <Card title="Espace admin">
        <div className="row" style={{ gap: 12 }}>
          
          {isAdmin ? (
            <a href="/admin/questionnaires" className="badge">
              Accéder à l'admin
            </a>
           ) : (
            <a href="/admin/login" className="badge">
              Se connecter
            </a>
          )}
        </div>
      </Card>
    </div>
  );
}
