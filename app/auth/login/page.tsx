import React from 'react';
import LoginComponent from '@/components/auth/login/LoginComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connexion Profil First',
};

export default function Login() {
  return (
    <div>
      <LoginComponent />
    </div>
  );
}
