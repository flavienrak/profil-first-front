'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Popup from '@/components/utils/Popup';
import AuthComponent from '@/components/auth/AuthComponent';
import PrimaryButton from '@/components/utils/role/user/button/PrimaryButton';

import {
  Users,
  Building2,
  Upload,
  Sparkles,
  Target,
  CheckCircle,
  Star,
  Clock,
  Trophy,
  FileText,
  Search,
  Zap,
  Linkedin,
  Heart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserInterface } from '@/interfaces/user.interface';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingComponent() {
  const [showAuth, setShowAuth] = React.useState(false);
  const [role, setRole] = React.useState<UserInterface['role']>('user');

  const handleShowAuth = (value: UserInterface['role']) => {
    setRole(value);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] p-6">
      <div className="container max-w-6xl mx-auto">
        {/* Logo */}
        <motion.div
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="text-[#4461F2] w-8 h-8">
              <Users className="w-full h-full" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-[#4461F2]">
              ProfilFirst
            </span>
          </div>
          <PrimaryButton
            label="Se connecter"
            className="w-max px-8 py-2 rounded-full"
            onClick={() => handleShowAuth('user')}
          />
        </motion.div>

        {/* Header Section */}
        <motion.div className="text-center mb-10" {...fadeIn}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 flex flex-col gap-3">
            <span className="bg-gradient-to-r from-[#4461F2] to-[#6B7FFF] bg-clip-text text-transparent">
              Un CV qui attire les recruteurs.
            </span>
            <span className="text-[1.3rem] md:text-[1.7rem] tracking-tight text-gray-700">
              Des offres qui vous correspondent, sans postuler.
            </span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-6 flex justify-center items-center gap-6">
            <span className="bg-gradient-to-r from-[var(--u-primary-color)] via-[#4461F2] to-[var(--r-primary-color)] bg-clip-text text-transparent font-semibold">
              3 clics pour un CV
            </span>
            <span className="bg-gradient-to-r from-[var(--u-primary-color)] via-[#4461F2] to-[var(--r-primary-color)] bg-clip-text text-transparent font-semibold">
              3 clics pour un talent
            </span>
            <span className="bg-gradient-to-r from-[var(--u-primary-color)] via-[#4461F2] to-[var(--r-primary-color)] bg-clip-text text-transparent font-semibold">
              3 clics pour un entretien
            </span>
          </p>
        </motion.div>

        {/* Professional Image Section */}
        <motion.div
          className="w-full max-w-4xl mx-auto mb-12 grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="relative group overflow-hidden rounded-xl"
            variants={fadeIn}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800"
              alt="Young professional"
              width={800}
              height={192}
              className="w-full h-48 object-cover rounded-xl"
            />
          </motion.div>
          <motion.div
            className="relative group overflow-hidden rounded-xl"
            variants={fadeIn}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800"
              alt="Experienced professional"
              width={800}
              height={192}
              className="w-full h-48 object-cover rounded-xl"
            />
          </motion.div>
          <motion.div
            className="relative group overflow-hidden rounded-xl"
            variants={fadeIn}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800"
              alt="Senior professional"
              width={800}
              height={192}
              className="w-full h-48 object-cover rounded-xl"
            />
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="flex gap-12 justify-center text-lg text-gray-600 mb-12"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="flex items-center gap-2"
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
          >
            <Clock className="w-6 h-6 text-blue-500" />
            <span>CV optimisé en 2min</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
          >
            <CheckCircle className="w-6 h-6 text-yellow-500" />
            <span>Expérience validée</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
          >
            <Trophy className="w-6 h-6 text-purple-500" />
            <span>Recrutements faciles</span>
          </motion.div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <div className="flex flex-col items-center gap-8">
            {/* Candidate Section */}
            <motion.div
              className="group bg-gradient-to-br from-[var(--u-primary-color)] to-[#8B5CF6] rounded-xl p-6 hover:opacity-95 transition-all duration-300 cursor-pointer shadow-lg"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-[var(--u-primary-color)]/20 rounded-full">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Je suis Candidat
                </h2>
                <div className="space-y-4 text-white/80">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-[#D8B4FE]" />
                    <span>Déposez votre CV</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#D8B4FE]" />
                    <span>Découvrez son score</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D8B4FE]" />
                    <span>Optimisez le avec l'IA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#D8B4FE]" />
                    <span>Décrochez des rendez-vous sans candidater</span>
                  </div>
                </div>
                <Link
                  href="/candidat"
                  className="mt-6 px-8 py-3 bg-white text-[var(--u-primary-color)] rounded-full font-semibold hover:bg-purple-50 transition-colors duration-300 shadow-lg inline-block"
                >
                  Démarrer gratuitement
                </Link>
              </div>
            </motion.div>
            <button
              onClick={() => handleShowAuth('user')}
              className="px-8 py-3 bg-[var(--u-primary-color)] text-white rounded-full font-semibold hover:opacity-80 transition-opacity duration-300 cursor-pointer"
            >
              Je me connecte
            </button>
          </div>

          <div className="flex flex-col items-center gap-8">
            {/* Recruiter Section */}
            <motion.div
              className="group bg-gradient-to-br from-[var(--r-primary-color)] to-[#22D3EE] rounded-xl p-6 hover:opacity-95 transition-all duration-300 cursor-pointer shadow-lg"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-[var(--r-primary-color)]/20 rounded-full">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Je suis Recruteur
                </h2>
                <div className="space-y-4 text-white/80">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#A5F3FC]" />
                    <span>Accédez aux meilleurs profils pré-qualifiés</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-[#A5F3FC]" />
                    <span>Sourcez avec l'IA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#A5F3FC]" />
                    <span>Proposez un rendez-vous</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#A5F3FC]" />
                    <span>Accélérez vos recrutements</span>
                  </div>
                </div>
                <button className="mt-6 px-8 py-3 bg-white text-[var(--r-primary-color)] rounded-full font-semibold hover:bg-cyan-50 transition-colors duration-300 shadow-lg">
                  Démarrer gratuitement
                </button>
              </div>
            </motion.div>
            <button
              onClick={() => handleShowAuth('recruiter')}
              className="px-8 py-3 bg-[var(--r-primary-color)] text-white rounded-full font-semibold hover:opacity-80 transition-opacity duration-300 cursor-pointer"
            >
              Je me connecte
            </button>
          </div>
        </motion.div>

        {/* How it Works Section */}
        <div className="mt-24 w-full">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
            Comment ça marche ?
          </h2>

          {/* Candidate Process */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-purple-600 mb-8 text-center">
              Pour les candidats
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-lg">
                <div className="p-4 bg-purple-100 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  1. Importez votre CV
                </h4>
                <p className="text-gray-600">
                  Téléchargez votre CV actuel ou créez-en un nouveau avec notre
                  éditeur intuitif
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-lg">
                <div className="p-4 bg-purple-100 rounded-full mb-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  2. Optimisation IA
                </h4>
                <p className="text-gray-600">
                  Notre IA analyse et optimise votre CV pour le rendre plus
                  attractif et pertinent
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-lg">
                <div className="p-4 bg-purple-100 rounded-full mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  3. Recevez des offres
                </h4>
                <p className="text-gray-600">
                  Les recruteurs vous contactent directement avec des offres qui
                  correspondent à votre profil
                </p>
              </div>
            </div>
          </div>

          {/* Recruiter Process */}
          <div>
            <h3 className="text-2xl font-semibold text-cyan-600 mb-8 text-center">
              Pour les recruteurs
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-lg">
                <div className="p-4 bg-cyan-100 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-cyan-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  1. Décrivez votre besoin
                </h4>
                <p className="text-gray-600">
                  Précisez le profil recherché et les compétences requises pour
                  le poste
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-lg">
                <div className="p-4 bg-cyan-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-cyan-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  2. Matching intelligent
                </h4>
                <p className="text-gray-600">
                  Notre IA identifie les candidats les plus pertinents pour
                  votre entreprise
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-lg">
                <div className="p-4 bg-cyan-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  3. Contactez directement
                </h4>
                <p className="text-gray-600">
                  Échangez avec les candidats sélectionnés et accélérez vos
                  recrutements
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-24 w-full">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Pourquoi nous choisir ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl transform group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  IA Innovante
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Optimisation intelligente basée sur les dernières tendances du
                  marché
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transform group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Matching Précis
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Algorithmes avancés pour des correspondances pertinentes
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl transform group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Gain de Temps
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Process simplifié pour une expérience fluide
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl transform group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Résultats Garantis
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Accompagnement personnalisé jusqu'au succès
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 w-full text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Prêt à transformer votre approche du recrutement ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez-nous et découvrez une nouvelle façon de recruter ou de
            trouver votre prochain emploi.
          </p>
          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium text-gray-600 mb-3">
                Candidats
              </span>
              <button className="px-8 py-4 bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] text-white rounded-full font-semibold hover:opacity-80 transition-opacity duration-300 shadow-lg">
                Go faire mon CV
              </button>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium text-gray-600 mb-3">
                Recruteur
              </span>
              <button className="px-8 py-4 bg-gradient-to-r from-[var(--r-primary-color)] to-[#22D3EE] text-white rounded-full font-semibold hover:opacity-80 transition-opacity duration-300 shadow-lg">
                Go recruter facilement
              </button>
            </div>
          </div>
        </div>

        {/* Founder's Message Section */}
        <div className="mt-24 mb-24 w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2">
                <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl overflow-hidden shadow-inner">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-gray-600 font-medium">
                          Vidéo à intégrer (2 min)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Le mot du fondateur
                  </span>
                  <span className="text-2xl">🎥</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed tracking-wide">
                  <span className="font-medium">
                    Pourquoi j'ai créé ProfilFirst ?
                  </span>
                  <br className="hidden md:block" />
                  <span className="block mt-3 space-y-2">
                    <span className="block">
                      – Candidats : un CV efficace en 3 clics
                    </span>
                    <span className="block">
                      – Recruteurs : des talents qualifiés en 3 clics
                    </span>
                    <span className="block">
                      – Ensemble : une rencontre en 3 clics
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 border-t border-gray-200 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-8">
                <div className="flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-[#4461F2]" />
                  <span className="text-lg font-semibold text-[#4461F2]">
                    ProfilFirst
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex flex-col">
                  <p className="font-medium">© 2025 ProfilFirst</p>
                </div>
                <ul className="flex gap-4 text-xs text-gray-600">
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      Mentions légales
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      Politique de confidentialité
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      CGU
                    </a>
                  </li>
                </ul>
                <div className="flex items-center gap-1.5 text-xs">
                  <Heart className="w-3.5 h-3.5 text-pink-500" />
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-medium">
                    Une histoire en 3 clics
                  </span>
                </div>
              </div>
              <Link
                href="#"
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {showAuth && (
        <Popup full onClose={() => setShowAuth(false)}>
          <AuthComponent role={role} />
        </Popup>
      )}
    </div>
  );
}
