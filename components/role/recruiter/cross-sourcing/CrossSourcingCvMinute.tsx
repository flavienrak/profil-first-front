'use client';

import React from 'react';
import CrossSourcingCvPreview from './CrossSourcingCvPreview';

import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { getUserCvMinuteService } from '@/services/role/recruiter/cross-sourcing.service';
import { setUserCvMinuteReducer } from '@/redux/slices/role/recruiter/cross-sourcing.slice';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { updatePersistReducer } from '@/redux/slices/persist.slice';

export default function CrossSourcingCvMinute() {
  const { fontSize } = useSelector((state: RootState) => state.persistInfos);
  const { cvMinutes, actualCvMinute } = useSelector(
    (state: RootState) => state.crossSourcing,
  );

  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [loadingCvMinute, setLoadingCvMinute] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    if (params.cvMinuteId) {
      (async () => {
        const res = await getUserCvMinuteService({
          id: Number(params.userId),
          cvMinuteId: Number(params.cvMinuteId),
        });

        if (isMounted) {
          if (res.cvMinute) {
            dispatch(setUserCvMinuteReducer({ cvMinute: res.cvMinute }));
          } else {
            router.push(`/cross-sourcing/${params.userId}`);
          }
          setLoadingCvMinute(false);
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, [params.cvMinuteId, cvMinutes]);

  const increaseFontSize = () => {
    dispatch(updatePersistReducer({ fontSize: fontSize + 1 }));
  };

  const decreaseFontSize = () => {
    dispatch(updatePersistReducer({ fontSize: fontSize - 1 }));
  };

  if (actualCvMinute)
    return (
      <div className="h-full w-full flex flex-col gap-4 bg-[var(--bg-secondary-color)] rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="w-full flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--r-primary-color)] to-[#22D3EE] bg-clip-text text-transparent">
              {actualCvMinute.name}
            </h2>
            <div className="flex items-center gap-2">
              <i
                onClick={increaseFontSize}
                className="h-8 w-8 flex justify-center items-center text-[var(--text-secondary-gray)] hover:bg-[var(--text-primary-color)]/10 cursor-pointer rounded-[0.35em]"
              >
                <ZoomIn size={20} />
              </i>
              <i
                onClick={decreaseFontSize}
                className="h-8 w-8 flex justify-center items-center text-[var(--text-secondary-gray)] hover:bg-[var(--text-primary-color)]/10 cursor-pointer rounded-[0.35em]"
              >
                <ZoomOut size={20} />
              </i>
            </div>
          </div>
        </div>

        <div className="relative flex-1 bg-[var(--bg-primary-color)] rounded-lg overflow-auto">
          <div className="flex items-center justify-center h-full text-[var(--text-secondary-gray)]">
            <CrossSourcingCvPreview cvMinute={actualCvMinute} />
          </div>
        </div>
      </div>
    );
}
