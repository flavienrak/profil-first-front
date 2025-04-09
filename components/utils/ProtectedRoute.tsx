'use client';

import React from 'react';
import Loading from '@/app/loading';

import { UidContext } from '@/providers/UidProvider';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = React.useContext(UidContext);

  if (context && !context.isLoading) return <>{children}</>;
  return <Loading />;
}
