import { FindOperator } from 'typeorm';

export interface QueryParams {
  duration?: string | string[];
  difficulty?: string | string[];
  price?: string | string[];
}

export interface QueryObject {
  duration?: number | FindOperator<number> | undefined;
  difficulty?: string;
  price?: number | FindOperator<number> | undefined;
}

export interface ErrorInterface {
  property: string;
  constraints: { [type: string]: string } | undefined;
}

export type DifficultyType = 'easy' | 'medium' | 'difficult';
