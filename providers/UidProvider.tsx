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
import {
  setQuestionReducer,
  setResumeReducer,
} from '@/redux/slices/qualiCarriere.slice';
import { getQuestionService } from '@/services/qualiCarriere.service';

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
  }, []);

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

    if (updateQuery?.step) {
      if (isNaN(Number(updateQuery.step))) {
        delete updateQuery.step;

        const url = qs.stringifyUrl({
          url: pathname,
          query: updateQuery,
        });
        router.push(url);
      } else {
        (async () => {
          setLoadingQuestion(true);
          const res = await getQuestionService();

          if (res.nextStep) {
            let currentQuery = null;
            currentQuery = qs.parse(params.toString());
            const updateQuery = {
              ...currentQuery,
              step: 2,
            };
            const url = qs.stringifyUrl({
              url: pathname,
              query: updateQuery,
            });

            dispatch(
              setResumeReducer({
                qualiCarriereResume: res.qualiCarriereResume,
                messages: res.messages,
              }),
            );
            router.push(url);
          } else if (res.question) {
            if (Number(currentQuery?.step) !== 1) {
              let currentQuery = null;
              currentQuery = qs.parse(params.toString());
              const updateQuery = {
                ...currentQuery,
                step: 1,
              };
              const url = qs.stringifyUrl({
                url: pathname,
                query: updateQuery,
              });

              router.push(url);
            } else {
              dispatch(
                setQuestionReducer({
                  question: res.question,
                  qualiCarriereQuestion: res.qualiCarriereQuestion,
                }),
              );
            }
          }
        })();
      }
    }
  }, [currentQuery]);

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
        setLoadingQuestion,
        handleVideo,
        handleRemoveQuery,
      }}
    >
      {children}
    </UidContext.Provider>
  );
}
