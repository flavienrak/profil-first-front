'use client';

import React from 'react';
import { Briefcase, Download, Edit, Mail, MapPin, Phone } from 'lucide-react';

export default function CvModification() {
  return (
    <div className="flex justify-center flex-col">
      <div className="fixed top-0 left-0 ml-64 px-8 h-20 w-[calc(100%-16rem)] border-b bg-white flex items-center">
        <div className="w-full flex justify-center items-center gap-5">
          <button className="flex justify-center items-center gap-2 h-12 px-6 rounded-lg text-sm font-semibold bg-gray-200 hover:opacity-90 cursor-pointer">
            Guide de rédaction du CV
          </button>
          <button className="flex justify-center items-center gap-2 h-12 px-6 rounded-lg text-sm font-semibold bg-gray-200 hover:opacity-90 cursor-pointer">
            Relire l’offre
          </button>
          <button className="flex justify-center items-center gap-2 h-12 px-6 rounded-lg text-sm font-semibold bg-gray-200 hover:opacity-90 cursor-pointer">
            Matching score
          </button>
          <button className="flex justify-center items-center gap-2 h-12 px-6 rounded-lg text-sm font-semibold bg-gray-200 hover:opacity-90 cursor-pointer">
            Optimiser en un clic
          </button>
          <button className="flex justify-center items-center gap-2 h-12 px-6 rounded-lg text-sm font-semibold bg-gray-200 hover:opacity-90 cursor-pointer">
            Enregistrer le CV et l’offre
          </button>
          <button className="flex justify-center items-center gap-2 h-12 py-3 ps-4 pe-6 rounded-lg text-white bg-[var(--primary-color)] hover:opacity-90 cursor-pointer">
            <Download />
            <span className="text-sm font-semibold">Télécharger le CV</span>
          </button>
        </div>
      </div>
      <div className="flex justify-center py-8 mt-20">
        {/* Header Section */}
        {/* h-[1386px] */}
        <div className="flex bg-white w-[800px] rounded-lg shadow-md overflow-hidden">
          {/* Left Column - Photo and Contact */}
          <div className="w-1/3 bg-[#2A7F8B] text-white p-4">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-white mb-3 flex items-center justify-center text-gray-400">
                <span>Votre photo ici</span>
              </div>
              <h2 className="text-base font-medium">Prénom</h2>
              <h1 className="text-lg font-bold mb-3">NOM</h1>

              <div className="w-full space-y-2 mt-2 text-sm">
                <div className="flex items-center gap-1.5 group relative">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 cursor-pointer">Ville</span>
                </div>
                <div className="flex items-center gap-1.5 group relative">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 cursor-pointer">06xxxxxxxxx</span>
                </div>
                <div className="flex items-center gap-1.5 group relative">
                  <Briefcase className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 cursor-pointer">Permis A</span>
                </div>
                <div className="flex items-center gap-1.5 group relative">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 cursor-pointer text-xs break-all">
                    user@gmail.com
                  </span>
                </div>
              </div>

              {/* Diplômes */}
              <div className="w-full mt-4">
                <div className="bg-[#1A5F6B] py-1 px-3 font-semibold mb-2 text-xs">
                  DIPLÔMES
                </div>
                <div className="pl-2 text-xs">
                  <p className="text-xs italic">Aucun diplôme ajouté</p>
                </div>
              </div>

              {/* Compétences */}
              <div className="w-full mt-4">
                <div className="bg-[#1A5F6B] py-1 px-3 font-semibold mb-2 text-xs">
                  COMPÉTENCES
                </div>
                <div className="pl-2 cursor-pointer hover:bg-[#1A5F6B]/10 p-1 rounded text-xs">
                  <p className="text-xs italic">Aucune compétence ajoutée</p>
                </div>
              </div>

              {/* Langues */}
              <div className="w-full mt-4">
                <div className="bg-[#1A5F6B] py-1 px-3 font-semibold mb-2 text-xs">
                  LANGUES
                </div>
                <div className="pl-2 text-xs">
                  <p>Anglais</p>
                </div>
              </div>

              {/* Centres d'intérêt */}
              <div className="w-full mt-4">
                <div className="bg-[#1A5F6B] py-1 px-3 font-semibold mb-2 text-xs">
                  CENTRES D'INTÉRÊT
                </div>
                <div className="pl-2 text-xs">
                  <div>
                    <p>Sport : natation et fitness</p>
                    <p className="mt-0.5">Activités associatives</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Professional Content */}
          <div className="w-2/3 p-6">
            <div className="flex justify-between items-center mb-4 cursor-pointer hover:bg-gray-50 py-1.5 rounded">
              <h1 className="text-xl font-bold text-gray-800">'Titre du CV'</h1>
              <Edit className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex justify-between text-gray-700 mb-6 cursor-pointer hover:bg-gray-50 py-1.5 rounded text-sm">
              <p>'Résumé du profil professionnel'</p>
              <Edit className="w-3.5 h-3.5 text-gray-400 mt-1" />
            </div>

            {/* Expériences professionnelles */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-[#2A7F8B] border-b-2 border-[#2A7F8B] pb-1">
                  Expériences professionnelles
                </h2>
              </div>

              <p className="text-gray-500 italic text-sm">
                Aucune expérience ajoutée
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
