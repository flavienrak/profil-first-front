import { CvMinuteInterface } from './role/user/cv-minute/cvMinute.interface';
import { FileInterface } from './file.interface';
import { CvThequeCritereInterface } from './role/recruiter/cvtheque/cvtheque-critere.interface';
import { CvThequeUserInterface } from './role/recruiter/cvtheque/cvtheque-user.interface';
import { UserDomainInterface } from './user-domain.interface';
import { CvThequeHistoryInterface } from './role/recruiter/cvtheque/cvtheque-history';

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  acceptConditions: boolean;
  role: 'user' | 'recruiter' | 'admin';
  qualiCarriere: string;
  image: string;

  userDomains?: UserDomainInterface[];
  files?: FileInterface[];
  cvMinutes?: CvMinuteInterface[];
  cvThequeCriteres?: CvThequeCritereInterface[];
  cvThequeUsers?: CvThequeUserInterface[];
  cvThequeHistory?: CvThequeHistoryInterface;

  createdAt: Date;
  updatedAt: Date;
}
