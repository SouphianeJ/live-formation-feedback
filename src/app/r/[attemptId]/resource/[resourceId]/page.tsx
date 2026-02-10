import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

function buildResourceUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrl = process.env.APP_BASE_URL || "";
  if (!baseUrl) return url;
  if (url.startsWith("/")) return `${baseUrl}${url}`;
  return `${baseUrl}/${url}`;
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ attemptId: string; resourceId: string }>;
}) {
  const { attemptId, resourceId } = await params;

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    select: { questionnaireId: true },
  });

  if (!attempt) {
    return <div className="alert">Tentative introuvable</div>;
  }

  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: { domain: true },
  });

  if (!resource || resource.domain.questionnaireId !== attempt.questionnaireId) {
    return <div className="alert">Ressource introuvable</div>;
  }

  await prisma.resource.update({
    where: { id: resource.id },
    data: { clickCount: (resource.clickCount ?? 0) + 1 },
  });

  const resourceUrl = buildResourceUrl(resource.url);
  const officeEmbedUrl = resourceUrl.startsWith("http")
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resourceUrl)}`
    : "";

  return (
    <div className="stack" style={{ gap: 24 }}>
      <Card title={resource.title}>
        <div className="row" style={{ justifyContent: "space-between", gap: 12 }}>
          <a className="badge" href={`/r/${attemptId}`}>
            Revenir aux résultats
          </a>
          <a className="badge" href={resourceUrl} target="_blank" rel="noreferrer">
            Ouvrir le fichier
          </a>
        </div>
      </Card>
      <Card title="Prévisualisation">
        {officeEmbedUrl ? (
          <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
            <iframe
              src={officeEmbedUrl}
              title={resource.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allowFullScreen
            />
          </div>
        ) : (
          <div className="alert">
            Impossible de prévisualiser cette ressource. Utilisez le bouton "Ouvrir le
            fichier".
          </div>
        )}
      </Card>
    </div>
  );
}
