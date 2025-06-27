'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { useEffect, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
  Star,
  Clock,
  Users,
  Target,
  FileText,
  Wrench,
  Headphones,
  Briefcase,
  Brain,
  Shield,
  User,
} from 'lucide-react';
import ConctactForm from './ConctactForm';

export default function ReservationComponent() {
  const [showBookingModal, setShowBookingModal] = React.useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );
  const [showConfirm, setShowConfirm] = React.useState<
    'confirm' | 'sent' | null
  >(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          } else {
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              newSet.delete(entry.target.id);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px',
      },
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const coachingOffers = [
    {
      icon: Target,
      name: 'Stratégie Express',
      title: 'Définir votre stratégie de recherche',
      duration: '1h',
      price: '120€',
      idealIf:
        'Vous souhaitez poser une manière efficace de chercher un poste.',
      points: [
        'Analyse de votre profil, parcours et objectifs',
        'Ciblage précis des entreprises et postes visés',
        "Construction d'un plan d'action immédiat",
      ],
    },
    {
      icon: FileText,
      name: 'Audit Complet',
      title: 'Revue de CV, lettre de motivation et profil LinkedIn',
      duration: '1h',
      price: '120€',
      idealIf:
        'Vous souhaitez un diagnostic et des conseils concrets pour améliorer votre personal branding professionnel.',
      points: [
        'Analyse de votre approche marché',
        'Lecture critique de votre personal branding CV LM et LinkedIn',
        'Conseils personnalisés actionnables pour optimiser vos candidatures',
      ],
    },
    {
      icon: Wrench,
      name: 'CV Premium',
      title: 'Reconstruction complète du CV',
      duration: '2h',
      price: '240€',
      idealIf:
        'Vous souhaitez refondre totalement votre CV de façon ultra efficace et différenciante.',
      points: [
        'Analyse complète de votre CV',
        'Analyse de la cohérence avec le positionnement marché',
        "Création du contenu d'un CV ultra optimisé orienté résultats",
      ],
    },
    {
      icon: Phone,
      name: "Passer l'étape téléphonique",
      title: "Préparation à l'entretien téléphonique",
      duration: '2h',
      price: '240€',
      idealIf:
        'Vous souhaitez peaufiner votre première impression, clarifier votre pitch et convertir vos échanges téléphoniques en processus de recrutement.',
      points: [
        'Construction du pitch personnel et conseils ultra personnalisés',
        'Décryptage des attentes cachées de RH',
        "Simulation d'appel avec analyse détaillée de votre discours",
      ],
    },
    {
      icon: Users,
      name: 'Maîtrise RH',
      title: "Préparation à l'entretien RH",
      duration: '2h',
      price: '240€',
      idealIf:
        "Vous souhaitez être ultra à l'aise en entretien RH et maîtriser pleinement toutes les attentes.",
      points: [
        'Maîtriser les questions RH classiques',
        'Parler de vous avec efficacité, structure et impact',
        "Simulation d'appel avec analyse détaillée de votre discours",
      ],
    },
    {
      icon: Briefcase,
      name: 'Performance Leadership',
      title: "Préparation à l'entretien manager ou direction",
      duration: '2h',
      price: '240€',
      idealIf:
        'Vous souhaitez asseoir votre expertise avec conviction et leadership dans le concret du poste pour convaincre le manager et la direction.',
      points: [
        'Valorisez votre valeur ajoutée vis-à-vis des attentes classiques et piègeuses',
        'Travail de posture, projection et ancrage des motivations',
        "Simulation d'entretien avec analyse approfondie de votre démarche",
      ],
    },
    {
      icon: Brain,
      name: 'Mental Boost',
      title: 'Booster mental et motivationnel',
      duration: '1h30',
      price: '180€',
      idealIf:
        "Vous souhaitez débloquer vos freins internes et gagner en puissance d'action concrète.",
      points: [
        'Identification des points de blocage internes',
        'Clarification de vos moteurs, peurs et contradictions',
        "Définition des pistes pour gagner en puissance d'action concrète",
      ],
    },
  ];

  const faqData = [
    {
      icon: '💳',
      title: 'Paiement & Réservation',
      questions: [
        {
          question:
            "Est-ce que le paiement est obligatoire le jour même de l'appel ?",
          answer:
            'Oui. Sans paiement le jour de la réservation, la séance ne sera pas validée.',
        },
        {
          question: 'Peut-on payer en plusieurs fois ?',
          answer: 'Uniquement pour le Pack Coaching Premium, sur demande.',
        },
        {
          question: 'Quels moyens de paiement sont acceptés ?',
          answer:
            "Le règlement s'effectue par carte bancaire via notre prestataire sécurisé Stripe.",
        },
        {
          question: 'Peut-on annuler ou reporter une séance ?',
          answer:
            "Non. Aucun remboursement ne sera effectué en cas d'absence ou d'empêchement.",
        },
      ],
    },
    {
      icon: '📄',
      title: 'Conditions & contenu',
      questions: [
        {
          question: "Et si je n'ai pas encore de CV ?",
          answer:
            'Aucun problème. Même si votre CV est obsolète ou absent, vous pouvez réserver une séance.',
        },
        {
          question: "Peut-on envoyer des offres d'emploi en amont ?",
          answer:
            'Oui. Un email vous sera transmis après réservation avec, si besoin, des documents à fournir (CV, offres ciblées...).',
        },
        {
          question:
            'Fournissez-vous un compte rendu ou un support après la séance ?',
          answer:
            "Selon la séance, un document de synthèse peut être fourni. Ce n'est pas systématique.",
        },
      ],
    },
    {
      icon: '📅',
      title: 'Délais & organisation',
      questions: [
        {
          question: "Combien de temps après l'appel peut-on faire la séance ?",
          answer:
            "Très rapidement. L'appel dure 10 à 20 minutes, et la séance peut être calée dans les jours qui suivent.",
        },
        {
          question: 'Est-ce possible le soir ou le week-end ?',
          answer:
            'Oui, nous sommes flexibles. Des créneaux en soirée ou le week-end peuvent être proposés selon disponibilité.',
        },
        {
          question: 'Puis-je faire plusieurs séances par semaine ?',
          answer:
            'Oui. Le rythme est adapté à vos besoins. Certaines personnes réservent plusieurs séances dans la même semaine.',
        },
      ],
    },
  ];

  const testimonials = [
    {
      name: 'Amel',
      role: 'Responsable Déploiement et Adoption Outils',
      image:
        'https://res.cloudinary.com/dsvix5dzy/image/upload/v1749898548/AMEL_hlt6us.jpg',
      text: "Victorien m'a apporté un soutien précieux à un moment professionnel clé. Grâce à sa méthodologie, j'ai pu affiner ma recherche de poste et gagner en assurance dans ma démarche. Son expertise du marché et des enjeux RH a été un véritable atout.",
    },
    {
      name: 'Maxime',
      role: 'Développeur Fullstack Javascript',
      image:
        'https://res.cloudinary.com/dsvix5dzy/image/upload/v1749898560/MAXIME_muzia0.jpg',
      text: "Très réactif et disponible! Excellente compréhension de mon parcours et du contexte de l'entreprise recruteuse, avec des propositions de réponses efficaces et une simulation d'entretien réaliste. Super expérience, je recommande vivement !",
    },
    {
      name: 'Larissa',
      role: 'Responsable des Ressources Humaines',
      image:
        'https://res.cloudinary.com/dsvix5dzy/image/upload/v1749898536/LARISSA_xfo5wm.jpg',
      text: "L'accompagnement de Victorien était très juste et a répondu à 200% à mes attentes. Il a su faire preuve d'écoute, apporter son expertise et son expérience pour répondre au mieux à mes attentes. Je recommande vivement.",
    },
    {
      name: 'Noémie',
      role: 'Marketing & Customer Relations Specialist',
      image:
        'https://res.cloudinary.com/dsvix5dzy/image/upload/v1749898575/NOEMIE_cvlxno.jpg',
      text: "Je recommande vivement Victorien à toute personne qui cherche à clarifier son parcours ou à se repositionner sur le marché de l'emploi. Il a une vraie passion pour ce qu'il fait, et ça se ressent dans la qualité de son accompagnement.",
    },
    {
      name: 'Christopher',
      role: 'IT et Media en Freelance',
      image:
        'https://res.cloudinary.com/dsvix5dzy/image/upload/v1749898522/Sans_titre_-_2025-06-14T123041.488_shovsb.png',
      text: "Victorien m'a vraiment aidé à y voir plus clair dans ma recherche d'emploi. Son approche est super personnalisée. C'est hyper motivant et concret. J'ai gagné en confiance en moi et décroché un poste de chef de projet technique dans le groupe Figaro.",
    },
  ];

  const handleSendMail = async () => {
    setShowConfirm('sent');
  };

  return (
    <div className="max-h-full w-full overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 max-w-4xl mx-auto leading-tight tracking-tight">
              <span className="text-slate-900 font-sans">
                Accélérez votre carrière avec un expert
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 via-blue-400 to-green-400 mx-auto mb-8 rounded-full shadow-lg"></div>
            <div className="mb-8">
              <Image
                src="/coach-victorien.png"
                alt="Victorien Am"
                width={160}
                height={160}
                className="rounded-full mx-auto border-4 border-white/20 shadow-2xl object-cover"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Victorien Am
            </h1>
            <p className="text-lg font-bold text-white mb-2">
              Coach - Recruteur - Fondateur de Savoir Coaching et Profil First.
            </p>

            {/* Statistiques de crédibilité */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-white/80">Coachés accompagnés</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">7 ans</div>
                <div className="text-sm text-white/80">D'expérience</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl font-bold text-white mb-1">Diplômé</div>
                <div className="text-sm text-white/80">en RH</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-1">Formé</div>
                <div className="text-sm text-white/80">
                  Coaching exécutif Paris Dauphine PSL
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:0674807971"
                className="inline-flex items-center px-8 py-4 bg-white text-violet-600 font-semibold rounded-full hover:bg-violet-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Appeler directement : 06 74 80 79 71
              </a>
              <button
                onClick={() =>
                  document
                    .getElementById('faq')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="inline-flex items-center px-6 py-3 border-2 border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Consultez la FAQ avant de réserver
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking CTA Section */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-8 border-2 border-violet-200 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à passer à l'action ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Réservez votre séance de coaching personnalisée et recevez un
              appel sous 24h pour valider votre créneau.
            </p>
            <button
              onClick={() => setShowConfirm('confirm')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-full hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg cursor-pointer"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              👉 Demander à être contacté
            </button>
          </div>
        </div>

        {showConfirm && (
          <ConctactForm
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
          />
        )}
      </div>

      {/* Coaching Offers */}
      <div
        id="coaching-offers"
        ref={setSectionRef('coaching-offers')}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-all duration-1000`}
      >
        <div
          className={`text-center mb-12 transition-all duration-1000 delay-200`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Offres de coaching
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Toutes les séances se font en visio individuelle.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-full font-semibold text-lg shadow-lg">
            <Clock className="w-5 h-5 mr-2" />
            Tarif 120€/h
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {coachingOffers.map((offer, index) => {
            const IconComponent = offer.icon;
            const delay = 200 + index * 50;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-slate-700 group cursor-pointer relative overflow-hidden ${
                  visibleSections.has('coaching-offers')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: visibleSections.has('coaching-offers')
                    ? `${delay}ms`
                    : '0ms',
                  transitionDuration: '600ms',
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:from-violet-400 group-hover:to-purple-500 transition-all duration-300 shadow-lg">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">
                      {offer.duration}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {offer.price}
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-lg font-bold rounded-full shadow-lg">
                    {offer.name}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-4 leading-tight">
                  {offer.title}
                </h3>
                <div className="mb-4 p-3 bg-slate-700/50 rounded-lg border-l-4 border-violet-400">
                  <div className="text-xs font-semibold text-violet-300 mb-1">
                    IDÉAL SI
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {offer.idealIf}
                  </p>
                </div>
                <ul className="space-y-3">
                  {offer.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-300 text-sm leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Premium Pack */}
        <div
          className={`rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 p-8 sm:p-12 border-2 border-gradient-to-r from-violet-500 via-purple-500 to-blue-500 group cursor-pointer relative overflow-hidden ${
            visibleSections.has('coaching-offers')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          } ring-4 ring-violet-500/30 hover:ring-violet-400/50`}
          style={{
            transitionDelay: visibleSections.has('coaching-offers')
              ? '550ms'
              : '0ms',
            transitionDuration: '600ms',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/15 to-blue-500/15 rounded-full translate-y-16 -translate-x-16"></div>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 rounded-t-3xl"></div>

          {/* Premium badge */}
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transform rotate-12 border-2 border-white">
            ⭐ PREMIUM
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:from-violet-400 group-hover:to-purple-500 transition-all duration-300 shadow-xl border-2 border-white/20">
                <Shield className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400 font-semibold">
                  Sur mesure
                </div>
                <div className="text-3xl font-bold text-white">Sur demande</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="inline-block px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xl font-bold rounded-full shadow-xl border-2 border-white/20">
                  Pack Premium
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-lg animate-pulse"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '2s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
              Coaching personnalisé sur mesure
            </h3>

            <div className="bg-slate-700/50 rounded-xl p-4 mb-6 border border-violet-400/30">
              <p className="text-slate-300 font-medium leading-relaxed">
                🎯 Vous souhaitez être accompagné de A à Z dans votre recherche
                de façon complète et approfondie ?
              </p>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 mb-8 border border-violet-400/30 shadow-inner">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  ✓
                </span>
                Ce qui est inclus :
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-3 h-3 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full mt-2 mr-4 flex-shrink-0 shadow-sm"></div>
                  <span className="text-slate-300 font-medium leading-relaxed">
                    Accompagnement à la recherche sur plusieurs semaines
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-3 h-3 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full mt-2 mr-4 flex-shrink-0 shadow-sm"></div>
                  <span className="text-slate-300 font-medium leading-relaxed">
                    Accès à des ressources exclusives (vidéos, modules, outils
                    PDF)
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-3 h-3 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full mt-2 mr-4 flex-shrink-0 shadow-sm"></div>
                  <span className="text-slate-300 font-medium leading-relaxed">
                    Coaching hybride : visio, WhatsApp, email & feedbacks
                    continus
                  </span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <a
                href="tel:0674807971"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-full hover:from-violet-400 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg border-2 border-white/20"
              >
                <Phone className="w-5 h-5 mr-3" />
                Contactez-moi pour plus d'infos
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div
        id="faq"
        ref={setSectionRef('faq')}
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-all duration-1000 ${
          visibleSections.has('faq')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div
          className={`text-center mb-12 transition-all duration-1000 delay-200 ${
            visibleSections.has('faq')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            FAQ – Vous avez une question ?
          </h2>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const delay = 300 + index * 100;
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-600 ${
                  visibleSections.has('faq')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: visibleSections.has('faq')
                    ? `${delay}ms`
                    : '0ms',
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{faq.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {faq.questions.length} questions
                      </p>
                    </div>
                  </div>
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="px-8 pb-6 pt-2">
                    <div className="pl-12">
                      <div className="space-y-6">
                        {faq.questions.map((item, qIndex) => (
                          <div key={qIndex}>
                            <h4 className="font-medium text-gray-900 mb-2">
                              {item.question}
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div
        id="testimonials"
        ref={setSectionRef('testimonials')}
        className={`bg-gradient-to-br from-gray-50 to-blue-50 py-16 transition-all duration-1000 ${
          visibleSections.has('testimonials')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-200 ${
              visibleSections.has('testimonials')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Témoignages clients
            </h2>
            <p className="text-lg text-gray-600">
              <a
                href="https://www.linkedin.com/services/page/05403933318541545a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors duration-200"
              >
                Vérifiables sur LinkedIn
              </a>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              const delay = 200 + index * 80;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-gray-100 ${
                    visibleSections.has('testimonials')
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    transitionDelay: visibleSections.has('testimonials')
                      ? `${delay}ms`
                      : '0ms',
                    transitionDuration: '600ms',
                  }}
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm italic">
                    "{testimonial.text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div
        id="cta"
        ref={setSectionRef('cta')}
        className={`bg-gradient-to-r from-violet-600 to-purple-600 py-16 transition-all duration-1000 ${
          visibleSections.has('cta')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 delay-300 ${
            visibleSections.has('cta')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Prêt à débloquer votre carrière ?
          </h2>
          <p className="text-lg text-violet-100 mb-8 max-w-2xl mx-auto">
            Échangez avec Victorien ou un consultant de Savoir Coaching et
            partagez-nous votre situation.
          </p>
          <a
            href="tel:0674807971"
            className="inline-flex items-center px-8 py-4 bg-white text-violet-600 font-semibold rounded-full hover:bg-violet-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
          >
            <Phone className="w-5 h-5 mr-2" />
            06 74 80 79 71
          </a>
        </div>
      </div>
    </div>
  );
}
