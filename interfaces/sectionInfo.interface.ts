import { AdviceInterface } from './advice.interface';
import { EvaluationInterface } from './evaluation.interface';
import { IconInterface } from './icon.interface';

export interface SectionInfoInterface {
  id: number;
  order?: number;
  content: string;
  title?: string;
  company?: string;
  date?: string;
  contrat?: string;
  icon?: IconInterface;
  iconSize?: number;
  cvMinuteSectionId: number;

  evaluation: EvaluationInterface;
  advices: AdviceInterface[];
  createdAt: Date;
  updatedAt: Date;
}
