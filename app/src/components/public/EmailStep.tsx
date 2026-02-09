import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function EmailStep({
  email,
  onChange,
  onSubmit,
  loading,
}: {
  email: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}) {
  return (
    <Card title="Commencer le diagnostic" subtitle="Saisissez votre email pour d�buter.">
      <div className="stack">
        <label className="stack" style={{ gap: 6 }}>
          <span className="label">Email</span>
          <Input
            type="email"
            value={email}
            onChange={(event) => onChange(event.target.value)}
            placeholder="votre.email@exemple.com"
          />
        </label>
        <Button onClick={onSubmit} disabled={loading}>
          {loading ? "Chargement..." : "Démarrer"}
        </Button>
      </div>
    </Card>
  );
}
