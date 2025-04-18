import { AdviceInterface } from './advice.interface';
import { CvMinuteSectionInterface } from './cvMinuteSection.interface';
import { EvaluationInterface } from './evaluation.interface';
import { FileInterface } from './file.interface';

export interface CvMinuteInterface {
  id: number;
  position: string;
  primaryBg: string;
  secondaryBg: string;
  tertiaryBg: string;
  userId: number;

  files: FileInterface[];
  advices: AdviceInterface[];
  cvMinuteSections: CvMinuteSectionInterface[];
  evaluation: EvaluationInterface;
  createdAt: Date;
  updatedAt: Date;
}
