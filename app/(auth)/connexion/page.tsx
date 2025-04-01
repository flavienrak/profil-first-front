import React from 'react';
import LoginComponent from '@/components/connexion/LoginComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connexion Profil First',
};

export default function Connexion() {
  return (
    <div>
      <LoginComponent />
    </div>
  );
}
