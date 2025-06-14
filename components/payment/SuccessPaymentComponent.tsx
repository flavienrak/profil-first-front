'use client';

import React from 'react';

import { useParams, useRouter } from 'next/navigation';
import { stripeSessionService } from '@/services/payment.service';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { updatePaymentReducer } from '@/redux/slices/user.slice';

export default function SuccessPaymentComponent() {
  const params = useParams();
  const router = useRouter();

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (params.sessionId) {
      (async () => {
        const res = await stripeSessionService(params.sessionId as string);

        if (res.payment) {
          if (res.payment.status === 'paid') {
            toast.success('Payement effectué avec succès', {
              description: 'Retour à la page',
            });
          } else if (res.payment.status === 'open') {
            toast.warning('Payement en attente', {
              description: 'Retour à la page',
            });
          } else if (res.payment.status === 'void') {
            toast.success('Payement annulé', {
              description: 'Retour à la page',
            });
          }

          dispatch(updatePaymentReducer({ payment: res.payment }));

          router.push('/mon-plan');
        } else {
          router.push('/');
        }
      })();
    }
  }, [params.sessionId]);

  return (
    <div className="w-full min-h-screen [background-image:var(--bg-primary)]"></div>
  );
}
