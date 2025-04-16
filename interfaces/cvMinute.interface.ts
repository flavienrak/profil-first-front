import { AdviceInterface } from './advice.interface';
import { EvaluationInterface } from './evaluation.interface';

export interface CvMinuteInterface {
  id: number;
  position: string;
  primaryBg: string;
  secondaryBg: string;
  tertiaryBg: string;
  userId: number;

  advices: AdviceInterface[];
  evaluation: EvaluationInterface;
  createdAt: Date;
  updatedAt: Date;
}
