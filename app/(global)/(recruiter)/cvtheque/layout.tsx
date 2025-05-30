'use client';

import React from 'react';
import Link from 'next/link';
import Popup from '@/components/utils/Popup';

import { useDispatch, useSelector } from 'react-redux';
import { updatePersistReducer } from '@/redux/slices/persist.slice';
import { RootState } from '@/redux/store';
import { ArrowRight, Clock } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  saveCvThequeCritereService,
  getCvThequeHistoryService,
  resendCvThequeCritereService,
} from '@/services/role/recruiter/cvtheque.service';
import {
  resetCvAnonymReducer,
  resetCvThequeReducer,
  setCvThequeHistoryReducer,
  saveCvThequeCritereReducer,
  setCvThequeCritereReducer,
} from '@/redux/slices/role/recruiter/cvtheque.slice';
import { formatDateFr } from '@/lib/function';
import { toast } from 'sonner';

export default function CvThequeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cvThequeCritere, history } = useSelector(
    (state: RootState) => state.cvTheque,
  );
  const { showCritere } = useSelector((state: RootState) => state.persistInfos);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [showHistory, setShowHistory] = React.useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<number | null>(null);
  const [redirectLoading, setRedirectLoading] = React.useState<number | null>(
    null,
  );

  React.useEffect(() => {
    if (pathname === '/cvtheque') {
      dispatch(resetCvThequeReducer());
    } else if (!params.cvAnonymId) {
      dispatch(resetCvAnonymReducer());
    }

    (async () => {
      const res = await getCvThequeHistoryService();

      if (res.history) {
        dispatch(setCvThequeHistoryReducer({ history: res.history }));
      }
    })();
  }, [pathname, params.cvAnonymId]);

  React.useEffect(() => {
    if (cvThequeCritere) {
      setShowHistory(false);
      setRedirectLoading(null);
    }
  }, [cvThequeCritere]);

  const handleSaveCvThequeCritere = async () => {
    if (cvThequeCritere) {
      setSaveLoading(true);
      const res = await saveCvThequeCritereService(cvThequeCritere.id);

      if (res.cvThequeCritere) {
        dispatch(
          saveCvThequeCritereReducer({
            cvThequeCritere: res.cvThequeCritere,
          }),
        );

        toast.success('Recherche enregistrée avec succès !');
      }

      setSaveLoading(false);
    }
  };

  const handleResendSearch = async (id: number) => {
    if (cvThequeCritere) {
      setIsLoading(id);
      const res = await resendCvThequeCritereService(cvThequeCritere.id);

      if (res.cvThequeCritere) {
        dispatch(
          setCvThequeCritereReducer({ cvThequeCritere: res.cvThequeCritere }),
        );
        router.push(`/cvtheque/${res.cvThequeCritere.id}`);
      }
      setIsLoading(null);
      setShowHistory(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full px-8 h-20 border-b border-[var(--text-primary-color)]/10 flex items-center">
        <div className="w-full flex items-center justify-between gap-6">
          <button
            onClick={() =>
              dispatch(updatePersistReducer({ showCritere: !showCritere }))
            }
            className="px-4 py-2 text-[var(--r-secondary-white)] font-bold hover:bg-[var(--text-primary-color)]/5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            {showCritere ? 'Masquer' : 'Afficher'} mes critères
          </button>
          <div className="flex items-center gap-4">
            {cvThequeCritere && !cvThequeCritere.saved && (
              <button
                onClick={handleSaveCvThequeCritere}
                className={`flex items-center gap-2 text-[var(--r-primary-white)] px-4 py-2 rounded-lg bg-[var(--text-primary-color)]/5 ${
                  saveLoading
                    ? 'opacity-80 pointer-events-none'
                    : 'hover:bg-[var(--text-primary-color)]/10 cursor-pointer'
                }`}
              >
                {saveLoading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 animate-spin"
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
                <span>Enregistrer ma recherche</span>
              </button>
            )}
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="text-[var(--text-secondary-gray)] hover:text-[var(--r-primary-color)] transition-colors px-4 py-2 rounded-lg hover:bg-[var(--r-primary-color)]/10 cursor-pointer"
              >
                Historique
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-5rem)] overflow-y-auto">
        {children}
      </div>

      {showHistory && (
        <Popup large onClose={() => setShowHistory(false)}>
          <div className="flex flex-col gap-6 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-[var(--r-primary-color)]" />
                <h3 className="text-xl font-semibold text-[var(--text-primary-color)]">
                  Historique des recherches
                </h3>
              </div>
            </div>

            <div className="max-h-[80vh] flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:w-[0.325rem] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
              {history.map((item, index) => (
                <div
                  key={`history-${item.id}`}
                  className={`w-[40rem] flex flex-col gap-4 rounded-xl p-4 transition-colors cursor-default ${
                    redirectLoading === item.id
                      ? index % 2 !== 0
                        ? 'bg-[var(--u-primary-color)]/25'
                        : 'bg-[var(--r-primary-color)]/25'
                      : index % 2 !== 0
                      ? 'bg-[var(--u-primary-color)]/5 hover:bg-[var(--u-primary-color)]/10'
                      : 'bg-[var(--r-primary-color)]/5 hover:bg-[var(--r-primary-color)]/10'
                  }`}
                >
                  <Link
                    href={`/cvtheque/${item.id}`}
                    onClick={() => setRedirectLoading(item.id)}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[var(--text-secondary-gray)]">
                        {redirectLoading === item.id && (
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-4 h-4 animate-spin"
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
                        <span className="text-sm">
                          {formatDateFr(item.updatedAt)}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          index % 2 !== 0
                            ? 'text-[var(--u-primary-color)]'
                            : 'text-[var(--r-primary-color)]'
                        }`}
                      >
                        {item.cvThequeViews?.length} CV consulté
                        {(item.cvThequeViews?.length ?? 1) > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="font-medium line-clamp-1 text-[var(--text-primary-color)]">
                        {item.position}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.cvThequeCompetences?.map((c) => (
                          <span
                            key={`history-competence-${c.id}`}
                            className={`px-3 py-1 rounded-full text-sm ${
                              index % 2 !== 0
                                ? 'bg-[var(--u-primary-color)]/10 text-[var(--u-primary-color)]'
                                : 'bg-[var(--r-primary-color)]/10 text-[var(--r-primary-color)]'
                            }`}
                          >
                            {c.content}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleResendSearch(item.id)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg ${
                      index % 2 !== 0
                        ? 'bg-[var(--u-primary-color)]'
                        : 'bg-[var(--r-primary-color)]'
                    } ${
                      isLoading === item.id
                        ? 'opacity-80 pointer-events-none'
                        : 'transition-colors cursor-pointer'
                    }`}
                  >
                    {isLoading === item.id && (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 animate-spin"
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
                    <span>Relancer cette recherche</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
