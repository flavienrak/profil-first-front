'use client';

import React from 'react';
import QualiCarriereChat from '@/components/role/candidat/quali-carriere/step/chat/QualiCarriereChat';
import QualiCarriereSynthese from './QualiCarriereSynthese';

import { useParams } from 'next/navigation';

export default function QualiCarriereStep() {
  const params = useParams();

  return (
    <>
      {Number(params.step) === 1 ? (
        <QualiCarriereChat />
      ) : (
        <QualiCarriereSynthese />
      )}
    </>
  );
}
