import { AdviceInterface } from './advice.interface';

export interface CvMinuteInterface {
  id: number;
  position: string;
  background: string;
  primaryColor: string;
  userId: number;

  advices: AdviceInterface[];
  createdAt: Date;
  updatedAt: Date;
}
