'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useState, useEffect } from 'react';
import {
  Brain,
  FileText,
  Bot,
  MessageCircle,
  Users,
  Clock,
  CheckCircle,
  Star,
  User,
  MessageSquare,
  Sparkles,
  Target,
} from 'lucide-react';
import { TestimonialCarousel } from './TestimonialCarousel';
import { StepModal } from './StepModal';
import { BenefitPopup } from './BenefitPopup';
import { InfoPopup } from './InfoPopup';

export default function QualiCarrierePresentation() {
  const [activeModal, setActiveModal] = useState<number | null>(null);
  const [activeBenefitPopup, setActiveBenefitPopup] = useState<number | null>(
    null,
  );
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [animatedStep, setAnimatedStep] = useState(1);

  const stepData = [
    {
      title: 'Tu réponds aux questions de Profiler Coach AI (oral ou écrit)',
      content:
        "Tu passes un entretien guidé avec notre IA. À l'écrit ou à l'oral, elle t'aide à raconter ton parcours sans stress, comme si tu te confiais à un coach bienveillant. Tu peux répondre à ton rythme, et recommencer autant de fois que nécessaire.",
    },
    {
      title:
        'Tu reçois ta synthèse : storytelling, compétences clés, expériences',
      content:
        "En quelques secondes, tu obtiens une synthèse complète de tes réponses. Chaque expérience est reformulée de manière claire et percutante, accompagnée de 30 compétences identifiées automatiquement. C'est ta nouvelle base de travail pour candidater ou pitcher ton parcours.",
    },
    {
      title: 'Tu discutes de ton parcours avec Profiler Coach AI',
      content:
        "Tu peux affiner ta synthèse via un chat dédié avec l'IA. Besoin de reformuler un passage, d'ajouter une précision, ou de creuser une compétence ? Profiler Coach te répond en temps réel pour améliorer encore ta présentation.",
    },
    {
      title: 'Tu enrichis ton CV avec des suggestions IA sur-mesure',
      content:
        "À partir de ta synthèse, l'IA te propose des phrases prêtes à intégrer dans ton CV. Elle t'indique aussi comment mieux aligner ton parcours avec les offres du marché. Résultat : un CV clair, cohérent, et taillé pour convaincre.",
    },
  ];

  // Animation cycle pour les étapes
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStep((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const benefitData = [
    {
      title: 'Storytelling clair pour chaque expérience pro',
      content:
        "87% des recruteurs affirment qu'un récit professionnel bien construit permet de mieux comprendre les compétences et le potentiel d'un candidat, augmentant ainsi ses chances d'être retenu.",
      source: 'LinkedIn',
    },
    {
      title: 'Compétences clés révélées automatiquement',
      content:
        "4 500 compétences différentes ont été recensées dans près de 3 millions d'offres d'emploi. Savoir nommer ses compétences, c'est mieux maitriser sa valeur perçue.",
      source: 'Adecco',
    },
    {
      title: 'Optimisation CV intelligente',
      content:
        "88% des professionnels des ressources humaines estiment que l'IA améliore significativement la pertinence et la personnalisation des candidatures reçues.",
      source: 'World Economic Forum',
    },
    {
      title: 'Profiler Coach Ai pour maitriser ton profil',
      content:
        "87% des candidats déclarent qu'un accompagnement personnalisé (chat ou coach virtuel) augmente leur confiance et leur motivation dans leur recherche d'emploi.",
      source: 'Randstad',
    },
  ];
  return (
    <div className="max-h-full overflow-y-auto bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 pb-4">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Centered Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent title-shadow">
              Quali Carrière CV
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left lg:pr-8">
              <h2
                className="text-2xl lg:text-4xl font-bold mb-4 leading-tight text-white"
                style={{
                  filter:
                    'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 15px rgba(236, 72, 153, 0.8))',
                }}
              >
                <div
                  className="flex items-center justify-center lg:justify-start mb-4 sequential-shimmer text-xl lg:text-3xl"
                  style={{ animationDelay: '0s' }}
                >
                  <MessageSquare className="w-8 h-8 lg:w-10 lg:h-10 mr-3 text-white drop-shadow-lg cyan-shadow-icon" />
                  <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
                    Tu racontes.
                  </span>
                </div>
                <div
                  className="flex items-center justify-center lg:justify-start mb-4 sequential-shimmer text-xl lg:text-3xl"
                  style={{ animationDelay: '1s' }}
                >
                  <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 mr-3 text-white drop-shadow-lg cyan-shadow-icon" />
                  <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
                    On reformule.
                  </span>
                </div>
                <div
                  className="flex items-center justify-center lg:justify-start sequential-shimmer text-xl lg:text-3xl"
                  style={{ animationDelay: '2s' }}
                >
                  <Target className="w-8 h-8 lg:w-10 lg:h-10 mr-3 text-white drop-shadow-lg cyan-shadow-icon" />
                  <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
                    En atout CV et storytelling pour les recruteurs.
                  </span>
                </div>
              </h2>

              <Link
                href="/quali-carriere/step"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4 flex items-center justify-center mx-auto lg:mx-0 max-w-md"
              >
                <span className="text-2xl mr-3">🎙️</span>
                <Image
                  src="/coach.png"
                  alt="Quali Carrière CV Logo"
                  className="mr-3 object-contain"
                  width={48}
                  height={48}
                />
                <span className="text-center leading-tight">
                  Lancer mon entretien guidé avec Profiler Coach Ai
                </span>
              </Link>
            </div>

            {/* Right side - Image */}
            <div className="flex justify-center lg:justify-end lg:pl-4">
              <Image
                src="/quali-carriere/people.png"
                alt="Interface Quali Carrière"
                width={600}
                height={300}
                className="rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 glow-effect white-shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-3 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4">
            <img
              src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1743448958/Sans_titre_-_2024-11-04T140738.036-modified_rkiicu.png"
              alt="Victorien Am"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shadow-lg"
            />
            <div className="text-center">
              <p className="text-gray-700 text-sm font-medium">
                Outil créé par{' '}
                <span className="text-blue-600 font-semibold">
                  Victorien Am
                </span>{' '}
                – Coach Carrière et recruteur
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="pt-3 pb-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-emerald-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-50/30 to-purple-50/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 relative">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              Boost ton discours et ton CV
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
            {/* Encart 1: Storytelling */}
            <div
              className="group flex justify-center cursor-pointer"
              onClick={() => setActiveBenefitPopup(1)}
            >
              <div className="relative bg-white/90 backdrop-blur-xl rounded-xl p-2 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1 border border-white/60 overflow-hidden w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-blue-50/40 to-indigo-50/30 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 via-transparent to-blue-100/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col items-center text-center">
                  {/* Icône */}
                  <div className="mb-2 sm:mb-3">
                    <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 w-10 h-10 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/35 transition-all duration-400 group-hover:scale-105 relative overflow-hidden icon-highlight">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-100 transition-opacity duration-400"></div>
                      <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white relative z-10" />
                    </div>
                  </div>
                  {/* Chiffre */}
                  <div className="text-xl sm:text-3xl font-bold text-blue-600 mb-2 sm:mb-3">
                    87%
                  </div>
                  {/* Texte */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    Storytelling percutant qui valorise chaque expérience
                  </h3>
                </div>
              </div>
            </div>

            {/* Encart 2: Compétences */}
            <div
              className="group flex justify-center cursor-pointer"
              onClick={() => setActiveBenefitPopup(2)}
            >
              <div className="relative bg-white/90 backdrop-blur-xl rounded-xl p-2 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1 border border-white/60 overflow-hidden w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-indigo-50/40 to-purple-50/30 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/10 via-transparent to-indigo-100/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col items-center text-center">
                  {/* Icône */}
                  <div className="mb-2 sm:mb-3">
                    <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 w-10 h-10 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-xl group-hover:shadow-indigo-500/35 transition-all duration-400 group-hover:scale-105 relative overflow-hidden icon-highlight">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-100 transition-opacity duration-400"></div>
                      <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white relative z-10" />
                    </div>
                  </div>
                  {/* Chiffre */}
                  <div className="text-xl sm:text-3xl font-bold text-indigo-600 mb-2 sm:mb-3">
                    4 500
                  </div>
                  {/* Texte */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    Compétences cachées identifiées, valorisées et prêtes à
                    l'emploi
                  </h3>
                </div>
              </div>
            </div>

            {/* Encart 3: Optimisation CV */}
            <div
              className="group flex justify-center cursor-pointer"
              onClick={() => setActiveBenefitPopup(3)}
            >
              <div className="relative bg-white/90 backdrop-blur-xl rounded-xl p-2 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1 border border-white/60 overflow-hidden w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-purple-50/40 to-violet-50/30 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/10 via-transparent to-purple-100/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col items-center text-center">
                  {/* Icône */}
                  <div className="mb-2 sm:mb-3">
                    <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 w-10 h-10 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-xl group-hover:shadow-purple-500/35 transition-all duration-400 group-hover:scale-105 relative overflow-hidden icon-highlight">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-100 transition-opacity duration-400"></div>
                      <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white relative z-10" />
                    </div>
                  </div>
                  {/* Chiffre */}
                  <div className="text-xl sm:text-3xl font-bold text-purple-600 mb-2 sm:mb-3">
                    88%
                  </div>
                  {/* Texte */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    Optimisation CV intelligente et personnalisée
                  </h3>
                </div>
              </div>
            </div>

            {/* Encart 4: Coaching */}
            <div
              className="group flex justify-center cursor-pointer"
              onClick={() => setActiveBenefitPopup(4)}
            >
              <div className="relative bg-white/90 backdrop-blur-xl rounded-xl p-2 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1 border border-white/60 overflow-hidden w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-violet-50/40 to-pink-50/30 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/10 via-transparent to-violet-100/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col items-center text-center">
                  {/* Icône */}
                  <div className="mb-2 sm:mb-3">
                    <div className="bg-gradient-to-br from-violet-500 via-violet-600 to-pink-600 w-10 h-10 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/35 transition-all duration-400 group-hover:scale-105 relative overflow-hidden icon-highlight">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-100 transition-opacity duration-400"></div>
                      <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white relative z-10" />
                    </div>
                  </div>
                  {/* Chiffre */}
                  <div className="text-xl sm:text-3xl font-bold text-violet-600 mb-2 sm:mb-3">
                    87%
                  </div>
                  {/* Texte */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    Coaching personnalisé pour perfectionner ton profil
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-8">
            Comment ça marche
          </h2>

          <div className="grid grid-cols-4 gap-4">
            {/* Étape 1 */}
            <div
              className="text-center group cursor-pointer"
              onClick={() => setActiveModal(1)}
            >
              <div className="relative mb-4">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg z-10">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <img
                  src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1750808791/1_Question_kilejt.png"
                  alt="Étape 1"
                  className={`w-full h-32 object-cover rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-500 border-2 border-white ${
                    animatedStep === 1
                      ? 'animate-pulse scale-105 shadow-xl'
                      : ''
                  }`}
                />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 mx-2 shadow-md border border-white/60">
                <p className="text-gray-900 font-bold text-sm leading-relaxed">
                  Tu réponds aux questions de Profiler Coach AI (oral ou écrit)
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div
              className="text-center group cursor-pointer"
              onClick={() => setActiveModal(2)}
            >
              <div className="relative mb-4">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg z-10">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <img
                  src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1750809024/2_synthèse_jh8cbi.png"
                  alt="Étape 2"
                  className={`w-full h-32 object-cover rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-500 border-2 border-white ${
                    animatedStep === 2
                      ? 'animate-pulse scale-105 shadow-xl'
                      : ''
                  }`}
                />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 mx-2 shadow-md border border-white/60">
                <p className="text-gray-900 font-bold text-sm leading-relaxed">
                  Tu reçois ta synthèse : storytelling, compétences clés,
                  expériences
                </p>
              </div>
            </div>

            {/* Étape 3 */}
            <div
              className="text-center group cursor-pointer"
              onClick={() => setActiveModal(3)}
            >
              <div className="relative mb-4">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg z-10">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <img
                  src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1750808539/3_profiler_coach_ai_jqr5iy.png"
                  alt="Étape 3"
                  className={`w-full h-32 object-cover rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-500 border-2 border-white ${
                    animatedStep === 3
                      ? 'animate-pulse scale-105 shadow-xl'
                      : ''
                  }`}
                />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 mx-2 shadow-md border border-white/60">
                <p className="text-gray-900 font-bold text-sm leading-relaxed">
                  Tu discutes de ton parcours avec Profiler Coach Ai
                </p>
              </div>
            </div>

            {/* Étape 4 */}
            <div
              className="text-center group cursor-pointer"
              onClick={() => setActiveModal(4)}
            >
              <div className="relative mb-4">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg z-10">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <img
                  src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1750809007/4_CV_ot0ore.png"
                  alt="Étape 4"
                  className={`w-full h-32 object-cover rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-500 border-2 border-white ${
                    animatedStep === 4
                      ? 'animate-pulse scale-105 shadow-xl'
                      : ''
                  }`}
                />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 mx-2 shadow-md border border-white/60">
                <p className="text-gray-900 font-bold text-sm leading-relaxed">
                  Tu reçois des suggestions ultra personnalisées dans CV minute*
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 max-w-2xl mx-auto border border-green-100/60 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-green-800 font-semibold text-sm">
                  Accès illimité pendant 6 mois
                </span>
              </div>
            </div>

            {/* Bouton découverte séparé */}
            <div className="mt-6">
              <button
                onClick={() => setIsInfoPopupOpen(true)}
                className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span>Je découvre Quali Carrière</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-300 fill-current" />
                    <Star className="w-3 h-3 text-yellow-300 fill-current" />
                    <Star className="w-3 h-3 text-yellow-300 fill-current" />
                    <Star className="w-3 h-3 text-yellow-300 fill-current" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            💬 Ce qu'ils en diraient
          </h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            {/* Titre principal */}
            <h2 className="text-2xl lg:text-3xl font-bold text-white text-center mb-6 leading-tight">
              Transforme ton parcours. Valorise ton potentiel.
            </h2>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center justify-center text-white/90">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">
                  Accès valable 6 mois
                </span>
              </div>
              <div className="flex items-center justify-center text-white/90">
                <CheckCircle className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">Paiement unique</span>
              </div>
              <div className="flex items-center justify-center text-white/90">
                <Clock className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">Sans abonnement</span>
              </div>
            </div>

            {/* Prix */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🔓</span>
                <div className="text-3xl lg:text-4xl font-bold text-white">
                  9,99 € – une seule fois pour tout débloquer.
                </div>
              </div>
            </div>

            {/* Bouton principal */}
            <div className="text-center mb-4">
              <Link
                href="/mon-plan"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg font-bold px-8 py-3 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 inline-flex items-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Je débloque Quali Carrière
              </Link>
            </div>

            {/* Texte de garantie */}
            <p className="text-white/70 text-center text-sm mb-6">
              Accès valable 6 mois. Paiement unique. Sans abonnement.
            </p>
          </div>
        </div>
      </section>

      {/* Footer avec mention légale */}
      <footer className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500 text-center">
            * sous réserve de crédits disponibles via la souscription à l'offre
            Profil Premium
          </p>
        </div>
      </footer>

      {/* Modals */}
      {stepData.map((step, index) => (
        <StepModal
          key={index + 1}
          isOpen={activeModal === index + 1}
          onClose={() => setActiveModal(null)}
          stepNumber={index + 1}
          title={step.title}
          content={step.content}
        />
      ))}

      {/* Benefit Popups */}
      {benefitData.map((benefit, index) => (
        <BenefitPopup
          key={index + 1}
          isOpen={activeBenefitPopup === index + 1}
          onClose={() => setActiveBenefitPopup(null)}
          title={benefit.title}
          content={benefit.content}
          source={benefit.source}
        />
      ))}

      {/* Info Popup */}
      <InfoPopup
        isOpen={isInfoPopupOpen}
        onClose={() => setIsInfoPopupOpen(false)}
      />
    </div>
  );
}
