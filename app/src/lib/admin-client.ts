import { fetchJson } from "@/lib/client";
import type { Questionnaire } from "@/lib/types";
import type { DomainItem } from "@/components/admin/domain/DomainEditor";
import type { QuestionItem } from "@/components/admin/domain/QuestionEditor";
import type { AnswerItem } from "@/components/admin/domain/AnswerEditor";
import type { ResourceItem } from "@/components/admin/domain/ResourceEditor";
import type { DomainTrainingItem } from "@/components/admin/domain/DomainTrainingEditor";
import type { TrainingItem } from "@/components/admin/TrainingForm";

export async function loadQuestionnaire(id: string) {
  const data = await fetchJson<{ item: Questionnaire }>(`/api/admin/questionnaires/${id}`);
  return data.item;
}

type DomainBase = Omit<DomainItem, "questions" | "resources" | "domainTrainings">;

export async function loadDomains(questionnaireId: string): Promise<DomainItem[]> {
  const data = await fetchJson<{ items: DomainBase[] }>(
    `/api/admin/domains?questionnaireId=${questionnaireId}`
  );

  const domains = data.items;
  const enriched = await Promise.all(
    domains.map(async (domain) => {
      const [questionsData, resourcesData, trainingsData] = await Promise.all([
        fetchJson<{ items: QuestionItem[] }>(`/api/admin/questions?domainId=${domain.id}`),
        fetchJson<{ items: ResourceItem[] }>(`/api/admin/resources?domainId=${domain.id}`),
        fetchJson<{ items: DomainTrainingItem[] }>(
          `/api/admin/domain-trainings?domainId=${domain.id}`
        ),
      ]);

      const questionsWithAnswers = await Promise.all(
        questionsData.items.map(async (question) => {
          const answersData = await fetchJson<{ items: AnswerItem[] }>(
            `/api/admin/answers?questionId=${question.id}`
          );
          return { ...question, answers: answersData.items };
        })
      );

      return {
        ...domain,
        questions: questionsWithAnswers,
        resources: resourcesData.items,
        domainTrainings: trainingsData.items,
      };
    })
  );

  return enriched;
}

export async function loadTrainings(): Promise<TrainingItem[]> {
  const data = await fetchJson<{ items: TrainingItem[] }>("/api/admin/trainings");
  return data.items;
}
