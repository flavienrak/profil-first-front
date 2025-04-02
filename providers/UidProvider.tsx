'use client';

import React, { useEffect, useState } from 'react';
import { jwtIdService } from '@/services/auth.service';
import { usePathname, useRouter } from 'next/navigation';

interface UidContextType {
  isLoading: boolean;
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const notProtectedPaths = ['/'];

  useEffect(() => {
    (async () => {
      const res = await jwtIdService();
      setIsLoading(false);

      if (res.notAuthenticated && !notProtectedPaths.includes(pathname)) {
        router.push('/');
      }
    })();
  }, [pathname]);

  return (
    <UidContext.Provider value={{ isLoading }}>{children}</UidContext.Provider>
  );
}
