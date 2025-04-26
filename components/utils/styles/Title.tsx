import React from 'react';

import { cn } from '@/lib/utils';

export default function Title({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        'text-4xl font-bold text-center bg-gradient-to-r from-[#4461F2] to-[#6B7FFF] bg-clip-text text-transparent',
        className,
      )}
    >
      {value}
    </h1>
  );
}
