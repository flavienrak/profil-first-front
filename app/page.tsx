import LandingComponent from '@/components/landing/LandingComponent';
import ProtectedRoute from '@/components/utils/global/ProtectedRoute';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accueil',
  description: 'Accueil Profil First',
};

export default function Landing() {
  return (
    <div className="relative w-full min-h-screen">
      <ProtectedRoute>
        <LandingComponent />
      </ProtectedRoute>
    </div>
  );
}
