import { Card } from "@/components/ui/Card";

export function QuestionnaireHeader({
  title,
  description,
}: {
  title: string;
  description?: string | null;
}) {
  return (
    <Card>
      <div className="stack" style={{ gap: 8 }}>
        <h1 className="title">{title}</h1>
        {description ? <p className="subtitle">{description}</p> : null}
      </div>
    </Card>
  );
}
