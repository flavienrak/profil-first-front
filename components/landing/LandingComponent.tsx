import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LandingComponent() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex gap-8 p-8">
        <Button asChild className="cursor-pointer">
          <Link href={'/auth/login'}>Connexion</Link>
        </Button>
        <Button asChild className="cursor-pointer">
          <Link href={'/auth/register'}>Inscription</Link>
        </Button>
      </div>
    </div>
  );
}
