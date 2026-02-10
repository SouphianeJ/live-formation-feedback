import type { AnswerOption, Domain, Question, Resource, Training } from "@/lib/types";

export type ResponseInput = {
  questionId: string;
  answerId: string;
};

export type DomainWithQuestions = Domain & {
  questions: (Question & { answers: AnswerOption[] })[];
  resources: Resource[];
  domainTrainings: { training: Training }[];
};

export function computeScoreSnapshot(params: {
  domains: DomainWithQuestions[];
  responses: ResponseInput[];
}) {
  const responseMap = new Map(
    params.responses.map((response) => [response.questionId, response.answerId])
  );
  const answerScoreMap = new Map<string, number>();

  const domainScores = params.domains.map((domain) => {
    let score = 0;
    let maxScore = 0;

    for (const question of domain.questions) {
      const answerId = responseMap.get(question.id);
      const maxAnswerScore = Math.max(
        ...question.answers.map((answer) => answer.score),
        0
      );

      const hasAnswer = Boolean(answerId);
      if (question.isRequired && !hasAnswer) {
        throw new Error(`Question required: ${question.prompt}`);
      }

      if (question.isRequired || hasAnswer) {
        maxScore += maxAnswerScore;
      }

      if (hasAnswer) {
        const answer = question.answers.find((option) => option.id === answerId);
        if (!answer) {
          throw new Error(`Invalid answer for question: ${question.prompt}`);
        }
        score += answer.score;
        answerScoreMap.set(question.id, answer.score);
      }
    }

    const percent = maxScore > 0 ? (score / maxScore) * 100 : 0;
    return {
      domainId: domain.id,
      domainName: domain.name,
      score,
      maxScore,
      percent,
    };
  });

  const sortedDomains = [...domainScores].sort((a, b) => a.percent - b.percent);
  const secondPercent = sortedDomains[1]?.percent ?? sortedDomains[0]?.percent ?? 0;
  const lowestDomains = sortedDomains
    .filter((entry) => entry.percent <= secondPercent)
    .map((entry) => ({
      domainId: entry.domainId,
      domainName: entry.domainName,
      percent: entry.percent,
    }));

  const lowestDomainIds = new Set(lowestDomains.map((domain) => domain.domainId));

  const recommendedResources = params.domains
    .filter((domain) => lowestDomainIds.has(domain.id))
    .flatMap((domain) =>
      domain.resources.map((resource) => ({
        resourceId: resource.id,
        title: resource.title,
        type: resource.type,
        url: resource.url,
      }))
    );

  const recommendedTrainings = params.domains
    .filter((domain) => lowestDomainIds.has(domain.id))
    .flatMap((domain) =>
      domain.domainTrainings.map((link) => ({
        trainingId: link.training.id,
        title: link.training.title,
        url: link.training.url || undefined,
      }))
    );

  return {
    responsesWithScore: params.responses.map((response) => ({
      questionId: response.questionId,
      answerId: response.answerId,
      scoreSnapshot: answerScoreMap.get(response.questionId) ?? 0,
    })),
    snapshot: {
      domainScores,
      lowestDomains,
      recommendedTrainings,
      recommendedResources,
    },
  };
}
