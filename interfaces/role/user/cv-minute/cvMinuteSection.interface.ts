import { EvaluationInterface } from '@/interfaces/evaluation.interface';
import { QualiCarriereCompetenceInteface } from '../quali-carriere/competence.interface';
import { QualiCarriereResumeInterface } from '../quali-carriere/resume.interface';
import { AdviceInterface } from '@/interfaces/advice.interface';
import { IconInterface } from '@/interfaces/icon.interface';
import { FileInterface } from '@/interfaces/file.interface';

export interface CvMinuteSectionInterface {
  id: number;
  name: string;
  order: number | null;
  content: string;
  title: string | null;
  company: string | null;
  date: string | null;
  contrat: string | null;
  icon: IconInterface | null;
  iconSize: number | null;
  cvMinuteId: number;
  editable: boolean;

  evaluation: EvaluationInterface | null;
  files: FileInterface[];
  advices: AdviceInterface[];
  qualiCarriereCompetences: QualiCarriereCompetenceInteface[];
  qualiCarriereResumes: QualiCarriereResumeInterface[];

  createdAt: Date;
  updatedAt: Date;
}
