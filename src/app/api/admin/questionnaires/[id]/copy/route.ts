import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";

async function buildUniqueSlug(base: string) {
  const normalized = slugify(base);
  let suffix = Date.now().toString().slice(-6);
  let candidate = `${normalized}-copy-${suffix}`;
  let existing = await prisma.questionnaire.findUnique({ where: { slug: candidate } });
  if (!existing) return candidate;

  // Fallback: try a few random suffixes to avoid collisions.
  for (let i = 0; i < 5; i += 1) {
    suffix = Math.random().toString(36).slice(2, 6);
    candidate = `${normalized}-copy-${suffix}`;
    existing = await prisma.questionnaire.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
  }

  // Last resort: add a longer timestamp suffix.
  return `${normalized}-copy-${Date.now()}`;
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const source = await prisma.questionnaire.findUnique({
      where: { id },
      include: {
        domains: {
          include: {
            questions: { include: { answers: true } },
            resources: true,
            domainTrainings: true,
          },
        },
      },
    });

    if (!source) {
      return NextResponse.json({ error: "Questionnaire introuvable" }, { status: 404 });
    }

    type AnswerRow = {
      value: string;
      label: string;
      score: number;
      order: number;
    };
    type ResourceRow = {
      title: string;
      type: string;
      url: string;
      order: number;
      sourceType?: string | null;
    };
    type DomainTrainingRow = {
      trainingId: string;
    };

    const title = `${source.title} (copie)`;
    const slug = await buildUniqueSlug(source.title);

    const created = await prisma.questionnaire.create({
      data: {
        title,
        description: source.description,
        slug,
        status: "draft",
      },
    });

    for (const domain of source.domains) {
      const createdDomain = await prisma.domain.create({
        data: {
          questionnaireId: created.id,
          name: domain.name,
          description: domain.description,
          order: domain.order,
        },
      });

      for (const question of domain.questions) {
        const createdQuestion = await prisma.question.create({
          data: {
            domainId: createdDomain.id,
            type: question.type,
            prompt: question.prompt,
            helpText: question.helpText,
            order: question.order,
            isRequired: question.isRequired,
          },
        });

        if (question.answers.length) {
          await prisma.answerOption.createMany({
            data: question.answers.map((answer: AnswerRow) => ({
              questionId: createdQuestion.id,
              value: answer.value,
              label: answer.label,
              score: answer.score,
              order: answer.order,
            })),
          });
        }
      }

      if (domain.resources.length) {
        await prisma.resource.createMany({
          data: domain.resources.map((resource: ResourceRow) => ({
            domainId: createdDomain.id,
            title: resource.title,
            type: resource.type,
            url: resource.url,
            order: resource.order,
            sourceType: resource.sourceType ?? "repo",
          })),
        });
      }

      if (domain.domainTrainings.length) {
        await prisma.domainTraining.createMany({
          data: domain.domainTrainings.map((link: DomainTrainingRow) => ({
            domainId: createdDomain.id,
            trainingId: link.trainingId,
          })),
        });
      }
    }

    return NextResponse.json({ item: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}
