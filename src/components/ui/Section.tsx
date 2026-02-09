export function Section({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h3 className="title" style={{ fontSize: 20, marginBottom: 0 }}>
            {title}
          </h3>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
