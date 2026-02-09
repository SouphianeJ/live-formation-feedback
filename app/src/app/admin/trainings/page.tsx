"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";
import { TrainingForm, type TrainingItem } from "@/components/admin/TrainingForm";
import { TrainingList } from "@/components/admin/TrainingList";
import { fetchJson } from "@/lib/client";

export default function AdminTrainingsPage() {
  const [items, setItems] = useState<TrainingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<{ items: TrainingItem[] }>("/api/admin/trainings")
      .then((data) => setItems(data.items))
      .catch((err) => setError((err as Error).message));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetchJson(`/api/admin/trainings/${id}`, { method: "DELETE" });
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <AdminNav />
      <AdminPageHeader title="Formations" subtitle="Catalogue de recommandations." />
      {error ? <div className="alert">{error}</div> : null}
      <Card title="Nouvelle formation">
        <TrainingForm onCreated={(item) => setItems([item, ...items])} />
      </Card>
      <Card title="Liste">
        <TrainingList items={items} onDelete={handleDelete} />
      </Card>
    </div>
  );
}
