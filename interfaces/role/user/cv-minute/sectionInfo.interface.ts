import { AdviceInterface } from './advice.interface';
import { EvaluationInterface } from './evaluation.interface';
import { IconInterface } from '../../../icon.interface';
import { QualiCarriereCompetenceInteface } from '../quali-carriere/competence.interface';
import { QualiCarriereResumeInterface } from '../quali-carriere/resume.interface';

export interface SectionInfoInterface {
  id: number;
  order: number | null;
  content: string;
  title: string | null;
  company: string | null;
  date: string | null;
  contrat: string | null;
  icon: IconInterface | null;
  iconSize: number | null;
  cvMinuteSectionId: number;

  evaluation?: EvaluationInterface | null;
  advices?: AdviceInterface[];
  qualiCarriereCompetences?: QualiCarriereCompetenceInteface[];
  qualiCarriereResumes?: QualiCarriereResumeInterface[];

  createdAt: Date;
  updatedAt: Date;
}
