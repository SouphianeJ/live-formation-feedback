import type { ScoreSnapshot } from "@/lib/types";

export function makePersistedSnapshot(snapshot: ScoreSnapshot): ScoreSnapshot {
  return {
    domainScores: snapshot.domainScores,
    lowestDomains: snapshot.lowestDomains,
    recommendedTrainings: snapshot.recommendedTrainings,
    recommendedResources: snapshot.recommendedResources.map((resource) => ({
      resourceId: resource.resourceId,
      title: resource.title,
      type: resource.type,
      url: resource.url,
    })),
  };
}

export function makeEmailSnapshot(
  snapshot: ScoreSnapshot,
  attemptId: string,
  baseUrl: string
): ScoreSnapshot {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  return {
    ...makePersistedSnapshot(snapshot),
    recommendedResources: snapshot.recommendedResources.map((resource) => ({
      resourceId: resource.resourceId,
      title: resource.title,
      type: resource.type,
      url: normalizedBase
        ? `${normalizedBase}/r/${attemptId}/resource/${resource.resourceId}`
        : `/r/${attemptId}/resource/${resource.resourceId}`,
    })),
  };
}
