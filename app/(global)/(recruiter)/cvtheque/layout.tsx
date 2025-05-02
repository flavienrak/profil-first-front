'use client';

import React from 'react';
import Popup from '@/components/utils/Popup';

import { useDispatch, useSelector } from 'react-redux';
import { updatePersistReducer } from '@/redux/slices/persist.slice';
import { RootState } from '@/redux/store';
import { ArrowRight, Clock } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  getCvThequeCritereService,
  addCvThequeHistory,
} from '@/services/role/recruiter/cvtheque.service';
import { setCvThequeCritereReducer } from '@/redux/slices/role/recruiter/cvtheque.slice';
import { Skeleton } from '@/components/ui/skeleton';

export default function CvThequeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cvThequeCritere } = useSelector((state: RootState) => state.cvTheque);
  const { showCritere } = useSelector((state: RootState) => state.persistInfos);
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [renderChildren, setRenderChildren] = React.useState(false);

  React.useEffect(() => {
    if (params.id) {
      if (isNaN(Number(params.id))) {
        router.push('/cvtheque');
      } else {
        (async () => {
          setIsLoading(true);
          const res = await getCvThequeCritereService(Number(params.id));

          if (res.cvThequeCritere) {
            dispatch(
              setCvThequeCritereReducer({
                cvThequeCritere: res.cvThequeCritere,
              }),
            );
          } else {
            router.push('/cvtheque');
          }
          setIsLoading(false);
        })();
      }
    }
  }, [params.id]);

  React.useEffect(() => {
    if ((pathname === '/cvtheque' || cvThequeCritere) && !isLoading) {
      setRenderChildren(true);
    }
  }, [pathname, cvThequeCritere, isLoading]);

  const handleAddHistory = async () => {
    if (cvThequeCritere) {
      const res = await addCvThequeHistory(cvThequeCritere.id);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full px-8 h-20 border-b border-gray-200 bg-white flex items-center">
        <div className="w-full flex items-center justify-between gap-6">
          <button
            onClick={() =>
              dispatch(updatePersistReducer({ showCritere: !showCritere }))
            }
            className="px-4 py-2 text-[var(--r-secondary-color)] font-bold hover:bg-[var(--r-primary-color)]/5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            {showCritere ? 'Masquer' : 'Afficher'} mes critères
          </button>
          <div className="flex items-center gap-4">
            {cvThequeCritere && (
              <button
                onClick={handleAddHistory}
                className="text-[var(--r-primary-color)] px-4 py-2 rounded-lg bg-[var(--r-primary-color)]/5 hover:bg-[var(--r-primary-color)]/10 cursor-pointer"
              >
                Enregistrer ma recherche
              </button>
            )}
            <button
              onClick={() => setShowHistory(true)}
              className="text-gray-600 hover:text-[var(--r-primary-color)] transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Historique
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-5rem)] overflow-y-auto">
        {isLoading ? (
          <div className="h-full flex gap-6 px-12 py-8">
            <Skeleton className="h-full w-72 rounded-xl" />
            <Skeleton className="h-full w-64 rounded-xl" />
            <Skeleton className="h-full flex-1 rounded-xl" />
          </div>
        ) : (
          renderChildren && children
        )}
      </div>

      {showHistory && (
        <Popup large onClose={() => setShowHistory(false)}>
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-[var(--r-primary-color)]" />
                <h3 className="text-xl font-semibold">
                  Historique des recherches
                </h3>
              </div>
            </div>

            <div className="max-h-4/5 overflow-y-auto [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
              <div
                className={`w-[40rem] rounded-xl p-4 transition-colors ${
                  false
                    ? 'bg-[var(--u-primary-color)]/5 hover:bg-[var(--u-primary-color)]/10'
                    : 'bg-[var(--r-primary-color)]/5 hover:bg-[var(--r-primary-color)]/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    01 Mai 2025 à 17h55
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      false
                        ? 'text-[var(--u-primary-color)]'
                        : 'text-[var(--r-primary-color)]'
                    }`}
                  >
                    27 CV consultés
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="font-medium">
                    Développeur Full Stack React/Node.js
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        false
                          ? 'bg-[var(--u-primary-color)]/10 text-[var(--u-primary-color)]'
                          : 'bg-[var(--r-primary-color)]/10 text-[var(--r-primary-color)]'
                      }`}
                    >
                      React JS
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors cursor-pointer ${
                    false
                      ? 'bg-[var(--u-primary-color)] hover:bg-[var(--u-primary-color)]'
                      : 'bg-[var(--r-primary-color)] hover:bg-[var(--r-primary-color)]'
                  }`}
                >
                  <span>Relancer cette recherche</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
