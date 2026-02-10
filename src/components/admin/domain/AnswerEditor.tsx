"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchJson } from "@/lib/client";

export type AnswerItem = {
  id: string;
  value: string;
  label: string;
  score: number;
  order: number;
};

export function AnswerEditor({
  answer,
  onUpdated,
  onDeleted,
}: {
  answer: AnswerItem;
  onUpdated: (answer: AnswerItem) => void;
  onDeleted: (id: string) => void;
}) {
  const [value, setValue] = useState(answer.value);
  const [label, setLabel] = useState(answer.label);
  const [score, setScore] = useState(answer.score);
  const [order, setOrder] = useState(answer.order);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const data = await fetchJson<{ item: AnswerItem }>(`/api/admin/answers/${answer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value, label, score, order }),
    });
    onUpdated(data.item);
    setLoading(false);
  };

  const handleDelete = async () => {
    await fetchJson(`/api/admin/answers/${answer.id}`, { method: "DELETE" });
    onDeleted(answer.id);
  };

  return (
    <div className="card" style={{ padding: "12px" }}>
      <div className="row">
        <label className="stack" style={{ gap: 6 }}>
          <span className="label">Valeur</span>
          <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder="A" />
        </label>
        <label className="stack" style={{ gap: 6 }}>
          <span className="label">Libellé</span>
          <Input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Label" />
        </label>
      </div>
      <div className="row">
        <label className="stack" style={{ gap: 6 }}>
          <span className="label">Score</span>
          <Input
            type="number"
            value={score}
            onChange={(event) => setScore(Number(event.target.value))}
            placeholder="Score"
          />
        </label>
        <label className="stack" style={{ gap: 6 }}>
          <span className="label">Ordre</span>
          <Input
            type="number"
            value={order}
            onChange={(event) => setOrder(Number(event.target.value))}
            placeholder="Ordre"
          />
        </label>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "..." : "Sauver"}
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Supprimer
        </Button>
      </div>
    </div>
  );
}
