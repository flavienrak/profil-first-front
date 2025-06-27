import api from '@/axios/axios.instance';

import { PaymentType } from '@/interfaces/payment.interface';

const stripeService = async (type: PaymentType) => {
  try {
    const res = await api.post('/payment/stripe', { type });
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
