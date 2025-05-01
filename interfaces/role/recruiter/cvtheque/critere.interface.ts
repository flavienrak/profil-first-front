import { CvThequeCompetenceInterface } from './competence.interface';

export interface CvThequeCritereInterface {
  id: number;
  position: string;
  description?: string;
  experience?: number;
  diplome?: string;
  localisation?: string;
  distance?: number;
  userId: number;

  cvCritereCompetences: CvThequeCompetenceInterface[];

  createdAt: Date;
  updatedAt: Date;
}
