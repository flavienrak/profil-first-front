'use client';

import React from 'react';
import Link from 'next/link';
import StepLoader from '@/components/role/user/quali-carriere/step/StepLoader';
import Popup from '@/components/utils/Popup';

import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestionService } from '@/services/role/user/qualiCarriere.service';
import { setQuestionReducer } from '@/redux/slices/role/user/qualiCarriere.slice';
import { RootState } from '@/redux/store';
import { useSocket } from '@/providers/Socket.provider';

export default function StepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSelector((state: RootState) => state.user);
  const { isSocketReady } = useSocket();

  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = React.useState(false);
  const [questionLoaded, setQuestionLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (user?.qualiCarriere === 'active') {
      router.push('/quali-carriere/success');
    } else if (params.step && isSocketReady) {
      if (isNaN(Number(params.step))) {
        router.push('/quali-carriere');
      } else {
        (async () => {
          const res = await getQuestionService();

          if (res.nextStep) {
            dispatch(
              setQuestionReducer({
                cvMinute: res.cvMinute,
                messages: res.messages,
              }),
            );

            if (Number(params.step) !== 2) {
              router.push('/quali-carriere/2');
            }
          } else if (res.nextQuestion) {
            if (Number(params.step) !== 1) {
              router.push('/quali-carriere/1');
            }
          } else if (res.noExperiences) {
            setShowModal(true);
          }

          setQuestionLoaded(true);
        })();
      }
    }
  }, [params.step, user?.qualiCarriere, isSocketReady]);

  return (
    <div className="relative h-full w-full max-h-full flex justify-center overflow-y-auto">
      {showModal ? (
        <Popup onClose={() => router.push('/cv-offres')}>
          <div className="flex items-center flex-col gap-6">
            <p className="max-w-4/5 text-center text-lg tracking-wide">
              Veuillez mettre au moins une expérience dans votre CV.
            </p>
            <Link
              href={'/cv-offres'}
              onClick={() => setIsLoading(true)}
              className={`w-full flex justify-center items-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] text-white rounded-full font-semibold ${
                isLoading
                  ? 'opacity-80 pointer-events-none'
                  : 'hover:opacity-80 transition-opacity duration-150 cursor-pointer'
              }`}
            >
              {isLoading && (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-5 h-5 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              <span>J'ai compris</span>
            </Link>
          </div>
        </Popup>
      ) : questionLoaded && !showModal ? (
        <div className="max-w-7xl w-full h-full">{children}</div>
      ) : (
        <div className="max-w-7xl w-full h-full flex justify-center items-center">
          <StepLoader />
        </div>
      )}
    </div>
  );
}
