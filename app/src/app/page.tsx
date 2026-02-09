"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const [slug, setSlug] = useState("");

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
        <a href="/admin/login" className="badge">
          Se connecter
        </a>
      </Card>
    </div>
  );
}
