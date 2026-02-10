"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ScoreSnapshot } from "@/lib/types";
import { fetchJson } from "@/lib/client";
import { Card } from "@/components/ui/Card";

type ResultResponse = {
  item: {
    id: string;
    email: string;
    submittedAt: string;
    questionnaireTitle: string;
    scoreSnapshot: ScoreSnapshot;
  };
};

export default function ResultPage() {
  const params = useParams<{ attemptId: string }>();
  const [data, setData] = useState<ResultResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resourceMeta, setResourceMeta] = useState<
    Record<string, { domainId: string; domainName: string }>
  >({});

  useEffect(() => {
    fetchJson<ResultResponse>(`/api/public/results/${params.attemptId}`)
      .then((res) => setData(res))
      .catch((err) => setError((err as Error).message));
  }, [params.attemptId]);

  useEffect(() => {
    if (!data) return;
    const missingIds = Array.from(
      new Set(
        data.item.scoreSnapshot.recommendedResources
          .filter((resource) => !resource.domainId || !resource.domainName)
          .map((resource) => resource.resourceId)
      )
    );

    if (!missingIds.length) return;

    fetchJson<{
      items: { id: string; domainId: string; domainName: string }[];
    }>(`/api/public/resources/lookup?ids=${missingIds.join(",")}`)
      .then((res) => {
        const next: Record<string, { domainId: string; domainName: string }> = {};
        for (const item of res.items) {
          next[item.id] = { domainId: item.domainId, domainName: item.domainName };
        }
        setResourceMeta(next);
      })
      .catch(() => {});
  }, [data]);

  if (error) {
    return <div className="alert">{error}</div>;
  }

  if (!data) {
    return <div className="card">Chargement...</div>;
  }

  const snapshot = data.item.scoreSnapshot;
  const attemptId = params.attemptId;

  return (
    <div className="stack" style={{ gap: 24 }}>
      <Card title={data.item.questionnaireTitle} subtitle="Vos résultats">
        <div className="stack" style={{ gap: 16 }}>
          <h3 style={{ margin: 0 }}>Scores par domaine</h3>
          <div className="stack" style={{ gap: 12 }}>
            {snapshot.domainScores.map((score) => (
              <div key={score.domainId} className="card" style={{ padding: "12px" }}>
                <div className="row" style={{ justifyContent: "space-between", gap: 12 }}>
                  <strong>{score.domainName}</strong>
                  <span className="badge">
                    {score.score}/{score.maxScore} ({score.percent.toFixed(0)}%)
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    height: 8,
                    borderRadius: 999,
                    background: "rgba(0,0,0,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(0, score.percent))}%`,
                      height: "100%",
                      background: "var(--accent, #111)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card title="Formations recommandées">
        <ul>
          {snapshot.recommendedTrainings.length ? (
            snapshot.recommendedTrainings.map((training) => (
              <li key={training.trainingId}>
                {training.url ? (
                  <a href={training.url} target="_blank" rel="noreferrer">
                    {training.title}
                  </a>
                ) : (
                  training.title
                )}
              </li>
            ))
          ) : (
            <li>Aucune recommandation</li>
          )}
        </ul>
      </Card>
      <Card title="Axes que vous pourriez approfondir et ressources personnalisées">
        <div className="stack" style={{ gap: 12 }}>
          {snapshot.lowestDomains.length ? (
            snapshot.lowestDomains.map((domain) => {
              const resources = snapshot.recommendedResources.filter((resource) => {
                const meta = resourceMeta[resource.resourceId];
                const domainId = resource.domainId || meta?.domainId;
                const domainName = resource.domainName || meta?.domainName;
                if (domainId) return domainId === domain.domainId;
                if (domainName) return domainName === domain.domainName;
                return false;
              });
              return (
                <div key={domain.domainId} className="card" style={{ padding: "12px" }}>
                  <div className="row" style={{ justifyContent: "space-between", gap: 12 }}>
                    <strong>{domain.domainName}</strong>
                  </div>
                  <div className="stack" style={{ marginTop: 8, gap: 6 }}>
                    {resources.length ? (
                      resources.map((resource) => (
                        <div key={resource.resourceId} className="row" style={{ gap: 8 }}>
                          <span className="badge">Ressource →</span>
                          <a
                            href={`/r/${attemptId}/resource/${resource.resourceId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {resource.title}
                          </a>
                          <span className="label">({resource.type})</span>
                        </div>
                      ))
                    ) : (
                      <div className="label">Aucune ressource associée</div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="label">Aucun axe à approfondir</div>
          )}
        </div>
      </Card>
    </div>
  );
}



