'use client';

import React from 'react';
import qs from 'query-string';

import { jwtIdService } from '@/services/auth.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getUserService } from '@/services/user.service';
import { useDispatch } from 'react-redux';
import { setUserReducer } from '@/redux/slices/user.slice';
import { setCvMinuteReducer } from '@/redux/slices/cvMinute.slice';

interface UidContextType {
  isLoading: boolean;
  currentQuery: { cvMinute: string | number };
  handleVideo: (value: string) => string;
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
  const dispatch = useDispatch();
  const params = useSearchParams();
  const router = useRouter();

  const [currentQuery, setCurrentQuery] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [userId, setUserId] = React.useState<string | number | null>(null);

  const notProtectedPaths = ['/'];

  React.useEffect(() => {
    (async () => {
      const res = await jwtIdService();

      if (res.userId) {
        setUserId(res.userId);
      } else if (
        res.notAuthenticated &&
        !notProtectedPaths.includes(pathname)
      ) {
        window.location.href = '/';
      }

      setIsLoading(false);
    })();
  }, []);

  React.useEffect(() => {
    if (userId) {
      (async () => {
        const res = await getUserService();
        if (res.user) {
          dispatch(setUserReducer({ user: res.user }));
          dispatch(setCvMinuteReducer({ count: res.cvMinuteCount }));
        }
      })();
    }
  }, [userId]);

  React.useEffect(() => {
    const updateQuery = qs.parse(params.toString());
    if (updateQuery.cvMinute && isNaN(Number(updateQuery.cvMinute))) {
      delete updateQuery.cvMinute;
    }

    setCurrentQuery(updateQuery);
    const url = qs.stringifyUrl({
      url: pathname,
      query: updateQuery,
    });
    router.push(url);
  }, [params]);

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
    <UidContext.Provider value={{ isLoading, currentQuery, handleVideo }}>
      {children}
    </UidContext.Provider>
  );
}
