import { AdviceInterface } from './advice.interface';
import { EvaluationInterface } from './evaluation.interface';
import { IconInterface } from './icon.interface';

export interface SectionInfoInterface {
  id: number;
  role: string;
  content: string;
  font: string;
  color: string;
  background: string;
  order?: number;
  title?: string;
  company?: string;
  date?: string;
  contrat?: string;
  icon?: IconInterface;
  iconColor?: string;
  iconSize?: number;
  cvMinuteId: number;
  sectionId: number;

  evaluation: EvaluationInterface;
  advice: AdviceInterface;
  createdAt: Date;
  updatedAt: Date;
}
