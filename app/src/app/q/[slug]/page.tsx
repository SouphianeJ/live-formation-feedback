"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { Questionnaire } from "@/lib/types";
import { fetchJson } from "@/lib/client";
import { QuestionnaireHeader } from "@/components/public/QuestionnaireHeader";
import { EmailStep } from "@/components/public/EmailStep";
import { QuestionCard } from "@/components/public/QuestionCard";
import { SubmitStep } from "@/components/public/SubmitStep";

export default function QuestionnairePage() {
  const params = useParams<{ slug: string }>();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchJson<{ item: Questionnaire }>(
          `/api/public/questionnaires/${params.slug}`
        );
        setQuestionnaire(data.item);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.slug]);

  const domains = questionnaire?.domains ?? [];

  const allQuestions = useMemo(() => {
    return domains.flatMap((domain) => domain.questions);
  }, [domains]);

  const handleStart = async () => {
    if (!questionnaire) return;
    setError(null);
    try {
      const data = await fetchJson<{ item: { id: string } }>("/api/public/attempts/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, questionnaireId: questionnaire.id }),
      });
      setAttemptId(data.item.id);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    setError(null);
    try {
      const responseArray = Object.entries(responses).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      }));
      await fetchJson(`/api/public/attempts/${attemptId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: responseArray }),
      });
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) {
    return <div className="card">Chargement...</div>;
  }

  if (!questionnaire) {
    return <div className="alert">Questionnaire indisponible</div>;
  }

  if (error) {
    return <div className="alert">{error}</div>;
  }

  return (
    <div className="stack" style={{ gap: 24 }}>
      <QuestionnaireHeader title={questionnaire.title} description={questionnaire.description} />

      {!attemptId && !submitted ? (
        <EmailStep email={email} onChange={setEmail} onSubmit={handleStart} />
      ) : null}

      {attemptId && !submitted ? (
        <div className="stack" style={{ gap: 20 }}>
          {domains.map((domain) => (
            <div key={domain.id} className="stack" style={{ gap: 12 }}>
              <div className="card">
                <h2 className="title">{domain.name}</h2>
                {domain.description ? (
                  <p className="subtitle">{domain.description}</p>
                ) : null}
              </div>
              {domain.questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  value={responses[question.id]}
                  onChange={(answerId) =>
                    setResponses({
                      ...responses,
                      [question.id]: answerId,
                    })
                  }
                />
              ))}
            </div>
          ))}
          <SubmitStep onSubmit={handleSubmit} />
        </div>
      ) : null}

      {submitted ? (
        <div className="success">
          Merci ! Vous recevrez vos recommandations par email très prochainement.
        </div>
      ) : null}

      {attemptId && !submitted ? (
        <div className="label">
          Questions répondues: {Object.keys(responses).length}/{allQuestions.length}
        </div>
      ) : null}
    </div>
  );
}
