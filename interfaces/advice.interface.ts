export interface AdviceInterface {
  id: number;
  role?: string;
  order?: number;
  content: string;
  cvMinuteId?: number;
  sectionInfoId?: number;
  cvMinuteSectionId?: number;

  createdAt: Date;
  updatedAt: Date;
}
