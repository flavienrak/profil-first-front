import HomeComponent from '@/components/home/HomeComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accueil',
  description: 'Accueil Profil First',
};

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      <HomeComponent />
    </div>
  );
}
