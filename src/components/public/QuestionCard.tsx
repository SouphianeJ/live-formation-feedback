import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import type { Question } from "@/lib/types";

export function QuestionCard({
  question,
  value,
  onChange,
  shuffleSeed,
}: {
  question: Question;
  value?: string;
  onChange: (answerId: string) => void;
  shuffleSeed?: string;
}) {
  const answers = useMemo(() => {
    if (!shuffleSeed) return question.answers;
    const seed = `${shuffleSeed}:${question.id}`;
    const hashSeed = Array.from(seed).reduce(
      (acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0,
      2166136261
    );
    let t = hashSeed + 0x6d2b79f5;
    const rand = () => {
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const shuffled = question.answers.slice();
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [question.answers, question.id, shuffleSeed]);

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
          {answers.map((answer) => (
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
