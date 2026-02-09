export function AdminField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="stack" style={{ gap: 6 }}>
      <span className="label">{label}</span>
      {children}
      {hint ? <span className="label">{hint}</span> : null}
    </label>
  );
}
