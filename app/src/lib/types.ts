export type AnswerOption = {
  id: string;
  value: string;
  label: string;
  score: number;
  order: number;
};

export type Question = {
  id: string;
  type: string;
  prompt: string;
  helpText?: string | null;
  order: number;
  isRequired: boolean;
  answers: AnswerOption[];
};

export type Resource = {
  id: string;
  title: string;
  type: string;
  url: string;
  order: number;
};

export type Training = {
  id: string;
  title: string;
  url?: string | null;
};

export type Domain = {
  id: string;
  name: string;
  description?: string | null;
  order: number;
  questions: Question[];
  resources: Resource[];
  domainTrainings: { training: Training }[];
};

export type Questionnaire = {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  status: string;
  domains?: Domain[];
};

export type Attempt = {
  id: string;
  email: string;
  questionnaireId: string;
  status: string;
};

export type ScoreSnapshot = {
  domainScores: {
    domainId: string;
    domainName: string;
    score: number;
    maxScore: number;
    percent: number;
  }[];
  lowestDomains: {
    domainId: string;
    domainName: string;
    percent: number;
  }[];
  recommendedTrainings: {
    trainingId: string;
    title: string;
    url?: string | null;
  }[];
  recommendedResources: {
    resourceId: string;
    title: string;
    type: string;
    url: string;
  }[];
};
