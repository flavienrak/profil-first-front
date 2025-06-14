import React from 'react';
import SuccessPaymentComponent from '@/components/payment/SuccessPaymentComponent';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Success Payment',
  description: 'Success Payment Profil First',
};

export default function SuccessPayementPage() {
  return (
    <div className="w-full">
      <SuccessPaymentComponent />
    </div>
  );
}
