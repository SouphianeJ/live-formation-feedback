import { Card } from "@/components/ui/Card";
import type { Question } from "@/lib/types";

export function QuestionCard({
  question,
  value,
  onChange,
}: {
  question: Question;
  value?: string;
  onChange: (answerId: string) => void;
}) {
  return (
    <Card>
      <div className="stack" style={{ gap: 12 }}>
        <div>
          <h3 style={{ margin: 0 }}>{question.prompt}</h3>
          {question.helpText ? (
            <p className="subtitle" style={{ marginTop: 6 }}>
              {question.helpText}
            </p>
          ) : null}
        </div>
        <div className="stack" style={{ gap: 10 }}>
          {question.answers.map((answer) => (
            <label
              key={answer.id}
              className="card"
              style={{
                padding: "12px 14px",
                border:
                  value === answer.id
                    ? "2px solid var(--accent)"
                    : "1px solid var(--border)",
              }}
            >
              <div className="row" style={{ alignItems: "flex-start" }}>
                <input
                  type="radio"
                  name={question.id}
                  value={answer.id}
                  checked={value === answer.id}
                  onChange={() => onChange(answer.id)}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{answer.label}</div>
                  <div className="label">Choix {answer.value}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
}
