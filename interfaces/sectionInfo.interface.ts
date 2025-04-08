export interface SectionInfoInterface {
  id: number;
  role: string;
  content: string;
  title?: string;
  company?: string;
  date?: string;
  contrat?: string;
  conseil?: string;
  suggestion?: string;
  font: string;
  color: string;
  background: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  cvMinuteId: number;
  sectionId: number;
  createdAt: Date;
  updatedAt: Date;
}
