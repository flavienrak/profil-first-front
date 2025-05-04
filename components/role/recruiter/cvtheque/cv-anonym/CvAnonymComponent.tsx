'use client';

import React from 'react';
import CvAnonymPreview from './CvAnonymPreview';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { getCvAnonymService } from '@/services/role/recruiter/cvtheque.service';
import { setCvAnonymReducer } from '@/redux/slices/role/recruiter/cvtheque.slice';
import { useParams, useRouter } from 'next/navigation';
import { updatePersistReducer } from '@/redux/slices/persist.slice';

export default function CvAnonymComponent() {
  const { fontSize, showCritere } = useSelector(
    (state: RootState) => state.persistInfos,
  );
  const { cvThequeCritere, cvAnonym, sections } = useSelector(
    (state: RootState) => state.cvTheque,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (params.id && params.cvAnonymId) {
      if (isNaN(Number(params.id)) || !cvThequeCritere) {
        router.push('/cvtheque');
      } else if (isNaN(Number(params.cvAnonymId))) {
        router.push(`/cvtheque/${params.id}`);
      } else {
        (async () => {
          setIsLoading(true);
          const res = await getCvAnonymService(
            cvThequeCritere.id,
            Number(params.cvAnonymId),
          );

          if (res.cvAnonym) {
            dispatch(
              setCvAnonymReducer({
                cvAnonym: res.cvAnonym,
                sections: res.sections,
              }),
            );
          } else {
            router.push(`/cvtheque/${params.id}`);
          }
          setIsLoading(false);
        })();
      }
    }
  }, [params.id, params.cvAnonymId]);

  React.useEffect(() => {
    if (showCritere && fontSize > 11) {
      dispatch(updatePersistReducer({ fontSize: 11 }));
    } else if (!showCritere && fontSize < 16) {
      dispatch(updatePersistReducer({ fontSize: 16 }));
    }
  }, [showCritere]);

  if (cvAnonym)
    return (
      <div
        className="h-full w-full flex justify-center items-center"
        style={{ fontSize: `${fontSize}px` }}
      >
        <CvAnonymPreview cvAnonym={cvAnonym} sections={sections} />
      </div>
    );
}
