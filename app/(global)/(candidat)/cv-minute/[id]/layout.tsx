'use client';

import React from 'react';

import { useParams, useRouter } from 'next/navigation';
import { getCvMinuteService } from '@/services/role/candidat/cvMinute.service';
import { useDispatch } from 'react-redux';
import { setCvMinuteReducer } from '@/redux/slices/role/candidat/cvMinute.slice';
import { Skeleton } from '@/components/ui/skeleton';

export default function CvMinuteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    if (params.id) {
      if (isNaN(Number(params.id))) {
        router.push('/cv-minute');
      } else {
        (async () => {
          setIsLoading(true);

          const res = await getCvMinuteService(Number(params.id));

          if (isMounted) {
            if (res.cvMinute) {
              dispatch(
                setCvMinuteReducer({
                  cvMinute: res.cvMinute,
                  sections: res.sections,
                  cvMinuteSections: res.cvMinuteSections,
                  files: res.files,
                }),
              );
            } else {
              router.push('/cv-minute');
            }

            setIsLoading(false);
          }
        })();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  return (
    <div className="h-full">
      {isLoading ? (
        <div>
          <Skeleton />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
