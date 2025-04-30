'use client';

import React from 'react';
import Link from 'next/link';
import Popup from '@/components/utils/Popup';
import Title from '@/components/utils/styles/Title';

import { UidContext, videoUri } from '@/providers/UidProvider';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';

export default function QualiCarriereComponent() {
  const context = React.useContext(UidContext);
  const { cvMinuteCount } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [showModal, setShowModal] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [redirectLoading, setRedirectLoading] = React.useState(false);

  const handleContinue = async () => {
    if (cvMinuteCount < 1) {
      setShowError(true);
    } else {
      setRedirectLoading(true);
      router.push('/quali-carriere/1');
    }
  };

  if (context)
    return (
      <div className="relative h-full w-full max-h-full overflow-y-auto p-8">
        <div className="flex justify-center">
          <div className="max-w-6xl flex flex-col gap-10">
            <div className="flex flex-col gap-8">
              <Title value={'Quali Carrière CV'} />
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg">
                  Candidatez avec un CV adapté aux offres d'emploi sans effort
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-[var(--secondary-color)] text-white rounded-md hover:bg-[#0052a3] transition-colors select-none cursor-pointer"
                >
                  En savoir plus
                </button>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#6B2CF5] text-white rounded-full flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold">Étape 1</h3>
                      <p>Vous démarrez la discussion avec Profiler Coach Ai</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#6B2CF5] text-white rounded-full flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold">Étape 2</h3>
                      <p>
                        Vous validez les éléments de votre parcours. Vous pouvez
                        en discuter dans le Chat de Profiler Coach.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[#6B2CF5] text-white rounded-full flex items-center justify-center flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold">
                        Et Hop Vous êtes contacté par un recruteur ! Nous
                        activons Quali Carrière pour proposer la meilleur
                        version de votre parcours en CV aux recruteurs selon les
                        offres d'emploi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-10">
              <h2 className="text-2xl font-bold text-center">
                Parlez-nous de vous ! On s'occupe du reste !
              </h2>

              <div className="flex flex-col gap-7 bg-white p-6 rounded-xl shadow-md text-center w-full max-w-xl">
                <h3 className="text-xl font-bold">
                  Partagez votre parcours avec Profiler Coach Ai
                </h3>
                <p className="">
                  Profiler Coach Ai vous questionnera sur votre parcours
                  professionnel pour faire ressortir les meilleures informations
                  de votre profil.
                </p>
                <button
                  onClick={handleContinue}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] text-white rounded-full select-none ${
                    redirectLoading
                      ? 'opacity-80 pointer-events-none'
                      : 'hover:opacity-80 transition-opacity duration-150 cursor-pointer'
                  }`}
                >
                  {redirectLoading && (
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-6 h-6 text-white animate-spin"
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
                  <span>Démarrer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <Popup large onClose={() => setShowModal(false)}>
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
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold">
                        100% CV optimisé à l'offre
                      </h3>
                      <p className="text-gray-600">
                        Profil First crée votre CV en fonction de l'offre
                        d'emploi du recruteur
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold">
                        100% de contrôle sur votre recherche
                      </h3>
                      <p className="text-gray-600">
                        Profil First rend votre CV anonyme, les recruteurs
                        découvrent votre identité si vous acceptez la prise de
                        contact.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold">
                        100% de maîtrise de l'entretien
                      </h3>
                      <p className="text-gray-600">
                        Profil First vous donne des conseils personnalisés pour
                        parler de votre parcours tout en restant aligné avec
                        votre nouveau CV ia
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 mt-8">
                    <p className="text-gray-600">
                      Quali Carrière permet à Profil First de générer un CV de
                      votre profil qui est optimisé pour l'offre d'emploi du
                      recruteur.
                    </p>
                    <p className="text-gray-600">
                      Après une discussion approfondie sur vos expériences avec
                      Profiler Coach Ai, Profil First va créer un CV
                      personnalisé en fonction de chaque offre d'un recruteur.
                    </p>
                    <p className="text-gray-600">
                      Si un recruteur est intéressé par ce CV, alors il vous
                      enverra un message et vous aurez évidemment accès à ce CV
                      afin de prépar vos échanges avec le recruteur.
                    </p>
                    <p className="text-gray-600 mt-6 text-sm italic">
                      Vous pouvez désactiver Quali Carrière quand vous voulez
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        )}

        {showError && (
          <Popup onClose={() => setShowError(false)}>
            <div className="flex items-center flex-col gap-6">
              <p className="max-w-4/5 text-center text-lg tracking-wide">
                Vous devez d'abord passer dans CV-minute.
              </p>
              <Link
                href={'/cv-minute'}
                onClick={() => setIsLoading(true)}
                className={`w-full flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] text-white text-center rounded-full font-semibold ${
                  isLoading
                    ? 'opacity-80 pointer-events-none'
                    : 'hover:opacity-80 transition-opacity duration-300 cursor-pointer'
                }`}
              >
                {isLoading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-6 h-6 text-white animate-spin"
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
        )}
      </div>
    );
}
