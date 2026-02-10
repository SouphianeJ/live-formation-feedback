"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { AdminField } from "@/components/admin/AdminField";
import { fetchJson } from "@/lib/client";
import type { Questionnaire } from "@/lib/types";

function buildQuestionnaireUrl(slug: string) {
  const base =
    (typeof window !== "undefined" && window.location?.origin) || "";
  if (!base) return `/q/${slug}`;
  return `${base}/q/${slug}`;
}

export function QuestionnaireSettings({
  questionnaire,
  onUpdated,
}: {
  questionnaire: Questionnaire;
  onUpdated: (item: Questionnaire) => void;
}) {
  const [title, setTitle] = useState(questionnaire.title);
  const [description, setDescription] = useState(questionnaire.description || "");
  const [status, setStatus] = useState(questionnaire.status);
  const [slug, setSlug] = useState(questionnaire.slug);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson<{ item: Questionnaire }>(
        `/api/admin/questionnaires/${questionnaire.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, status, slug }),
        }
      );
      onUpdated(data.item);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const url = buildQuestionnaireUrl(slug);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="stack">
      <AdminField label="Titre">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
      </AdminField>
      <AdminField label="Description">
        <Input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </AdminField>
      <AdminField label="Slug">
        <Input value={slug} onChange={(event) => setSlug(event.target.value)} />
      </AdminField>
      <AdminField label="Statut">
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="archived">archived</option>
        </Select>
      </AdminField>
      <div className="row mobile-stack tight">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
        <a href={`/q/${slug}`} className="btn secondary" target="_blank" rel="noreferrer">
          Répondre au questionnaire
        </a>
        <Button variant="secondary" onClick={handleCopy}>
          {copied ? "Copié" : "Copier l'URL"}
        </Button>
      </div>
      {error ? <div className="alert">{error}</div> : null}
    </div>
  );
}

