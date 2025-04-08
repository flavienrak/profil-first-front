import { SectionInfoInterface } from './sectionInfo.interface';

export interface CvMinuteSectionInterface {
  sectionOrder?: number;
  sectionTitle?: string;
  sectionInfos: SectionInfoInterface[];
  cvMinuteId: number;
  sectionId: number;
}
