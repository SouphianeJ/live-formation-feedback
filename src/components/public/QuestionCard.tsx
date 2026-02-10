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
              className={`question-option ${value === answer.id ? "is-selected" : ""}`}
            >
              <input
                type="radio"
                name={question.id}
                value={answer.id}
                checked={value === answer.id}
                onChange={() => onChange(answer.id)}
                className="question-option__input"
              />
              <div className="question-option__content">
                <div className="question-option__label">{answer.label}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
}
