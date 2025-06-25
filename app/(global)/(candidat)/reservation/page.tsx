import React from 'react';
import ReservationComponent from '@/components/role/candidat/reservation/ReservationComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Réservation Séance',
  description: 'Réservation Séance Profil First',
};

export default function ReservationPage() {
  return (
    <div className="w-full h-full">
      <ReservationComponent />
    </div>
  );
}
