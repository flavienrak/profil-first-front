import React from 'react';
import RegisterComponent from '@/components/inscription/RegisterComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscription',
  description: 'Inscription Profil First',
};

export default function Inscription() {
  return (
    <div>
      <RegisterComponent />
    </div>
  );
}
