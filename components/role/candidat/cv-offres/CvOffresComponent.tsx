'use client';

import React from 'react';
import Image from 'next/image';
import CVCard from './CvCard';
import Title from '@/components/utils/role/user/Title';

import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { changeQualiCarriereStatusService } from '@/services/role/candidat/qualiCarriere.service';
import { updateUserReducer } from '@/redux/slices/user.slice';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCvMinuteService } from '@/services/role/candidat/cvMinute.service';
import { setCvMinuteReducer } from '@/redux/slices/role/candidat/cvMinute.slice';
import { Skeleton } from '@/components/ui/skeleton';

const infos = [
  { label: 'Ces CV sont accessibles par les recruteurs de façon anonyme.' },
  {
    label:
      'Si un recruteur est intéressé par un de mes CV, je recevrai un message dans « Mes opportunités ».',
  },
];

export default function CvOffresComponent() {
  const { user } = useSelector((state: RootState) => state.user);
  const { cvMinutes } = useSelector((state: RootState) => state.cvMinute);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(false);
  const [showAnonym, setShowAnonym] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    (async () => {
      setIsLoading(true);
      const res = await getAllCvMinuteService();

      if (isMounted) {
        if (res.cvMinutes) {
          dispatch(setCvMinuteReducer({ cvMinutes: res.cvMinutes }));
        }
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChangeStatus = async () => {
    const res = await changeQualiCarriereStatusService();

    if (res.user) {
      if (res.user.qualiCarriere === 'active') {
        toast.success('Quali carrière activé !');
      } else {
        toast.success('Quali carrière desactivé !');
      }
      dispatch(updateUserReducer({ user: res.user }));
    }
  };

  return (
    <div className="min-h-full w-full px-12 py-6">
      <div className="flex items-center justify-between mb-6">
        <Title value={'Mes CV et offres'} />
        {/* 
        {user?.qualiCarriere && (
          <div
            className={`flex items-center gap-3 font-bold ${
              user.qualiCarriere === 'active'
                ? 'text-green-600'
                : 'text-red-500'
            }`}
          >
            <span className="whitespace-nowrap">Quali carrière est</span>
            <button
              onClick={handleChangeStatus}
              className="flex items-center gap-2 select-none cursor-pointer"
            >
              <div
                className={`w-12 h-6 rounded-full relative ${
                  user.qualiCarriere === 'active'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                } transition-colors duration-200`}
              >
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                    user.qualiCarriere === 'active'
                      ? 'translate-x-6'
                      : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="min-w-[70px]">
                {user.qualiCarriere === 'active' ? 'activé' : 'désactivé'}
              </span>
            </button>
          </div>
        )} */}
      </div>

      <p className="text-[var(--text-primary-gray)] mb-8">
        Je retrouve ici mes CV et offres enregistrées.
      </p>
      <div className="flex items-center justify-between mb-8">
        <p className="font-bold text-lg text-[var(--text-primary-color)]">
          Tous vos CV sont anonymes pour les recruteurs
        </p>
        {/* <button
          onClick={() => setShowAnonym(true)}
          className="px-6 py-3 text-sm bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] text-white rounded-full transition-opacity duration-150 select-none cursor-pointer hover:opacity-80"
        >
          Voir la version anonyme
        </button> */}
      </div>

      {/* <div className="space-y-2 mb-8">
        {infos.map((item, index) => (
          <div
            key={`cv-offre-section-${index}`}
            className="flex items-center gap-2 text-sm text-[var(--text-primary-gray)]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>{item.label}</span>
          </div>
        ))}
      </div> */}

      <div className="grid md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-52 rounded-xl shadow-md bg-[var(--bg-primary-color)]" />
            <Skeleton className="w-full h-52 rounded-xl shadow-md bg-[var(--bg-primary-color)]" />
          </>
        ) : (
          cvMinutes.map((c) => (
            <CVCard key={`cv-minute-${c.id}`} cvMinute={c} />
          ))
        )}
      </div>

      {/* {showAnonym && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          >
            <div className="relative w-auto h-screen p-8">
              <button
                onClick={() => setShowAnonym(false)}
                className="absolute top-12 right-12 text-black p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-opacity duration-150"
              >
                <X className="w-6 h-6" />
              </button>
              <Image
                src="/cv-anonym.png"
                alt="CV Anonyme"
                height={500}
                width={700}
                className="w-auto h-full rounded-sm"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      )} */}
    </div>
  );
}
