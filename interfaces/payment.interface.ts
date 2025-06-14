import { CreditInterface } from './credit.interface';

export type PaymentType = 'premium' | 'booster' | 'quali-carriere';

export interface PaymentInterface {
  id: number;
  amount: number;
  currency: string;
  type: PaymentType;
  sessionId: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void	';
  expiredAt?: Date;
  paymentId: number;
  userId: number;

  credit?: CreditInterface;

  createdAt: Date;
  updatedAt: Date;
}
