import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function SubmitStep({
  onSubmit,
  loading,
  message,
}: {
  onSubmit: () => void;
  loading?: boolean;
  message?: string;
}) {
  return (
    <Card>
      <div className="stack" style={{ gap: 12 }}>
        <h2 className="title">Envoyer mes réponses</h2>
        <p className="subtitle">
          {message ||
            "Vous recevrez un email avec vos recommandations et vos scores."}
        </p>
        <Button onClick={onSubmit} disabled={loading} className="btn-block">
          {loading ? "Envoi..." : "Soumettre"}
        </Button>
      </div>
    </Card>
  );
}
