'use client';

import React from 'react';
import Loading from '@/app/loading';

import { UidContext } from '@/providers/UidProvider';
import { SocketContext } from '@/providers/SocketProvider';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const uidContext = React.useContext(UidContext);
  const socketContext = React.useContext(SocketContext);

  if (uidContext && !uidContext.isLoading && socketContext)
    return <>{children}</>;
  return <Loading />;
}
