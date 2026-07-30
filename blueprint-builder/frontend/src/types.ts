export interface Blueprint {
  id?: string;
  name: string;
  description: string;
  projectType: string;
  platforms: string[];
  frontend: string[];
  backend: string[];
  mobile: string[];
  desktop: string[];
  database: string[];
  storage: string[];
  orm: string[];
  authentication: string[];
  hosting: string[];
  cdn: string[];
  cache: string[];
  queue: string[];
  search: string[];
  monitoring: string[];
  features: string[];
  integrations: string[];
  quality: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Option {
  name: string;
  description: string;
  category: string;
  bestFor: string;
  advantages: string[];
  limitations: string[];
  compatibleWith: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  popularity: number;
  tags: string[];
  docsUrl?: string;
}

export interface BuilderSection {
  id: string;
  title: string;
  description: string;
  key: keyof Blueprint;
  multiple: boolean;
  options: string[];
  dependsOn?: { field: keyof Blueprint; values: string[] };
}

export interface ValidationIssue {
  type: 'missing' | 'conflict' | 'warning';
  field?: string;
  message: string;
}

export type BuilderStep =
  | 'basics'
  | 'platforms'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'features'
  | 'integrations'
  | 'quality'
  | 'review';
