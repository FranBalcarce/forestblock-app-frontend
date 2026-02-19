export type DevProject = {
  key: string;
  name: string;
  country: string;
  stage: 'Piloto' | 'Fase 1';
  tipo: string;
  year: number;

  images?: string[];
  coverImage?: string;

  methodologies?: {
    category?: string;
  }[];

  sustainableDevelopmentGoals?: any[];

  vintages?: any[];
};
