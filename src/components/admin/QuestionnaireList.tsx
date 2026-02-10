"use client";

import type { Questionnaire } from "@/lib/types";
import { useState } from "react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

function buildQuestionnaireUrl(slug: string) {
  const base =
    (typeof window !== "undefined" && window.location?.origin) || "";
  if (!base) return `/q/${slug}`;
  return `${base}/q/${slug}`;
}

export function QuestionnaireList({ items }: { items: Questionnaire[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (item: Questionnaire) => {
    const url = buildQuestionnaireUrl(item.slug);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback for restricted clipboard access
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
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1200);
  };

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
              <div className="row mobile-stack tight">
                <a href={`/admin/questionnaires/${item.id}`} className="btn secondary">
                  Editer le questionnaire
                </a>
                <a href={`/q/${item.slug}`} className="btn secondary" target="_blank" rel="noreferrer">
                  RÃ©pondre au questionnaire
                </a>
                <Button
                  variant="secondary"
                  onClick={() => handleCopy(item)}
                  aria-label={`Copier l'URL du questionnaire ${item.title}`}
                >
                  {copiedId === item.id ? "CopiÃ©" : "Copier l'URL"}
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

