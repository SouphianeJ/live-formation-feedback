"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
        data.item.scoreSnapshot.recommendedResources.map(
          (resource) => resource.resourceId
        )
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
          <div className="grid two">
            {snapshot.domainScores.map((score) => (
              <div key={score.domainId} className="metric">
                <div className="row between">
                  <strong>{score.domainName}</strong>
                  <span className="badge primary">
                    {score.score}/{score.maxScore} ({score.percent.toFixed(0)}%)
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress__bar"
                    style={{ width: `${Math.min(100, Math.max(0, score.percent))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card title="Formations recommandées">
        <div className="section">
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
        </div>
      </Card>
      <Card title="Axes que vous pourriez approfondir et ressources personnalisées">
        <div className="stack" style={{ gap: 12 }}>
          {snapshot.lowestDomains.length ? (
            snapshot.lowestDomains.map((domain) => {
              const resources = snapshot.recommendedResources.filter((resource) => {
                const meta = resourceMeta[resource.resourceId];
                if (!meta) return false;
                return meta.domainId === domain.domainId;
              });
              return (
                <div key={domain.domainId} className="metric">
                  <div className="row between">
                    <strong>{domain.domainName}</strong>
                  </div>
                  <div className="stack" style={{ marginTop: 8, gap: 6 }}>
                    {resources.length ? (
                      resources.map((resource) => (
                        <div key={resource.resourceId} className="row tight mobile-stack">
                          <span className="badge primary">Ressource</span>
                          <Link
                            href={`/r/${attemptId}/resource/${resource.resourceId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {resource.title}
                          </Link>
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



