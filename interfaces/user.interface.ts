import { CvMinuteInterface } from './cv-minute/cvMinute.interface';
import { FileInterface } from './file.interface';

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  acceptConditions: boolean;
  role: 'user' | 'recruiter' | 'admin';

  files: FileInterface[];
  cvMinutes: CvMinuteInterface[];
  createdAt: Date;
  updatedAt: Date;
}
