import React from 'react';
import MesAbonnementsComponent from '@/components/role/user/mes-abonnements/MesAbonnementsComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mes Abonnements',
  description: 'Mes Abonnements Profil First',
};

export default function MesAbonnementsPage() {
  return (
    <div className="w-full h-full">
      <MesAbonnementsComponent />
    </div>
  );
}
