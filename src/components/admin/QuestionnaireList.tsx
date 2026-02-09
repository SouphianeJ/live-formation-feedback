"use client";

import type { Questionnaire } from "@/lib/types";
import { Table } from "@/components/ui/Table";

export function QuestionnaireList({ items }: { items: Questionnaire[] }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Titre</th>
          <th>Statut</th>
          <th>Slug</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.status}</td>
            <td>{item.slug}</td>
            <td>
              <a href={`/admin/questionnaires/${item.id}`} className="badge">
                Ouvrir
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
