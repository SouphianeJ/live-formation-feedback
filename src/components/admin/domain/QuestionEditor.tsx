"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchJson } from "@/lib/client";
import { AnswerEditor, type AnswerItem } from "@/components/admin/domain/AnswerEditor";

export type QuestionItem = {
  id: string;
  prompt: string;
  type: string;
  helpText?: string | null;
  order: number;
  isRequired: boolean;
  answers: AnswerItem[];
};

export function QuestionEditor({
  question,
  onUpdated,
  onDeleted,
}: {
  question: QuestionItem;
  onUpdated: (question: QuestionItem) => void;
  onDeleted: (id: string) => void;
}) {
  const [prompt, setPrompt] = useState(question.prompt);
  const [helpText, setHelpText] = useState(question.helpText || "");
  const [order, setOrder] = useState(question.order);
  const [isRequired, setIsRequired] = useState(question.isRequired);
  const [answers, setAnswers] = useState(question.answers);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const data = await fetchJson<{ item: QuestionItem }>(`/api/admin/questions/${question.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, helpText, order, isRequired }),
    });
    onUpdated({ ...data.item, answers });
    setLoading(false);
  };

  const handleDelete = async () => {
    await fetchJson(`/api/admin/questions/${question.id}`, { method: "DELETE" });
    onDeleted(question.id);
  };

  const handleAddAnswer = async () => {
    const data = await fetchJson<{ item: AnswerItem }>("/api/admin/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question.id,
        value: "A",
        label: "Nouvelle réponse",
        score: 0,
        order: answers.length + 1,
      }),
    });
    setAnswers([...answers, data.item]);
  };

  return (
    <div className="card" style={{ padding: "16px" }}>
      <div className="stack">
        <label className="stack" style={{ gap: 6 }}>
          <span className="label">Question</span>
          <Input value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        </label>
        <label className="stack" style={{ gap: 6 }}>
          <span className="label">Aide (optionnel)</span>
          <Input
            value={helpText}
            onChange={(event) => setHelpText(event.target.value)}
            placeholder="Aide optionnelle"
          />
        </label>
        <div className="row">
          <label className="stack" style={{ gap: 6 }}>
            <span className="label">Ordre</span>
            <Input
              type="number"
              value={order}
              onChange={(event) => setOrder(Number(event.target.value))}
              placeholder="Ordre"
            />
          </label>
          <label className="row tight" style={{ alignItems: "center" }}>
            <Input
              type="checkbox"
              checked={isRequired}
              onChange={(event) => setIsRequired(event.target.checked)}
            />
            <span className="label">Obligatoire</span>
          </label>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "..." : "Sauver"}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
        <div className="stack">
          {answers.map((answer) => (
            <AnswerEditor
              key={answer.id}
              answer={answer}
              onUpdated={(updated) =>
                setAnswers(answers.map((item) => (item.id === updated.id ? updated : item)))
              }
              onDeleted={(id) => setAnswers(answers.filter((item) => item.id !== id))}
            />
          ))}
          <Button variant="success" onClick={handleAddAnswer}>
            Ajouter une réponse
          </Button>
        </div>
      </div>
    </div>
  );
}
