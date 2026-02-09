export function AdminNav() {
  return (
    <nav className="row" style={{ justifyContent: "space-between", marginBottom: 24 }}>
      <div className="row">
        <a href="/" className="badge">
          Live Formation Feedback
        </a>
        <a href="/admin/questionnaires" className="badge">
          Questionnaires
        </a>
        <a href="/admin/trainings" className="badge">
          Formations
        </a>
      </div>
      <a href="/admin/login" className="badge">
        Déconnexion
      </a>
    </nav>
  );
}
