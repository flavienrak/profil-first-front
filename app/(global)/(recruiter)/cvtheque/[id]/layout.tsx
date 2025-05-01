'use client';

import React from 'react';
import Loading from '@/app/loading';

import { useParams, useRouter } from 'next/navigation';
import { getCvCritereService } from '@/services/role/recruiter/cvtheque.service';
import { useDispatch } from 'react-redux';
import { setCvThequeReducer } from '@/redux/slices/role/recruiter/cvtheque.slice';

export default function CvThequeDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (params.id) {
      if (isNaN(Number(params.id))) {
        router.push('/cvtheque');
      } else {
        (async () => {
          const res = await getCvCritereService(Number(params.id));

          if (res.cvCritere) {
            dispatch(setCvThequeReducer({ cvCritere: res.cvCritere }));
          }
          setIsLoading(false);
        })();
      }
    }
  }, [params.id]);

  if (isLoading) return <Loading />;
  return <>{children}</>;
}
