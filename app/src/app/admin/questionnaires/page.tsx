"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";
import { QuestionnaireForm } from "@/components/admin/QuestionnaireForm";
import { QuestionnaireList } from "@/components/admin/QuestionnaireList";
import { fetchJson } from "@/lib/client";
import type { Questionnaire } from "@/lib/types";

export default function AdminQuestionnairesPage() {
  const [items, setItems] = useState<Questionnaire[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<{ items: Questionnaire[] }>("/api/admin/questionnaires")
      .then((data) => setItems(data.items))
      .catch((err) => setError((err as Error).message));
  }, []);

  return (
    <div className="stack" style={{ gap: 24 }}>
      <AdminNav />
      <AdminPageHeader
        title="Questionnaires"
        subtitle="Créez et gérez vos questionnaires diagnostiques."
      />
      {error ? <div className="alert">{error}</div> : null}
      <Card title="Nouveau questionnaire">
        <QuestionnaireForm onCreated={(item) => setItems([item, ...items])} />
      </Card>
      <Card title="Liste">
        <QuestionnaireList items={items} />
      </Card>
    </div>
  );
}
