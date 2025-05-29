import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function StepLoader() {
  return (
    <div className="w-full h-full flex flex-col gap-12 p-12">
      <div className="flex justify-center">
        <Skeleton className="w-52 h-10 rounded-md bg-[var(--bg-primary-color)]" />
      </div>
      <div className="flex-1 flex gap-12">
        <Skeleton className="flex-1 h-full rounded-xl bg-[var(--bg-primary-color)]" />
        <Skeleton className="flex-1 h-full rounded-xl bg-[var(--bg-primary-color)]" />
      </div>
    </div>
  );
}
