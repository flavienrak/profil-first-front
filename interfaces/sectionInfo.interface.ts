import { AdviceInterface } from './advice.interface';

export interface SectionInfoInterface {
  id: number;
  role: string;
  content: string;
  font: string;
  color: string;
  background: string;
  title?: string;
  company?: string;
  date?: string;
  contrat?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  cvMinuteId: number;
  sectionId: number;

  advices: AdviceInterface[];
  createdAt: Date;
  updatedAt: Date;
}
