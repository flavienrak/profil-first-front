'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

import {
  ArrowLeft,
  FileText,
  Building2,
  Users2,
  Briefcase,
  Code,
  Target,
  CheckCircle,
  Star,
} from 'lucide-react';

export default function OngoingOpportunity() {
  return (
    <main className="flex-1 ml-20 p-8 transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/opportunites"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux opportunités</span>
        </Link>

        {/* Meeting Info */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[var(--u-primary-color)]" />
              <h2 className="text-2xl font-semibold">
                ACME Corp - Développeur Full-Stack
              </h2>
            </div>
            <button className="px-6 py-3 bg-[var(--r-primary-color)] text-white rounded-lg hover:bg-[#0891b2] transition-colors flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Consulter l'offre
            </button>
          </div>
          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Users2 className="w-5 h-5" />
              <span>Paris</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Voir le CV retenu par le recruteur
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <Image
                src="/coach.png"
                alt="Profiler Coach"
                width={64}
                height={64}
                className="w-16 h-16"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-[var(--u-primary-color)] to-[#08EEDE] text-white rounded-lg hover:opacity-90 transition-opacity shadow-md">
                Parler entretien avec Profiler Coach
              </button>
            </div>
          </div>
        </div>

        {/* Coach Advice Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--u-primary-color)] rounded-full"></span>
            Les conseils de Profiler Coach pour votre rendez-vous
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Company Perception */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Users2 className="w-5 h-5 text-[var(--u-primary-color)]" />
                Les yeux du recruteur
              </h4>
              <div className="space-y-4 text-gray-600">
                <p>
                  Profil senior avec une expertise technique solide et une
                  expérience managériale significative, correspondant
                  parfaitement aux besoins de notre équipe en croissance.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Double compétence technique/management recherchée</li>
                  <li>Capacité démontrée à mener des projets d'envergure</li>
                  <li>Culture DevOps alignée avec nos pratiques</li>
                  <li>Potentiel d'évolution vers un rôle de Tech Lead</li>
                  <li>Excellente communication technique</li>
                </ul>
              </div>
            </div>

            {/* Relevant Points */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-[var(--u-primary-color)]" />
                Points forts de votre profil
              </h4>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">
                    Correspondance technique
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-green-700">
                    <li>5 ans d'expérience en React.js</li>
                    <li>Expertise Node.js et MongoDB</li>
                    <li>Pratique DevOps (CI/CD, Docker)</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">
                    Soft skills valorisés
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Leadership technique</li>
                    <li>Communication client</li>
                    <li>Gestion d'équipe Agile</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Points to Mention */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[var(--u-primary-color)]" />
                Points à mettre en avant
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-3">Réalisations clés</h5>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <Code className="w-5 h-5 text-[var(--u-primary-color)] mt-1" />
                      <span>
                        Refonte complète de l'architecture microservices
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="w-5 h-5 text-[var(--u-primary-color)] mt-1" />
                      <span>Réduction de 40% du temps de déploiement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users2 className="w-5 h-5 text-[var(--u-primary-color)] mt-1" />
                      <span>Management d'une équipe de 5 développeurs</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-3">Compétences recherchées</h5>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[var(--u-primary-color)]/10 text-[var(--u-primary-color)] rounded-full text-sm">
                      React.js
                    </span>
                    <span className="px-3 py-1 bg-[var(--u-primary-color)]/10 text-[var(--u-primary-color)] rounded-full text-sm">
                      Node.js
                    </span>
                    <span className="px-3 py-1 bg-[var(--u-primary-color)]/10 text-[var(--u-primary-color)] rounded-full text-sm">
                      MongoDB
                    </span>
                    <span className="px-3 py-1 bg-[var(--u-primary-color)]/10 text-[var(--u-primary-color)] rounded-full text-sm">
                      Docker
                    </span>
                    <span className="px-3 py-1 bg-[var(--u-primary-color)]/10 text-[var(--u-primary-color)] rounded-full text-sm">
                      AWS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
