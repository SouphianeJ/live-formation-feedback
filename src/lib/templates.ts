import type { ScoreSnapshot } from "@/lib/types";

function formatInTimeZone(date: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone,
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

export function adminCodeEmail(code: string, expiresAt?: Date) {
  const timeZone = process.env.APP_TIMEZONE || "UTC";
  const expiryText = expiresAt
    ? `Il expire à ${formatInTimeZone(expiresAt, timeZone)} (${timeZone}).`
    : "Il expire dans 10 minutes.";
  const text = `Votre code de connexion admin est: ${code}. ${expiryText}`;
  return {
    subject: "Code de connexion admin",
    html: `<p>Votre code de connexion admin est :</p><h2>${code}</h2><p>${expiryText}</p>`,
    text,
  };
}

export function participantResultEmail(params: {
  title: string;
  snapshot: ScoreSnapshot;
  resultUrl?: string;
}) {
  const { snapshot } = params;
  const scoresHtml = snapshot.domainScores
    .map(
      (score) =>
        `<li><strong>${score.domainName}</strong> : ${score.score}/${score.maxScore} (${score.percent.toFixed(
          0
        )}%)</li>`
    )
    .join("");

  const lowestHtml = snapshot.lowestDomains
    .map((domain) => `<li>${domain.domainName} (${domain.percent.toFixed(0)}%)</li>`)
    .join("");

  const trainingsHtml = snapshot.recommendedTrainings
    .map(
      (training) =>
        `<li><a href="${training.url || "#"}">${training.title}</a></li>`
    )
    .join("");

  const resourcesHtml = snapshot.recommendedResources
    .map(
      (resource) =>
        `<li><a href="${resource.url}">${resource.title}</a> (${resource.type})</li>`
    )
    .join("");

  const resultLink = params.resultUrl
    ? `<p>Voir vos résultats: <a href="${params.resultUrl}">${params.resultUrl}</a></p>`
    : "";

  return {
    subject: `Vos recommandations - ${params.title}`,
    html: `
      <h2>Résultats du diagnostic</h2>
      <p>Voici votre score par domaine :</p>
      <ul>${scoresHtml}</ul>
      <p>Axes sur lesquels vous pourriez progresser :</p>
      <ul>${lowestHtml}</ul>
      <p>Formations recommandées :</p>
      <ul>${trainingsHtml || "<li>Aucune recommandation</li>"}</ul>
      <p>On vous propose ces ressources personnalisées :</p>
      <ul>${resourcesHtml || "<li>Aucune ressource</li>"}</ul>
      ${resultLink}
    `,
    text: `Résultats du diagnostic\nScores: ${snapshot.domainScores
      .map((score) => `${score.domainName}: ${score.percent.toFixed(0)}%`)
      .join(", ")}`,
  };
}
