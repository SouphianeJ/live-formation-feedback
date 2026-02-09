"use client";

import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import type { TrainingItem } from "@/components/admin/TrainingForm";

export function TrainingList({
  items,
  onDelete,
}: {
  items: TrainingItem[];
  onDelete: (id: string) => void;
}) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Titre</th>
          <th>Durée</th>
          <th>Format</th>
          <th>URL</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.duration || "-"}</td>
            <td>{item.format || "-"}</td>
            <td>{item.url || "-"}</td>
            <td>
              <Button variant="danger" onClick={() => onDelete(item.id)}>
                Supprimer
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
