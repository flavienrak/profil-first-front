import { Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Logo({ href }: { href: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3">
        <div className="text-[var(--secondary-color)] w-8 h-8">
          <Users className="w-full h-full" strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-bold text-[var(--secondary-color)]">
          ProfilFirst
        </span>
      </div>
    </Link>
  );
}
