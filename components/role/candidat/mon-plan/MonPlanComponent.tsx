'use client';

import React from 'react';
import Link from 'next/link';

import { Crown, Zap, Brain, X, HelpCircle, Archive } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { faqData } from '@/data/faq.data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { stripeService } from '@/services/payment.service';
import { stripePromise } from '@/providers/User.provider';
import { PaymentInterface, PaymentType } from '@/interfaces/payment.interface';
import { updatePaymentReducer } from '@/redux/slices/user.slice';

export default function MonPlanComponent() {
  const { user } = useSelector((state: RootState) => state.user);
  const { mode } = useSelector((state: RootState) => state.persistInfos);

  const faqRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const [showFAQ, setShowFAQ] = React.useState(false);
  const [paymentLoading, setPaymentLoading] =
    React.useState<PaymentType | null>(null);
  const [premiumCards, setPremiumCards] = React.useState<PaymentInterface[]>(
    [],
  );
  const [boosterCards, setBoosterCards] = React.useState<PaymentInterface[]>(
    [],
  );
  const [qualiCarriereCards, setQualiCarriereCards] = React.useState<
    PaymentInterface[]
  >([]);

  React.useEffect(() => {
    if (showFAQ && faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showFAQ]);

  React.useEffect(() => {
    if (user?.payments) {
      const actualPremiumCard = user.payments?.filter(
        (item) => item.type === 'premium',
      );
      setPremiumCards(actualPremiumCard);

      const actualBoosterCard = user.payments?.filter(
        (item) => item.type === 'booster',
      );
      setBoosterCards(actualBoosterCard);

      const actualQualiCarriereCard = user.payments?.filter(
        (item) => item.type === 'quali-carriere',
      );
      setQualiCarriereCards(actualQualiCarriereCard);
    }
  }, [user?.payments]);

  const formatDate = (date: Date | string | undefined): string | null => {
    if (date) {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;

      return parsedDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }

    return null;
  };

  const handleCheckout = async (data: {
    amount: number;
    name: string;
    type: PaymentType;
  }) => {
    const res = await stripeService({
      amount: data.amount,
      name: data.name,
      type: data.type,
    });

    if (res.payment) {
      dispatch(updatePaymentReducer({ payment: res.payment }));

      const stripe = await stripePromise;

      if (stripe) {
        await stripe
          .redirectToCheckout({
            sessionId: res.payment.sessionId,
          })
          .catch((error) => console.log('stripe redirect error:', error));
      }
    }

    setPaymentLoading(null);
  };

  return (
    <div className="max-h-full w-full overflow-y-auto flex justify-center">
      <div className="max-w-7xl h-max flex flex-col gap-12 py-8 px-4">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Transforme ton CV
            </span>
            <br />
            <span className="text-[var(--text-primary-color)]">
              en machine à entretiens
            </span>
          </h1>
          <p className="text-lg text-center text-[var(--text-secondary-gray)] max-w-2xl mx-auto leading-relaxed">
            Choisis le plan qui correspond à tes ambitions et laisse notre IA
            révolutionner ta recherche d'emploi
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 lg:items-stretch">
          {/* Premium CV Card */}
          <div
            className={`relative bg-[var(--bg-secondary-color)] rounded-3xl shadow-xl border-2 hover:shadow-2xl transition-[translate,box-shadow] duration-300 transform hover:-translate-y-2 flex flex-col ${
              mode === 'light' ? 'border-purple-100' : 'border-purple-100/10'
            }`}
          >
            {/* Popular Badge */}
            <div className="absolute -top-4 right-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                POPULAIRE
              </div>
            </div>

            <div className="px-8 pt-4 pb-6 flex flex-col gap-4 h-full">
              {/* Icon and Title */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col justify-center items-center">
                  <div className="w-12 h-12 text-white bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <Crown size={22} />
                  </div>
                </div>

                <h2 className="text-xl text-center font-bold text-purple-700">
                  💜 Optimise ton CV comme un pro en 5 minutes
                </h2>

                <div className="text-center">
                  <span className="text-3xl font-bold text-[var(--text-primary-color))]">
                    19,99 €
                  </span>
                  <span className="text-[var(--text-tertiary-gray)] ml-2">
                    / mois
                  </span>
                </div>
                <p className="text-center text-purple-600 font-semibold">
                  📦 100K crédits IA / mois
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-4 flex-grow py-2 text-sm text-[var(--text-primary-color)]">
                <li className="flex items-start">
                  <span className="mr-3">🧠</span>
                  <span>Génère et corrige ton CV comme un pro.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">👉</span>
                  <span>
                    Optimise une expérience ou tout ton CV en un clic.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">🔍</span>
                  <span>Analyse chaque offre pour adapter ton parcours.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">🎯</span>
                  <span>Score de matching + recommandations instantanées.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">📨</span>
                  <span>
                    Ton CV final est prêt à être téléchargé, sans rien modifier.
                  </span>
                </li>
              </ul>

              <div className="flex flex-col gap-3">
                <div className="text-xs text-gray-600 p-3 bg-purple-50 rounded-lg">
                  🧾{' '}
                  <span className="font-medium">
                    Idéal si tu veux viser juste à chaque offre.
                  </span>
                </div>

                {premiumCards.length > 0 &&
                premiumCards[premiumCards.length - 1].status === 'paid' ? (
                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded-xl mb-3 font-semibold">
                      ✅ Abonnement actif
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setPaymentLoading('premium');
                      handleCheckout({
                        amount: 1999,
                        name: 'Profil Premium CV',
                        type: 'premium',
                      });
                    }}
                    className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-3 rounded-xl transition-all duration-200 transform shadow-lg ${
                      paymentLoading === 'premium'
                        ? 'opacity-80 pointer-events-none'
                        : 'hover:opacity-80 hover:scale-105 cursor-pointer'
                    }`}
                  >
                    {paymentLoading === 'premium' && (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-5 h-5 animate-spin"
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
                    <span>Je m'abonne</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Booster Card */}
          <div
            className={`bg-[var(--bg-secondary-color)] rounded-3xl shadow-xl border-2 hover:shadow-2xl transition-[translate,box-shadow] duration-300 transform hover:-translate-y-2 flex flex-col ${
              mode === 'light' ? 'border-orange-100' : 'border-orange-100/10'
            }`}
          >
            <div className="relative px-8 pt-4 pb-8 flex flex-col gap-6 items-center h-full">
              {/* Badge */}
              <div className="absolute -top-4 text-center">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Réservé aux Premium
                </span>
              </div>

              {/* Icon and Title */}
              <div className="text-center">
                <div className="w-12 h-12 text-white bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap size={22} />
                </div>
                <h2 className="text-xl font-bold text-orange-700 mb-2">
                  🟠 Boost ton CV sans limite
                </h2>
                <div className="text-center">
                  <span className="text-3xl font-bold text-[var(--text-primary-color)]">
                    6,99 €
                  </span>
                </div>
                <p className="text-orange-600 font-semibold mt-2">
                  📦 25K crédits IA (one-shot)
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-4 flex-grow text-sm text-[var(--text-primary-color)]">
                <li className="flex items-start">
                  <span className="mr-3">🚀</span>
                  <span>
                    25 000 crédits pour continuer à performer sans blocage.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">♾️</span>
                  <span>
                    Crédits valables à vie, à utiliser quand tu en as besoin.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">⚡</span>
                  <span>Activation immédiate, dès l'achat.</span>
                </li>
              </ul>

              <div className="flex flex-col gap-3">
                <div className="text-xs text-gray-600 p-3 bg-orange-50 rounded-lg">
                  📅{' '}
                  <span className="font-medium">
                    Idéal en période de candidatures intensives ou reconversion.
                  </span>
                </div>

                {premiumCards.length > 0 &&
                premiumCards[premiumCards.length - 1].status === 'paid' ? (
                  <button
                    onClick={() => {
                      setPaymentLoading('booster');
                      handleCheckout({
                        amount: 699,
                        name: 'Profil Booster',
                        type: 'booster',
                      });
                    }}
                    className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform shadow-lg ${
                      paymentLoading === 'booster'
                        ? 'opacity-80 pointer-events-none'
                        : 'hover:opacity-80 hover:scale-105 cursor-pointer'
                    }`}
                  >
                    {paymentLoading === 'booster' && (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-5 h-5 animate-spin"
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
                    <span>Je prends un booster</span>
                  </button>
                ) : (
                  <div className="text-center">
                    <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl font-semibold">
                      🔒 Abonnement Premium requis
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quali Carrière Card */}
          <div
            className={`bg-[var(--bg-secondary-color)] rounded-3xl shadow-xl border-2 hover:shadow-2xl transition-[translate,box-shadow] duration-300 transform hover:-translate-y-2 flex flex-col ${
              mode === 'light' ? 'border-green-100' : 'border-green-100/10'
            }`}
          >
            <div className="px-8 pt-4 pb-8 flex flex-col gap-6 h-full">
              {/* Icon and Title */}
              <div className="text-center">
                <div className="w-12 h-12 text-white bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain size={22} />
                </div>
                <h2 className="text-xl font-bold text-green-700 mb-2">
                  🧠 Tu racontes. On augmente ta valeur perçue pour les RH.
                </h2>
                <div className="text-center">
                  <span className="text-3xl font-bold text-[var(--text-primary-color)]">
                    9,99 €
                  </span>
                </div>
                <p className="text-green-600 font-semibold mt-2">
                  📅 Accès 6 mois (one-shot)
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-4 flex-grow text-sm text-[var(--text-primary-color)]">
                <li className="flex items-start">
                  <span className="mr-3">🎤</span>
                  <span>
                    Réponds à l'oral ou à l'écrit, on « storytelling » tes
                    expériences.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">📄</span>
                  <span>
                    Reçois une synthèse concrète de ton parcours pour mieux en
                    parler.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">🪄</span>
                  <span>
                    L'IA utilise ta synthèse pour améliorer automatiquement ton
                    CV.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">🧩</span>
                  <span>30 compétences cachées extraites automatiquement.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">🗣️</span>
                  <span>
                    Échange avec notre IA Coach pour parler de ta préparation.
                  </span>
                </li>
              </ul>

              <div className="flex flex-col gap-3">
                <div className="text-xs text-gray-600 p-3 bg-green-50 rounded-lg">
                  🔓{' '}
                  <span className="font-medium">
                    Accès valable 6 mois – tu y vas à ton rythme, une bonne fois
                    pour toutes.
                  </span>
                </div>

                {qualiCarriereCards.length > 0 &&
                qualiCarriereCards.every((item) => item.status === 'paid') ? (
                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded-xl mb-3 font-semibold">
                      ✅ Accès actif
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setPaymentLoading('quali-carriere');
                      handleCheckout({
                        amount: 999,
                        name: 'Quali Carrière',
                        type: 'quali-carriere',
                      });
                    }}
                    className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-xl transition-all duration-200 transform shadow-lg ${
                      paymentLoading === 'quali-carriere'
                        ? 'opacity-80 pointer-events-none'
                        : 'hover:opacity-80 hover:scale-105 cursor-pointer'
                    }`}
                  >
                    {paymentLoading === 'quali-carriere' && (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-5 h-5 animate-spin"
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
                    <span>Je débloque Quali Carrière</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div ref={faqRef} className="flex justify-center">
          {/* FAQ Button */}
          <button
            onClick={() => setShowFAQ((prev) => !prev)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-3 cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
            🧠 FAQ - Questions fréquentes
          </button>
        </div>

        {/* FAQ Section */}
        {showFAQ && (
          <div className="max-w-7xl w-full pb-16">
            <div className="flex flex-col gap-4 bg-[var(--bg-secondary-color))] rounded-2xl border border-[var(--text-primary-color)]/10 p-6">
              <div className="flex items-center justify-between mb-4 text-[var(--text-primary-color)]">
                <div className="flex items-center gap-3">
                  <HelpCircle size={22} />
                  <h3 className="text-xl font-semibold">
                    🧠 FAQ - Questions fréquentes
                  </h3>
                </div>
                <button
                  onClick={() => setShowFAQ(false)}
                  className="transition-colors cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full flex flex-col gap-3"
                >
                  {faqData.map((faq, index) => (
                    <AccordionItem
                      key={`accordion-${index}`}
                      value={`item-${index}`}
                      className="flex flex-col bg-[var(--bg-primary-color)] border-none rounded-xl"
                    >
                      <AccordionTrigger className="flex p-4 text-base text-[var(--text-primary-color)] transition-none cursor-pointer hover:no-underline">
                        {index + 1}. {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 text-[var(--text-secondary-gray)]">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <p className="text-xs text-[var(--text-secondary-gray)] text-center">
                  Une autre question ? Contacte notre support à{' '}
                  <Link
                    href={'mailto:info@savoircoaching.com'}
                    className="text-[var(--u-secondary-color)] hover:underline"
                  >
                    info@savoircoaching.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-full flex justify-center">
          <div className="w-full bg-[var(--bg-secondary-color)] rounded-2xl border border-[var(--text-primary-color)]/10">
            <Accordion
              type="single"
              collapsible
              className="w-full flex flex-col gap-3"
            >
              <AccordionItem
                value={'mes-abonnements'}
                className="flex flex-col border-none"
              >
                <AccordionTrigger className="flex px-8 py-6 text-base text-[var(--text-primary-color)] transition-none cursor-pointer hover:no-underline">
                  <div className="flex items-center gap-3 text-[var(--text-primary-color)]">
                    <Archive size={22} />
                    <h3 className="text-lg font-semibold">Mes abonnements</h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 text-[var(--text-secondary-gray)]">
                  <div className="flex flex-col gap-8">
                    <div className="flex gap-4">
                      {premiumCards.length > 0 &&
                        premiumCards[premiumCards.length - 1].status ===
                          'paid' && (
                          <div className="max-w-1/3 w-full flex items-center justify-between p-4 bg-purple-50 rounded-xl group">
                            <div>
                              <p className="font-semibold text-purple-800">
                                Premium CV
                              </p>
                              {
                                <p className="text-sm text-purple-600">
                                  Renouvellement le{' '}
                                  {formatDate(
                                    premiumCards[premiumCards.length - 1]
                                      .expiredAt,
                                  )}
                                </p>
                              }
                            </div>
                            <button
                              // onClick={handleCancelPremium}
                              className="text-sm text-red-600 hover:text-red-800 underline cursor-pointer opacity-0 group-hover:opacity-100"
                            >
                              Annuler
                            </button>
                          </div>
                        )}

                      {boosterCards.length > 0 &&
                        boosterCards.some((item) => item.status === 'paid') && (
                          <div className="max-w-1/3 w-full flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                            <div>
                              <p className="font-semibold text-orange-800">
                                Crédits Booster
                              </p>
                              <p className="text-sm text-orange-600">
                                Nombre d'abonnements booster effectués :{' '}
                                {
                                  boosterCards.filter(
                                    (item) => item.status === 'paid',
                                  ).length
                                }
                              </p>
                            </div>
                          </div>
                        )}

                      {qualiCarriereCards.length > 0 &&
                        qualiCarriereCards[qualiCarriereCards.length - 1]
                          .status === 'paid' && (
                          <div className="max-w-1/3 w-full flex items-center justify-between p-4 bg-green-50 rounded-xl">
                            <div>
                              <p className="font-semibold text-green-800">
                                Quali Carrière
                              </p>
                              {
                                <p className="text-sm text-green-600">
                                  Expire le{' '}
                                  {formatDate(
                                    qualiCarriereCards[
                                      qualiCarriereCards.length - 1
                                    ].expiredAt,
                                  )}
                                </p>
                              }
                            </div>
                          </div>
                        )}
                    </div>

                    <p className="text-xs text-[var(--text-secondary-gray)] text-center">
                      Pour toute question sur tes abonnements, contacte notre
                      support
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
