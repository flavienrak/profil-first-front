'use client';

import React from 'react';
import Popup from '../utils/Popup';
import CvPreview from './CvPreview';
import CvMinuteForm from './CvMinuteForm';

import { RootState } from '@/redux/store';
import { UidContext, videoUri } from '@/providers/UidProvider';
import { useDispatch, useSelector } from 'react-redux';
import { acceptConditionsService } from '@/services/user.service';
import { updateUserReducer } from '@/redux/slices/user.slice';

export default function CvMinuteComponent() {
  const dispatch = useDispatch();
  const context = React.useContext(UidContext);
  const { cvMinute } = useSelector((state: RootState) => state.cvMinute);
  const { user } = useSelector((state: RootState) => state.user);

  const [isLoading, setIsLoading] = React.useState(false);
  const [showConditions, setShowConditions] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setShowConditions(!user.acceptConditions);
    }
  }, [user?.acceptConditions]);

  const handleAcceptConditions = async () => {
    setIsLoading(true);
    const res = await acceptConditionsService();
    if (res.user) {
      dispatch(updateUserReducer({ user: { acceptConditions: true } }));
    }
    setIsLoading(false);
  };

  if (context)
    return (
      <>
        {context.currentQuery?.cvMinute && cvMinute ? (
          <div>
            {showConditions ? (
              <Popup large required>
                <div className="h-4/5 flex flex-col justify-between gap-8 p-4">
                  <div>
                    <div className="float-right flex flex-col gap-2 ps-6 h-44 w-64">
                      <p className="text-center font-semibold tracking-tighter">
                        Vidéo explicative
                      </p>
                      {videoUri ? (
                        <iframe
                          src={context.handleVideo(videoUri)}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="h-full w-full rounded-lg shadow"
                        ></iframe>
                      ) : (
                        <p>Vidéo non trouvé</p>
                      )}
                    </div>
                    <div>
                      <p className="text-justify">
                        Vous faite votre CV et vous pouvez le télécharger Vous
                        avez accès à tous vos CV Tous vos CV sont mis à
                        disposition des recruteurs de façon 100% anonyme Vous
                        pouvez être en veille active sans prendre aucun risque
                        Les recruteurs ont accès à tous vos CV via Profil First
                        dès le lendemain de leur création Votre CV reste anonyme
                        jusqu’à ce que vous acceptiez un rendez-vous. Vous
                        pouvez refuser un rendez-vous, votre anonymat est
                        préservé. Si vous activez Quali Carrière CV : nous
                        allons créer un CV personnalisé en fonction des offres
                        des recruteurs Tous les CV créés par l’IA vous sont
                        fournis si un recruteur souhaite planifier un
                        rendez-vous. Lorsqu’un recruteur vous contact via Profil
                        First, vous recevez un mail sur votre mail
                        d’inscription. Tous les CV créés par l’IA vous sont
                        fournis si un recruteur souhaite planifier un
                        rendez-vous. Vous recevez des conseils de préparation à
                        l’entretien en basés sur le CV sélectionné par le
                        recruteur
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <button className="flex-1 px-8 py-1 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow- cursor-pointer">
                      En savoir plus
                    </button>
                    <button
                      onClick={handleAcceptConditions}
                      className={`flex-1 px-8 py-1 bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] text-white rounded-lg transition-opacity duration-300 shadow ${
                        isLoading
                          ? 'opacity-80'
                          : 'hover:opacity-90 cursor-pointer'
                      }`}
                    >
                      <p className="flex justify-center items-center gap-2 text-white">
                        {isLoading && (
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-6 h-6 me-1 text-white animate-spin"
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
                        <span className="font-semibold">
                          Accepter les conditions générales d'utilisation
                        </span>
                      </p>
                    </button>
                  </div>
                </div>
              </Popup>
            ) : (
              <CvPreview />
            )}
          </div>
        ) : (
          <CvMinuteForm />
        )}
      </>
    );
}
