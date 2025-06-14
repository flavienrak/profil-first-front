'use client';

import React from 'react';
import qs from 'query-string';
import Loading from '@/app/loading';

import { loadStripe } from '@stripe/stripe-js';
import { jwtService } from '@/services/auth.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getUserService } from '@/services/all-user.service';
import { useDispatch, useSelector } from 'react-redux';
import { setUserReducer } from '@/redux/slices/user.slice';
import { recruiterRoutes, userRoutes } from '@/lib/constants';
import { RootState } from '@/redux/store';

interface CurrentQueryInterface {
  step?: string | number;
  cvMinute?: string | number;
  [key: string]: string | number | boolean | null | undefined;
}

interface UserProviderContextType {
  isLoading: boolean;
  credits: number;
  handleRemoveQuery: (value: string) => void;
}

export const videoUri = process.env.NEXT_PUBLIC_VIDEO_URI as string;
export const backendUri = process.env.NEXT_PUBLIC_API_URL as string;
export const stripePublishableKey = process.env
  .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;

export const stripePromise = loadStripe(stripePublishableKey);

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
  const { user } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  const [currentQuery, setCurrentQuery] =
    React.useState<CurrentQueryInterface | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userId, setUserId] = React.useState<string | number | null>(null);
  const [credits, setCredits] = React.useState(0);

  const notProtectedPaths = ['/', '/conditions'];
  const notProtectedPathsRegex = /^\/(payment)\/[^\/]+$/;
  const globalPaths = ['/conditions'];

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      const res = await jwtService();

      if (isMounted) {
        if (res.user) {
          setUserId(res.user.id);

          if (res.user.role === 'user') {
            if (
              !userRoutes.some((r) => pathname.startsWith(r.href)) &&
              !globalPaths.includes(pathname) &&
              !notProtectedPathsRegex.test(pathname)
            ) {
              window.location.href =
                userRoutes.find((item) => item.ref)?.href ?? '/';
            } else {
              setIsLoading(false);
            }
            setIsLoading(false);
          } else {
            if (
              !recruiterRoutes.some((r) => pathname.startsWith(r.href)) &&
              !globalPaths.includes(pathname) &&
              !notProtectedPathsRegex.test(pathname)
            ) {
              window.location.href =
                recruiterRoutes.find((item) => item.ref)?.href ?? '/';
            } else {
              setIsLoading(false);
            }
            setIsLoading(false);
          }
        } else {
          if (
            !notProtectedPaths.includes(pathname) &&
            !globalPaths.includes(pathname)
          ) {
            window.location.href = '/';
          } else {
            setIsLoading(false);
          }
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  React.useEffect(() => {
    let isMounted = true;

    if (userId) {
      (async () => {
        const res = await getUserService();

        if (isMounted) {
          if (res.user) {
            dispatch(
              setUserReducer({
                user: res.user,
                cvMinuteCount: res.cvMinuteCount,
              }),
            );
          }
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, [userId]);

  React.useEffect(() => {
    if (user && user.payments) {
      const actualCredits = user.payments.reduce((sum, item) => {
        if (item.credit && item.credit.value) {
          if (item.type === 'booster') {
            return sum + item.credit.value;
          } else if (
            item.type === 'premium' &&
            item.expiredAt &&
            new Date(item.expiredAt) > new Date()
          ) {
            return sum + item.credit.value;
          }
        }
        return sum;
      }, 0);

      setCredits(actualCredits);
    }
  }, [user?.payments]);

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
        credits,
        handleRemoveQuery,
      }}
    >
      {isLoading ? <Loading /> : children}
    </UserContext.Provider>
  );
}
