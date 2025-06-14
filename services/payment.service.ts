import api from '@/axios/axios.instance';

import { PaymentType } from '@/interfaces/payment.interface';

const stripeService = async (data: {
  amount: number;
  name: string;
  type: PaymentType;
}) => {
  try {
    const res = await api.post('/payment/stripe', {
      amount: data.amount,
      name: data.name,
      type: data.type,
    });
    return res.data;
  } catch (error) {
    return { error: `STRIPE PAYMENT ERROR: ${error}` };
  }
};

const stripeSessionService = async (sessionId: string) => {
  try {
    const res = await api.get(`/payment/stripe/${sessionId}`);
    return res.data;
  } catch (error) {
    return { error: `STRIPE SESSION ERROR: ${error}` };
  }
};

export { stripeService, stripeSessionService };
