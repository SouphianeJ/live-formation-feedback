export function Card({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card stack">
      {title ? (
        <div>
          <h2 className="title">{title}</h2>
          {subtitle ? <p className="subtitle">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
