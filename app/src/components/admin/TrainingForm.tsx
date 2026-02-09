"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AdminField } from "@/components/admin/AdminField";
import { fetchJson } from "@/lib/client";

export type TrainingItem = {
  id: string;
  title: string;
  description?: string | null;
  duration?: string | null;
  format?: string | null;
  url?: string | null;
};

export function TrainingForm({ onCreated }: { onCreated: (item: TrainingItem) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [format, setFormat] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson<{ item: TrainingItem }>("/api/admin/trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, duration, format, url }),
      });
      onCreated(data.item);
      setTitle("");
      setDescription("");
      setDuration("");
      setFormat("");
      setUrl("");
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
        <Input value={description} onChange={(event) => setDescription(event.target.value)} />
      </AdminField>
      <AdminField label="Durée">
        <Input value={duration} onChange={(event) => setDuration(event.target.value)} />
      </AdminField>
      <AdminField label="Format">
        <Input value={format} onChange={(event) => setFormat(event.target.value)} />
      </AdminField>
      <AdminField label="URL">
        <Input value={url} onChange={(event) => setUrl(event.target.value)} />
      </AdminField>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Création..." : "Créer"}
      </Button>
      {error ? <div className="alert">{error}</div> : null}
    </div>
  );
}
