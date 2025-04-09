import { AdviceInterface } from './advice.interface';

export interface CvMinuteInterface {
  id: number;
  position: string;
  primaryBg: string;
  secondaryBg: string;
  tertiaryBg: string;
  userId: number;

  advices: AdviceInterface[];
  createdAt: Date;
  updatedAt: Date;
}
