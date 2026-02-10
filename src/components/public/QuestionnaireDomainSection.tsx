import type { Domain } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { QuestionCard } from "@/components/public/QuestionCard";

export function QuestionnaireDomainSection({
  domain,
  responses,
  onAnswerChange,
  shuffleSeed,
}: {
  domain: Domain;
  responses: Record<string, string>;
  onAnswerChange: (questionId: string, answerId: string) => void;
  shuffleSeed?: string;
}) {
  return (
    <section className="stack" style={{ gap: 12 }}>
      <Card>
        <h2 className="title">{domain.name}</h2>
        {domain.description ? <p className="subtitle">{domain.description}</p> : null}
      </Card>
      {domain.questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={responses[question.id]}
          onChange={(answerId) => onAnswerChange(question.id, answerId)}
          shuffleSeed={shuffleSeed}
        />
      ))}
    </section>
  );
}
