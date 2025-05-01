import { CvMinuteInterface } from './role/user/cv-minute/cvMinute.interface';
import { FileInterface } from './file.interface';

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  acceptConditions: boolean;
  role: 'user' | 'recruiter' | 'admin';
  qualiCarriere: string;
  image: string;

  files: FileInterface[];
  cvMinutes?: CvMinuteInterface[];
  createdAt: Date;
  updatedAt: Date;
}
