'use client';

import React from 'react';
import Popup from '@/components/utils/Popup';
import PrimaryButton from '@/components/utils/role/user/button/PrimaryButton';
import SecondaryButton from '@/components/utils/role/user/button/SecondaryButton';

import { useParams, useRouter } from 'next/navigation';
import { getCvMinuteService } from '@/services/role/user/cvMinute.service';
import { useDispatch, useSelector } from 'react-redux';
import { setCvMinuteReducer } from '@/redux/slices/role/user/cvMinute.slice';
import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/redux/store';
import { acceptConditionsService } from '@/services/role/user/user-role.service';
import { updateUserReducer } from '@/redux/slices/user.slice';
import { videoUri } from '@/providers/User.provider';
import { handleVideo } from '@/lib/function';

export default function CvMinuteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();

  const [showConditions, setShowConditions] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setShowConditions(!user.acceptConditions);
    }
  }, [user?.acceptConditions]);

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

  const handleAcceptConditions = async () => {
    setIsLoading(true);
    const res = await acceptConditionsService();
    if (res.user) {
      dispatch(updateUserReducer({ user: { acceptConditions: true } }));
    }
    setIsLoading(false);
  };

  return (
    <div className="h-full">
      {isLoading ? (
        <div>
          <Skeleton />
        </div>
      ) : showConditions ? (
        <Popup large>
          <div className="h-4/5 flex flex-col justify-between gap-8 p-4">
            <div>
              <div className="float-right flex flex-col gap-2 ps-6 h-44 w-64">
                <p className="text-center font-semibold tracking-tighter text-[var(--text-primary-color)]">
                  Vidéo explicative
                </p>
                {videoUri ? (
                  <iframe
                    src={handleVideo(videoUri)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full rounded-lg shadow"
                  ></iframe>
                ) : (
                  <p className="text-[var(--text-secondary-gray)]">
                    Vidéo non trouvé
                  </p>
                )}
              </div>
              <div>
                <p className="text-justify text-[var(--text-primary-color)]">
                  Vous faite votre CV et vous pouvez le télécharger Vous avez
                  accès à tous vos CV Tous vos CV sont mis à disposition des
                  recruteurs de façon 100% anonyme Vous pouvez être en veille
                  active sans prendre aucun risque Les recruteurs ont accès à
                  tous vos CV via Profil First dès le lendemain de leur création
                  Votre CV reste anonyme jusqu’à ce que vous acceptiez un
                  rendez-vous. Vous pouvez refuser un rendez-vous, votre
                  anonymat est préservé. Si vous activez Quali Carrière CV :
                  nous allons créer un CV personnalisé en fonction des offres
                  des recruteurs Tous les CV créés par l’IA vous sont fournis si
                  un recruteur souhaite planifier un rendez-vous. Lorsqu’un
                  recruteur vous contact via Profil First, vous recevez un mail
                  sur votre mail d’inscription. Tous les CV créés par l’IA vous
                  sont fournis si un recruteur souhaite planifier un
                  rendez-vous. Vous recevez des conseils de préparation à
                  l’entretien en basés sur le CV sélectionné par le recruteur
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <SecondaryButton
                label={'En savoir plus'}
                className="flex-1 font-semibold rounded-lg text-[var(--u-primary-white)] border-[var(--u-primary-white)]"
              />
              <PrimaryButton
                label="Accepter les conditions générales d'utilisation"
                isLoading={isLoading}
                onClick={handleAcceptConditions}
                className="h-14 flex-1 px-8 text-base rounded-lg"
              />
            </div>
          </div>
        </Popup>
      ) : (
        children
      )}
    </div>
  );
}
