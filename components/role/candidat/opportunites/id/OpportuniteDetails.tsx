'use client';

import React from 'react';
import Link from 'next/link';

import { ArrowLeft, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OpportuniteDetails() {
  return (
    <div className="min-h-full w-full px-12 py-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Link
          href="/opportunites"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux opportunités</span>
        </Link>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Félicitations</h1>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl text-gray-800 text-center mb-6">
          L'entreprise TechCorp vous a contacté
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Job Details */}
          <div className="md:col-span-2 bg-gray-50 rounded-xl p-6">
            <h3 className="font-medium text-gray-800 mb-4">
              Voici la fiche de poste :
            </h3>
            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-4 custom-scrollbar">
              <div>
                <h4 className="font-semibold text-lg">
                  Développeur Full Stack
                </h4>
                <p className="text-gray-600">CDI - Paris</p>
                <p className="text-gray-600">45-55k€/an</p>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• 3 ans d'expérience minimum</li>
                <li>• Stack: React, Node.js, MongoDB</li>
                <li>• Télétravail partiel possible</li>
                <li>• Travail en équipe agile</li>
                <li>• Participation aux choix techniques</li>
                <li>• Environnement dynamique et innovant</li>
                <li>• Formation continue</li>
                <li>• Mutuelle d'entreprise</li>
                <li>• Tickets restaurant</li>
              </ul>
              <div className="mt-4">
                <h5 className="font-medium mb-2">Description du poste :</h5>
                <p className="text-gray-600">
                  Au sein de notre équipe technique, vous serez amené à
                  participer au développement de nos applications web en
                  utilisant les dernières technologies. Vous travaillerez en
                  étroite collaboration avec nos équipes produit et design pour
                  créer des fonctionnalités innovantes.
                </p>
              </div>
              <div className="mt-4">
                <h5 className="font-medium mb-2">Responsabilités :</h5>
                <ul className="space-y-2 text-gray-600">
                  <li>• Développement de nouvelles fonctionnalités</li>
                  <li>• Maintenance et amélioration du code existant</li>
                  <li>• Participation aux revues de code</li>
                  <li>• Contribution à l'architecture technique</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CV Preview */}
          <div className="md:col-span-1 bg-gray-50 rounded-xl p-6">
            <h3 className="font-medium text-gray-800 mb-4">
              Voici le CV qui l'a convaincu :
            </h3>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-[var(--u-primary-color)]" />
              </div>
              <div>
                <p className="font-medium text-[var(--u-primary-color)]">
                  Consulter le CV
                </p>
                <p className="text-sm text-gray-500">
                  Mis à jour le 15 Juin 2025
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <h3 className="text-xl text-center">
            Souhaitez-vous rentrer en contact avec cette entreprise ?
          </h3>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2">
              <span className="text-green-400">✓</span> J'accepte
            </button>
            <button className="px-8 py-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2">
              <span className="text-red-400">×</span> Je refuse
            </button>
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-6 grid md:grid-cols-2 gap-6 text-sm text-gray-500">
          <p>
            Si vous acceptez de rentrer en contact avec cette entreprise votre
            CV ne sera plus anonyme et nous transmettrons les informations
            personnelles que vous avez mentionnées (nom, prénom, ville, numéro,
            mail)
          </p>
          <p>
            Sachez que cette action est définitive. Nous enverrons un message de
            refus à l'entreprise
          </p>
        </div>
      </motion.div>
    </div>
  );
}
