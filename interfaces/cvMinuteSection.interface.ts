import { AdviceInterface } from './advice.interface';
import { SectionInfoInterface } from './sectionInfo.interface';

export interface CvMinuteSectionInterface {
  id: number;
  sectionOrder?: number;
  sectionTitle?: string;
  sectionInfos: SectionInfoInterface[];
  advices?: AdviceInterface[];
  cvMinuteId: number;
  sectionId: number;
}
