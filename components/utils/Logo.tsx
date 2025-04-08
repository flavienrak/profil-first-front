import { Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Logo({
  href,
  showText = true,
}: {
  href: string;
  showText?: boolean;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 select-none">
        <div className="text-[var(--secondary-color)] w-8 h-8">
          <Users className="w-full h-full" strokeWidth={2.5} />
        </div>
        {showText && (
          <span
            className={`font-bold text-2xl text-[var(--secondary-color)] transition-all duration-500 overflow-hidden inline-block whitespace-nowrap ${
              showText ? 'max-w-auto opacity-100' : 'max-w-0 opacity-0'
            }`}
          >
            ProfilFirst
          </span>
        )}
      </div>
    </Link>
  );
}
