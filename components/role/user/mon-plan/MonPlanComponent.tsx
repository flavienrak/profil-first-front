'use client';

import React from 'react';
import Link from 'next/link';

import { Crown, Zap, Brain, X, HelpCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { faqData } from '@/data/faq.data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface UserSubscription {
  premiumActive: boolean;
  premiumExpiry?: Date;
  boosterCredits: number;
  qualiCarriereActive: boolean;
  qualiCarriereExpiry?: Date;
}

export default function MonPlanComponent() {
  const { mode } = useSelector((state: RootState) => state.persistInfos);

  const [userSubscription, setUserSubscription] =
    React.useState<UserSubscription>({
      premiumActive: false,
      boosterCredits: 0,
      qualiCarriereActive: false,
    });

  const [showFAQ, setShowFAQ] = React.useState(false);

  const handlePremiumSubscribe = () => {
    // Simulate payment and activation
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);

    setUserSubscription((prev) => ({
      ...prev,
      premiumActive: true,
      premiumExpiry: expiry,
    }));
  };

  const handleBoosterPurchase = () => {
    // Simulate payment and credit addition
    setUserSubscription((prev) => ({
      ...prev,
      boosterCredits: prev.boosterCredits + 25000,
    }));
  };

  const handleQualiCarrierePurchase = () => {
    // Simulate payment and activation
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 6);

    setUserSubscription((prev) => ({
      ...prev,
      qualiCarriereActive: true,
      qualiCarriereExpiry: expiry,
    }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="max-h-screen w-full overflow-y-auto flex justify-center">
      <div className="max-w-7xl h-max flex flex-col gap-12 py-12 px-4">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl md:text-6xl font-bold text-center">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Transforme ton CV
            </span>
            <br />
            <span className="text-[var(--text-primary-color)]">
              en machine à entretiens
            </span>
          </h1>
          <p className="text-xl text-[var(--text-secondary-gray)] max-w-2xl mx-auto leading-relaxed">
            Choisis le plan qui correspond à tes ambitions et laisse notre IA
            révolutionner ta recherche d'emploi
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 lg:items-stretch">
          <div className="flex pt-8">
            {/* Premium CV Card */}
            <div
              className={`relative bg-[var(--bg-secondary-color)] rounded-3xl shadow-xl border-2 hover:shadow-2xl transition-[translate,box-shadow] duration-300 transform hover:-translate-y-2 flex flex-col ${
                mode === 'light' ? 'border-purple-100' : 'border-purple-100/10'
              }`}
            >
              {/* Popular Badge */}
              <div className="absolute -top-4 right-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  POPULAIRE
                </div>
              </div>

              <div className="p-8 flex flex-col h-full">
                {/* Icon and Title */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-700 mb-2">
                    💜 Optimise ton CV comme un pro en 5 minutes
                  </h2>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-[var(--text-primary-color))]">
                      19,99 €
                    </span>
                    <span className="text-[var(--text-tertiary-gray)] ml-2">
                      / mois
                    </span>
                  </div>
                  <p className="text-purple-600 font-semibold mt-2">
                    📦 100K crédits IA / mois
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">🧠</span>
                    <span>Génère et corrige ton CV comme un pro.</span>
                  </li>
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">👉</span>
                    <span>
                      Optimise une expérience ou tout ton CV en un clic.
                    </span>
                  </li>
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">🔍</span>
                    <span>Analyse chaque offre pour adapter ton parcours.</span>
                  </li>
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">🎯</span>
                    <span>
                      Score de matching + recommandations instantanées.
                    </span>
                  </li>
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">📨</span>
                    <span>
                      Ton CV final est prêt à être téléchargé, sans rien
                      modifier.
                    </span>
                  </li>
                </ul>

                <div className="mt-auto">
                  <div className="text-sm text-gray-600 mb-6 p-3 bg-purple-50 rounded-lg">
                    🧾{' '}
                    <span className="font-medium">
                      Idéal si tu veux viser juste à chaque offre.
                    </span>
                  </div>

                  {userSubscription.premiumActive ? (
                    <div className="text-center">
                      <div className="bg-green-100 text-green-800 px-4 py-3 rounded-xl mb-3 font-semibold">
                        ✅ Abonnement actif
                      </div>
                      <p className="text-sm text-gray-600">
                        Renouvellement le{' '}
                        {userSubscription.premiumExpiry &&
                          formatDate(userSubscription.premiumExpiry)}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handlePremiumSubscribe}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Je m'abonne
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex pb-8">
            {/* Booster Card */}
            <div
              className={`bg-[var(--bg-secondary-color)] rounded-3xl shadow-xl border-2 hover:shadow-2xl transition-[translate,box-shadow] duration-300 transform hover:-translate-y-2 flex flex-col ${
                mode === 'light' ? 'border-orange-100' : 'border-orange-100/10'
              }`}
            >
              <div className="p-8 flex flex-col h-full">
                {/* Badge */}
                <div className="text-center mb-2">
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Réservé aux Premium
                  </span>
                </div>

                {/* Icon and Title */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-orange-700 mb-2">
                    🟠 Boost ton CV sans limite
                  </h2>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-[var(--text-primary-color)]">
                      6,99 €
                    </span>
                  </div>
                  <p className="text-orange-600 font-semibold mt-2">
                    📦 25K crédits IA (one-shot)
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">🚀</span>
                    <span>
                      25 000 crédits pour continuer à performer sans blocage.
                    </span>
                  </li>
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">♾️</span>
                    <span>
                      Crédits valables à vie, à utiliser quand tu en as besoin.
                    </span>
                  </li>
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">⚡</span>
                    <span>Activation immédiate, dès l'achat.</span>
                  </li>
                </ul>

                <div className="mt-auto">
                  <div className="text-sm text-gray-600 mb-6 p-3 bg-orange-50 rounded-lg">
                    📅{' '}
                    <span className="font-medium">
                      Idéal en période de candidatures intensives ou
                      reconversion.
                    </span>
                  </div>

                  {!userSubscription.premiumActive ? (
                    <div className="text-center">
                      <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl font-semibold">
                        🔒 Abonnement Premium requis
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleBoosterPurchase}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Je prends un booster
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex pt-8">
            {/* Quali Carrière Card */}
            <div
              className={`bg-[var(--bg-secondary-color)] rounded-3xl shadow-xl border-2 hover:shadow-2xl transition-[translate,box-shadow] duration-300 transform hover:-translate-y-2 flex flex-col ${
                mode === 'light' ? 'border-green-100' : 'border-green-100/10'
              }`}
            >
              <div className="p-8 flex flex-col h-full">
                {/* Icon and Title */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700 mb-2">
                    🧠 Tu racontes. On augmente ta valeur perçue pour les RH.
                  </h2>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-[var(--text-primary-color)]">
                      9,99 €
                    </span>
                  </div>
                  <p className="text-green-600 font-semibold mt-2">
                    📅 Accès 6 mois (one-shot)
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start text-gray-700">
                    <span className="mr-3">🎤</span>
                    <span>
                      Réponds à l'oral ou à l'écrit, on « storytelling » tes
                      expériences.
                    </span>
                  </li>
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">📄</span>
                    <span>
                      Reçois une synthèse concrète de ton parcours pour mieux en
                      parler.
                    </span>
                  </li>
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">🪄</span>
                    <span>
                      L'IA utilise ta synthèse pour améliorer automatiquement
                      ton CV.
                    </span>
                  </li>
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">🧩</span>
                    <span>
                      30 compétences cachées extraites automatiquement.
                    </span>
                  </li>
                  <li className="flex items-start text-[var(--text-primary-color)]">
                    <span className="mr-3">🗣️</span>
                    <span>
                      Échange avec notre IA Coach pour parler de ta préparation.
                    </span>
                  </li>
                </ul>

                <div className="mt-auto">
                  <div className="text-sm text-gray-600 mb-6 p-3 bg-green-50 rounded-lg">
                    🔓{' '}
                    <span className="font-medium">
                      Accès valable 6 mois – tu y vas à ton rythme, une bonne
                      fois pour toutes.
                    </span>
                  </div>

                  {userSubscription.qualiCarriereActive ? (
                    <div className="text-center">
                      <div className="bg-green-100 text-green-800 px-4 py-3 rounded-xl mb-3 font-semibold">
                        ✅ Accès actif
                      </div>
                      <p className="text-sm text-gray-600">
                        Expire le{' '}
                        {userSubscription.qualiCarriereExpiry &&
                          formatDate(userSubscription.qualiCarriereExpiry)}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleQualiCarrierePurchase}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Je débloque Quali Carrière
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
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
          <div className="max-w-7xl w-full mx-auto px-4 pb-16">
            <div className="flex flex-col gap-4 bg-[var(--bg-secondary-color))] rounded-2xl border border-[var(--text-primary-color)]/10 p-6">
              <div className="flex items-center justify-between mb-4 text-[var(--text-primary-color)]">
                <div className="flex items-center gap-3">
                  <HelpCircle size={22} />
                  <h3 className="text-xl font-semibold">
                    🧠 FAQ - Questions fréquentes
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowFAQ(false);
                    setSelectedQuestion(null);
                  }}
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
      </div>
    </div>
  );
}
