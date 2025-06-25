'use client';

import React from 'react';
import Fireworks from './Fireworks';
import CongratulationsContent from './CongratulationsContent';

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
          dispatch(updatePaymentReducer({ payment: res.payment }));
        } else {
          router.push('/');
        }
      })();
    }
  }, [params.sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Effet de fond avec dégradé animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 animate-gradient-shift"></div>

      {/* Motif de fond subtil */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        ></div>
      </div>

      {/* Feu d'artifice */}
      <Fireworks />

      {/* Contenu principal */}
      <CongratulationsContent />
    </div>
  );
}
