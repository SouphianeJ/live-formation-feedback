"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QuestionnaireSettings } from "@/components/admin/QuestionnaireSettings";
import { DomainEditor, type DomainItem } from "@/components/admin/domain/DomainEditor";
import { fetchJson } from "@/lib/client";
import { loadDomains, loadQuestionnaire, loadTrainings } from "@/lib/admin-client";
import type { Questionnaire } from "@/lib/types";
import type { TrainingItem } from "@/components/admin/TrainingForm";

export default function AdminQuestionnaireDetailPage() {
  const params = useParams<{ id: string }>();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    total: number;
    submitted: number;
    completionRate: number;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [questionnaireData, domainData, trainingData] = await Promise.all([
          loadQuestionnaire(params.id),
          loadDomains(params.id),
          loadTrainings(),
        ]);
        setQuestionnaire(questionnaireData);
        setDomains(domainData);
        setTrainings(trainingData);
        const statsData = await fetchJson<{
          total: number;
          submitted: number;
          completionRate: number;
        }>(`/api/admin/attempts/stats?questionnaireId=${params.id}`);
        setStats(statsData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  const handleAddDomain = async () => {
    if (!questionnaire) return;
    const data = await fetchJson<{ item: DomainItem }>("/api/admin/domains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionnaireId: questionnaire.id,
        name: "Nouveau domaine",
        order: domains.length + 1,
      }),
    });
    setDomains([...domains, { ...data.item, questions: [], resources: [], domainTrainings: [] }]);
  };

  if (loading) {
    return <div className="card">Chargement...</div>;
  }

  if (!questionnaire) {
    return <div className="alert">Questionnaire introuvable</div>;
  }

  return (
    <div className="stack" style={{ gap: 24 }}>
      <AdminNav />
      <AdminPageHeader title={questionnaire.title} subtitle="Configuration avancée" />
      {error ? <div className="alert">{error}</div> : null}
      <Card title="Paramètres">
        <QuestionnaireSettings
          questionnaire={questionnaire}
          onUpdated={(item) => setQuestionnaire(item)}
        />
      </Card>
      <Card title="Stats questionnaire" subtitle="Suivi des tentatives et complétion.">
        {stats ? (
          <div className="row" style={{ gap: 12 }}>
            <div className="card" style={{ padding: "12px" }}>
              <div className="label">Tentatives</div>
              <strong>{stats.total}</strong>
            </div>
            <div className="card" style={{ padding: "12px" }}>
              <div className="label">Soumises</div>
              <strong>{stats.submitted}</strong>
            </div>
            <div className="card" style={{ padding: "12px" }}>
              <div className="label">Taux de complétion</div>
              <strong>{stats.completionRate.toFixed(0)}%</strong>
            </div>
          </div>
        ) : (
          <div className="label">Aucune donnée</div>
        )}
      </Card>
      <Card title="Domaines" subtitle="Structurez vos axes de diagnostic.">
        <div className="stack">
          {domains.map((domain) => (
            <DomainEditor
              key={domain.id}
              domain={domain}
              trainings={trainings}
              onUpdated={(updated) =>
                setDomains(domains.map((item) => (item.id === updated.id ? updated : item)))
              }
              onDeleted={(id) => setDomains(domains.filter((item) => item.id !== id))}
            />
          ))}
          <Button variant="success" onClick={handleAddDomain}>
            Ajouter un domaine
          </Button>
        </div>
      </Card>
      <Card title="Stats ressources" subtitle="Clics sur les supports (PPTX, liens).">
        <div className="stack">
          {domains.map((domain) => (
            <div key={domain.id} className="stack" style={{ gap: 6 }}>
              <strong>{domain.name}</strong>
              {domain.resources.length ? (
                <div className="stack" style={{ gap: 4 }}>
                  {domain.resources.map((resource) => (
                    <div key={resource.id} className="row" style={{ gap: 12 }}>
                      <span>{resource.title}</span>
                      <span className="badge">
                        {(resource.clickCount ?? 0).toLocaleString("fr-FR")} clics
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="label">Aucune ressource</div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
