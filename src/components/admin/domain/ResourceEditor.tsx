"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { fetchJson } from "@/lib/client";

export type ResourceItem = {
  id: string;
  title: string;
  type: string;
  url: string;
  order: number;
  clickCount?: number;
  sourceType?: "repo" | "external";
};

export function ResourceEditor({
  resource,
  onUpdated,
  onDeleted,
}: {
  resource: ResourceItem;
  onUpdated: (resource: ResourceItem) => void;
  onDeleted: (id: string) => void;
}) {
  const [title, setTitle] = useState(resource.title);
  const [type, setType] = useState(resource.type);
  const [url, setUrl] = useState(resource.url);
  const [order, setOrder] = useState(resource.order);
  const [sourceType, setSourceType] = useState<ResourceItem["sourceType"]>(
    resource.sourceType || "repo"
  );

  const handleSave = async () => {
    const data = await fetchJson<{ item: ResourceItem }>(`/api/admin/resources/${resource.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type, url, order, sourceType }),
    });
    onUpdated(data.item);
  };

  const handleDelete = async () => {
    await fetchJson(`/api/admin/resources/${resource.id}`, { method: "DELETE" });
    onDeleted(resource.id);
  };

  return (
    <div className="card" style={{ padding: "12px" }}>
      <div className="stack">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        <div className="row">
          <Select
            value={sourceType}
            onChange={(event) => setSourceType(event.target.value as "repo" | "external")}
          >
            <option value="repo">Hébergée dans le repo</option>
            <option value="external">URL publique externe</option>
          </Select>
          <Select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="pdf">pdf</option>
            <option value="pptx">pptx</option>
            <option value="link">link</option>
          </Select>
          <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="URL" />
          <Input
            type="number"
            value={order}
            onChange={(event) => setOrder(Number(event.target.value))}
            placeholder="Ordre"
          />
        </div>
        <div className="row">
          <Button onClick={handleSave}>Sauver</Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}
