'use client';

import React from 'react';
import qs from 'query-string';
import Loading from '@/app/loading';

import { jwtService } from '@/services/auth.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getUserService } from '@/services/all-user.service';
import { useDispatch } from 'react-redux';
import { setUserReducer } from '@/redux/slices/user.slice';
import { recruiterRoutes, userRoutes } from '@/lib/constants';

interface CurrentQueryInterface {
  step?: string | number;
  cvMinute?: string | number;
  [key: string]: string | number | boolean | null | undefined;
}
interface UserProviderContextType {
  isLoading: boolean;
  currentQuery: CurrentQueryInterface | null;
  handleRemoveQuery: (value: string) => void;
}

export const videoUri = process.env.NEXT_PUBLIC_VIDEO_URI;
export const backendUri = process.env.NEXT_PUBLIC_API_URL;

const UserContext = React.createContext<UserProviderContextType | undefined>(
  undefined,
);

export const useUser = (): UserProviderContextType => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  const [currentQuery, setCurrentQuery] =
    React.useState<CurrentQueryInterface | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userId, setUserId] = React.useState<string | number | null>(null);

  const notProtectedPaths = ['/'];

  React.useEffect(() => {
    (async () => {
      const res = await jwtService();

      if (res.user) {
        setUserId(res.user.id);

        if (res.user.role === 'user') {
          if (!userRoutes.some((r) => pathname.startsWith(r.href))) {
            window.location.href =
              userRoutes.find((item) => item.ref)?.href ?? '/';
          } else {
            setIsLoading(false);
          }
        } else {
          if (!recruiterRoutes.some((r) => pathname.startsWith(r.href))) {
            window.location.href =
              recruiterRoutes.find((item) => item.ref)?.href ?? '/';
          } else {
            setIsLoading(false);
          }
        }
      } else {
        if (!notProtectedPaths.includes(pathname)) {
          window.location.href = '/';
        } else {
          setIsLoading(false);
        }
      }
    })();
  }, [pathname]);

  React.useEffect(() => {
    if (userId) {
      (async () => {
        const res = await getUserService();

        if (res.user) {
          dispatch(
            setUserReducer({
              user: res.user,
              cvMinuteCount: res.cvMinuteCount,
            }),
          );
        }
      })();
    }
  }, [userId]);

  React.useEffect(() => {
    const updateQuery = qs.parse(params.toString());
    setCurrentQuery(updateQuery as CurrentQueryInterface);
  }, [params]);

  const handleRemoveQuery = (value: string) => {
    if (currentQuery) {
      const updateQuery = currentQuery;
      delete updateQuery[value];

      const url = qs.stringifyUrl({
        url: pathname,
        query: updateQuery,
      });
      router.push(url);
    }
  };

  return (
    <UserContext.Provider
      value={{
        isLoading,
        currentQuery,
        handleRemoveQuery,
      }}
    >
      {isLoading ? <Loading /> : children}
    </UserContext.Provider>
  );
}
