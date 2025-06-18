import { AdviceInterface } from '../../../advice.interface';
import { CvMinuteSectionInterface } from './cvMinuteSection.interface';
import { EvaluationInterface } from '../../../evaluation.interface';
import { FileInterface } from '../../../file.interface';
import { CvThequeViewInterface } from '../../recruiter/cvtheque/cvthequeView.interface';
import { CvThequeContactInterface } from '../../recruiter/cvtheque/cvthequeContact.interface';
import { UserActionInterface } from '@/interfaces/userAction.interface';

export interface CvMinuteInterface {
  id: number;
  name: string;
  position: string;
  primaryBg: string;
  secondaryBg: string;
  tertiaryBg: string;
  visible: boolean;
  qualiCarriereRef: boolean;
  generated: string | null;
  score: number | null;
  deleted: boolean;
  userId: number;
  cvThequeCritereId: number | null;

  files?: FileInterface[];
  advices?: AdviceInterface[];
  userActions?: UserActionInterface[];
  cvMinuteSections?: CvMinuteSectionInterface[];
  evaluation?: EvaluationInterface;
  cvThequeViews?: CvThequeViewInterface[];
  cvThequeContacts?: CvThequeContactInterface[];

  createdAt: Date;
  updatedAt: Date;
}
