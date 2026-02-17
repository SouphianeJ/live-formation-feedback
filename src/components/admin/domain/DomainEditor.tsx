"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchJson } from "@/lib/client";
import { QuestionEditor, type QuestionItem } from "@/components/admin/domain/QuestionEditor";
import { ResourceEditor, type ResourceItem } from "@/components/admin/domain/ResourceEditor";
import { AdminField } from "@/components/admin/AdminField";
import {
  DomainTrainingEditor,
  type DomainTrainingItem,
} from "@/components/admin/domain/DomainTrainingEditor";
import type { TrainingItem } from "@/components/admin/TrainingForm";

export type DomainItem = {
  id: string;
  name: string;
  description?: string | null;
  order: number;
  questions: QuestionItem[];
  resources: ResourceItem[];
  domainTrainings: DomainTrainingItem[];
};

export function DomainEditor({
  domain,
  trainings,
  onUpdated,
  onDeleted,
}: {
  domain: DomainItem;
  trainings: TrainingItem[];
  onUpdated: (domain: DomainItem) => void;
  onDeleted: (id: string) => void;
}) {
  const [name, setName] = useState(domain.name);
  const [description, setDescription] = useState(domain.description || "");
  const [order, setOrder] = useState(domain.order);
  const [questions, setQuestions] = useState(domain.questions);
  const [resources, setResources] = useState(domain.resources);
  const [links, setLinks] = useState(domain.domainTrainings);

  const handleSave = async () => {
    const data = await fetchJson<{ item: DomainItem }>(`/api/admin/domains/${domain.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, order }),
    });
    onUpdated({ ...data.item, questions, resources, domainTrainings: links });
  };

  const handleDelete = async () => {
    await fetchJson(`/api/admin/domains/${domain.id}`, { method: "DELETE" });
    onDeleted(domain.id);
  };

  const handleAddQuestion = async () => {
    const data = await fetchJson<{ item: QuestionItem }>("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domainId: domain.id,
        prompt: "Nouvelle question",
        order: questions.length + 1,
        type: "single_choice",
        isRequired: true,
      }),
    });
    setQuestions([...questions, { ...data.item, answers: [] }]);
  };

  const handleAddResource = async () => {
    const data = await fetchJson<{ item: ResourceItem }>("/api/admin/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domainId: domain.id,
        title: "Nouvelle ressource",
        type: "link",
        url: "https://",
        order: resources.length + 1,
      }),
    });
    setResources([...resources, data.item]);
  };

  return (
    <div className="card stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3 style={{ margin: 0 }}>{domain.name}</h3>
        <div className="row">
          <Button variant="secondary" onClick={handleSave}>
            Sauver domaine
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </div>
      <div className="row">
        <AdminField label="Nom">
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </AdminField>
        <AdminField label="Description">
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </AdminField>
        <AdminField label="Ordre">
          <Input
            type="number"
            value={order}
            onChange={(event) => setOrder(Number(event.target.value))}
          />
        </AdminField>
      </div>
      <div className="stack">
        <h4 style={{ marginBottom: 0 }}>Questions</h4>
        {questions.map((question) => (
          <QuestionEditor
            key={question.id}
            question={question}
            onUpdated={(updated) =>
              setQuestions(
                questions.map((item) => (item.id === updated.id ? updated : item))
              )
            }
            onDeleted={(id) => setQuestions(questions.filter((item) => item.id !== id))}
          />
        ))}
        <Button variant="success" onClick={handleAddQuestion}>
          Ajouter une question
        </Button>
      </div>
      <div className="stack">
        <h4 style={{ marginBottom: 0 }}>Ressources</h4>
        {resources.map((resource) => (
          <ResourceEditor
            key={resource.id}
            resource={resource}
            onUpdated={(updated) =>
              setResources(
                resources.map((item) => (item.id === updated.id ? updated : item))
              )
            }
            onDeleted={(id) => setResources(resources.filter((item) => item.id !== id))}
          />
        ))}
        <Button variant="success" onClick={handleAddResource}>
          Ajouter une ressource
        </Button>
      </div>
      <div className="stack">
        <h4 style={{ marginBottom: 0 }}>Formations associées</h4>
        <DomainTrainingEditor
          domainId={domain.id}
          trainings={trainings}
          links={links}
          onUpdated={setLinks}
        />
      </div>
    </div>
  );
}
