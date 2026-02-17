import Link from "next/link";

export function AdminNav() {
  return (
    <nav className="nav">
      <div className="nav__brand">
        <Link href="/" className="nav__logo">
          Live Formation Feedback
        </Link>
        <span className="nav__pill">Admin</span>
      </div>
      <div className="nav__links">
        <Link href="/admin/questionnaires" className="nav__link">
          Questionnaires
        </Link>
        <Link href="/admin/trainings" className="nav__link">
          Formations
        </Link>
      </div>
      <div className="nav__actions">
        <Link href="/admin/login" className="btn ghost">
          Déconnexion
        </Link>
      </div>
    </nav>
  );
}
