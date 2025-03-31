import LandingComponent from '@/components/landing/LandingComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accueil',
  description: 'Accueil Profil First',
};

export default function Landing() {
  return (
    <div className="relative w-full min-h-screen">
      <LandingComponent />
    </div>
  );
}
