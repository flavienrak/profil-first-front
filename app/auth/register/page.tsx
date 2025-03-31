import React from 'react';
import RegisterComponent from '@/components/auth/register/RegisterComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscription',
  description: 'Inscription Profil First',
};

export default function Register() {
  return (
    <div>
      <RegisterComponent />
    </div>
  );
}
