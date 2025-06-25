import React from 'react';
import {
  X,
  Brain,
  Target,
  Package,
  Users,
  Puzzle,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

interface InfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-500 scale-100 border border-white/60">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/40 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-100/40 to-pink-100/30 rounded-full blur-3xl"></div>

        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="text-2xl relative z-10">🔍</span>
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Quali Carrière, c'est quoi ?
                </h2>
                <p className="text-gray-600 text-lg">
                  Découvre tout ce que tu dois savoir sur l'outil
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/60 rounded-full transition-all duration-200 group"
            >
              <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg">
              <p className="text-gray-800 leading-relaxed text-base mb-4">
                Quali Carrière est un outil intelligent qui aide les candidats à
                l'emploi à mieux se présenter aux recruteurs, en analysant leur
                profil avec l'IA.
              </p>
              <p className="text-gray-800 leading-relaxed text-base">
                C'est un outil avec quelques compétences d'un Coach Carrière qui
                maîtrise ton profil de A à Z :
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    il te fait passer un entretien
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    il produit une synthèse précise de chaque expérience pour
                    t'aider à en parler
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    il illustre 30 compétences qui ressortent de ton profil
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    après l'entretien tu peux converser avec lui via un chat
                    pour qu'il t'aide à mieux parler de toi.
                  </span>
                </li>
              </ul>
            </div>

            {/* Comment ça fonctionne */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Comment ça fonctionne ?
                </h3>
              </div>
              <p className="text-gray-800 leading-relaxed text-base mb-3">
                Tu réponds à plusieurs questions simples sur ton parcours et tes
                expériences :
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <p className="text-gray-800 font-medium">
                  ➡️ L'IA analyse tes réponses et produit une synthèse
                  professionnelle claire, structurée, et crédible — qui va
                  t'aider pour parler aux recruteurs.
                </p>
              </div>
            </div>

            {/* À quoi ça sert */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  À quoi ça sert ?
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    À mieux te connaître professionnellement
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    À savoir quoi dire en entretien ou dans une lettre de
                    motivation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    À t'évaluer sans bullshit, avec un vrai regard externe
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    À t'aider à préparer ton discours quand tu cherches un job
                    ou que tu veux changer
                  </span>
                </li>
              </ul>
            </div>

            {/* Et le résultat */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Et le résultat ?
                </h3>
              </div>
              <p className="text-gray-800 leading-relaxed text-base mb-4">
                Tu reçois :
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold">✅</span>
                  <span className="text-gray-700">
                    Un storytelling de chaque expérience
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold">✅</span>
                  <span className="text-gray-700">
                    Une liste de 30 compétences de ton profil
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold">✅</span>
                  <span className="text-gray-700">
                    Un Profiler Coach IA qui te connaît et t'aide à parler de
                    toi efficacement
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold">✅</span>
                  <span className="text-gray-700">
                    Des suggestions personnalisées si tu utilises CV Minute
                  </span>
                </li>
              </ul>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-gray-800 font-medium">
                  👉 Tout ça, automatiquement, en quelques minutes.
                </p>
              </div>
            </div>

            {/* À qui ça s'adresse */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  À qui ça s'adresse ?
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    A toute personne souhaitant être plus puissante en entretien
                    : étudiant, récemment diplômés, expérimentés, manager ou
                    membres de direction.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    À ceux qui veulent juste y voir plus clair
                  </span>
                </li>
              </ul>
            </div>

            {/* Ce que ce n'est pas */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Puzzle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Ce que ce n'est pas :
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Ce n'est pas un générateur de bullshit
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Ce n'est pas une IA qui brode des trucs faux
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Ce n'est pas un test de personnalité fumeux
                  </span>
                </li>
              </ul>
            </div>

            {/* Conclusion */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-indigo-100 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  C'est un outil concret, intelligent et ultra-efficace.
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-800 font-medium">
                  Quali Carrière t'aligne, t'éclaire et t'aide à convaincre.
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-center mt-8">
            <Link
              href="/quali-carriere/step"
              className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-2">
                <span>C'est parti !</span>
                <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
