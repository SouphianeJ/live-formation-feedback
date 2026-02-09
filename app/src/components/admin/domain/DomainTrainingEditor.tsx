"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { fetchJson } from "@/lib/client";
import type { TrainingItem } from "@/components/admin/TrainingForm";

export type DomainTrainingItem = {
  id: string;
  training: TrainingItem;
};

export function DomainTrainingEditor({
  domainId,
  trainings,
  links,
  onUpdated,
}: {
  domainId: string;
  trainings: TrainingItem[];
  links: DomainTrainingItem[];
  onUpdated: (items: DomainTrainingItem[]) => void;
}) {
  const [selected, setSelected] = useState(trainings[0]?.id || "");

  const handleAdd = async () => {
    if (!selected) return;
    const data = await fetchJson<{ item: { id: string } }>("/api/admin/domain-trainings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainId, trainingId: selected }),
    });

    const training = trainings.find((item) => item.id === selected);
    if (!training) return;
    onUpdated([...links, { id: data.item.id, training }]);
  };

  const handleDelete = async (id: string) => {
    await fetchJson(`/api/admin/domain-trainings/${id}`, { method: "DELETE" });
    onUpdated(links.filter((link) => link.id !== id));
  };

  return (
    <div className="stack">
      <div className="row">
        <Select value={selected} onChange={(event) => setSelected(event.target.value)}>
          {trainings.map((training) => (
            <option key={training.id} value={training.id}>
              {training.title}
            </option>
          ))}
        </Select>
        <Button variant="secondary" onClick={handleAdd}>
          Associer
        </Button>
      </div>
      <div className="stack">
        {links.map((link) => (
          <div key={link.id} className="row" style={{ justifyContent: "space-between" }}>
            <span>{link.training.title}</span>
            <Button variant="danger" onClick={() => handleDelete(link.id)}>
              Retirer
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
