'use client';

import React from 'react';
import qs from 'query-string';

import { jwtIdService } from '@/services/auth.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getUserService } from '@/services/user.service';
import { useDispatch } from 'react-redux';
import { setUserReducer } from '@/redux/slices/user.slice';

interface CurrentQueryInterface {
  step?: string | number;
  cvMinute?: string | number;
  [key: string]: string | number | boolean | null | undefined;
}
interface UidContextType {
  isLoading: boolean;
  currentQuery: CurrentQueryInterface | null;
  loadingQuestion: boolean | null;
  setLoadingQuestion: (value: boolean) => void;
  handleVideo: (value: string) => string;
  handleRemoveQuery: (value: string) => void;
}

export const UidContext = React.createContext<UidContextType | undefined>(
  undefined,
);

export const videoUri = process.env.NEXT_PUBLIC_VIDEO_URI;

export default function UidProvider({
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
  const [loadingQuestion, setLoadingQuestion] = React.useState<boolean | null>(
    null,
  );
  const [userId, setUserId] = React.useState<string | number | null>(null);

  const notProtectedPaths = ['/'];

  React.useEffect(() => {
    (async () => {
      const res = await jwtIdService();

      if (res.userId) {
        setUserId(res.userId);
        if (notProtectedPaths.includes(pathname)) {
          window.location.href = '/cv-minute';
        }
      } else if (
        res.notAuthenticated &&
        !notProtectedPaths.includes(pathname)
      ) {
        window.location.href = '/';
      }

      setIsLoading(false);
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

  const handleVideo = (link: string) => {
    let newLink = link;
    const findLink = link.split(' ');
    for (let i = 0; i < findLink.length; i++) {
      if (
        findLink[i].includes('https://www.yout') ||
        findLink[i].includes('https://yout')
      ) {
        const embed = findLink[i].replace('watch?v=', 'embed/');
        newLink = embed.split('&')[0];
      }
    }
    return newLink;
  };

  return (
    <UidContext.Provider
      value={{
        isLoading,
        currentQuery,
        loadingQuestion,
        handleVideo,
        setLoadingQuestion,
        handleRemoveQuery,
      }}
    >
      {children}
    </UidContext.Provider>
  );
}
