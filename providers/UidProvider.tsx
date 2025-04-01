'use client';

import { jwtIdService } from '@/services/auth.service';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface UidContextType {
  apiUrl: string;
}

export const UidContext = React.createContext<UidContextType | undefined>(
  undefined,
);

export default function UidProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const res = await jwtIdService();
      console.log('res:', res);
    })();
  }, []);

  return (
    <UidContext.Provider value={{ apiUrl }}>{children}</UidContext.Provider>
  );
}
