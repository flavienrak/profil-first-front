'use client';

import React from 'react';
import qs from 'query-string';

import { jwtIdService } from '@/services/auth.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getUserService } from '@/services/user.service';
import { useDispatch } from 'react-redux';
import { setUserReducer } from '@/redux/slices/user.slice';
import { setCvMinuteReducer } from '@/redux/slices/cvMinute.slice';
import { getCvMinuteService } from '@/services/cvMinute.service';

interface CurrentQueryInterface {
  cvMinute?: string | number;
  [key: string]: string | number | boolean | null | undefined;
}
interface UidContextType {
  isLoading: boolean;
  currentQuery: CurrentQueryInterface | null;
  handleVideo: (value: string) => string;
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
  const pathname = usePathname();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const router = useRouter();

  const [currentQuery, setCurrentQuery] =
    React.useState<CurrentQueryInterface | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userId, setUserId] = React.useState<string | number | null>(null);

  const notProtectedPaths = ['/'];

  React.useEffect(() => {
    (async () => {
      console.log('NEXT_PUBLIC_VIDEO_URI:', process.env.NEXT_PUBLIC_VIDEO_URI);
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
  }, []);

  React.useEffect(() => {
    if (userId) {
      (async () => {
        const res = await getUserService();
        if (res.user) {
          dispatch(setUserReducer({ user: res.user }));
        }
      })();
    }
  }, [userId]);

  React.useEffect(() => {
    const updateQuery = qs.parse(params.toString());
    setCurrentQuery(updateQuery as CurrentQueryInterface);
  }, [params]);

  React.useEffect(() => {
    const updateQuery = currentQuery;

    if (updateQuery?.cvMinute) {
      const cvMinute = updateQuery.cvMinute;

      if (isNaN(Number(updateQuery.cvMinute))) {
        delete updateQuery.cvMinute;

        const url = qs.stringifyUrl({
          url: pathname,
          query: updateQuery,
        });
        router.push(url);
      } else {
        (async () => {
          const res = await getCvMinuteService(Number(cvMinute));
          if (res.cvMinute) {
            dispatch(
              setCvMinuteReducer({
                cvMinute: res.cvMinute,
                sections: res.sections,
                cvMinuteSections: res.cvMinuteSections,
                files: res.files,
              }),
            );
          }
        })();
      }
    }
  }, [currentQuery?.cvMinute]);

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
