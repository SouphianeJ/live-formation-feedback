"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { AdminField } from "@/components/admin/AdminField";
import { fetchJson } from "@/lib/client";
import type { Questionnaire } from "@/lib/types";

export function QuestionnaireForm({ onCreated }: { onCreated: (item: Questionnaire) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson<{ item: Questionnaire }>(
        "/api/admin/questionnaires",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, status }),
        }
      );
      onCreated(data.item);
      setTitle("");
      setDescription("");
      setStatus("draft");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
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
      <AdminField label="Statut">
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="archived">archived</option>
        </Select>
      </AdminField>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Création..." : "Créer"}
      </Button>
      {error ? <div className="alert">{error}</div> : null}
    </div>
  );
}
