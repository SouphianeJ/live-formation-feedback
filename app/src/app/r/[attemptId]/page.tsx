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

  useEffect(() => {
    fetchJson<ResultResponse>(`/api/public/results/${params.attemptId}`)
      .then((res) => setData(res))
      .catch((err) => setError((err as Error).message));
  }, [params.attemptId]);

  if (error) {
    return <div className="alert">{error}</div>;
  }

  if (!data) {
    return <div className="card">Chargement...</div>;
  }

  const snapshot = data.item.scoreSnapshot;

  return (
    <div className="stack" style={{ gap: 24 }}>
      <Card title={data.item.questionnaireTitle} subtitle="Vos résultats">
        <div className="stack">
          <h3>Scores par domaine</h3>
          <ul>
            {snapshot.domainScores.map((score) => (
              <li key={score.domainId}>
                {score.domainName}: {score.score}/{score.maxScore} ({score.percent.toFixed(0)}%)
              </li>
            ))}
          </ul>
        </div>
      </Card>
      <Card title="Domaines à renforcer">
        <ul>
          {snapshot.lowestDomains.map((domain) => (
            <li key={domain.domainId}>
              {domain.domainName} ({domain.percent.toFixed(0)}%)
            </li>
          ))}
        </ul>
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
      <Card title="Ressources">
        <ul>
          {snapshot.recommendedResources.length ? (
            snapshot.recommendedResources.map((resource) => (
              <li key={resource.resourceId}>
                <a href={resource.url} target="_blank" rel="noreferrer">
                  {resource.title}
                </a>
                ({resource.type})
              </li>
            ))
          ) : (
            <li>Aucune ressource</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
