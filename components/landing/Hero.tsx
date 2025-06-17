'use client';

import React from 'react';
import Button from './Button';
import Image from 'next/image';
import Popup from '../utils/Popup';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { UserInterface } from '@/interfaces/user.interface';

export default function Hero({
  handleShowAuth,
}: {
  handleShowAuth: (
    value: UserInterface['role'],
    show: string,
    empty: boolean,
  ) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="hero"
      className="flex flex-col items-center pt-20 pb-16 md:pt-28 md:pb-24 [background-image:var(--bg-secondary)] overflow-hidden"
    >
      <div className="max-w-7xl container animate-breathe">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="w-full md:w-2/5 text-white mb-12 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-purple-300">Un CV optimisé.</span>
              <br />
              Une seule offre.
              <br />
              Zéro perte de temps.
            </h1>
            <p className="text-base md:text-lg mb-8 opacity-90">
              Dépose ton CV, colle l'offre d'emploi, 3 clics d'IA
              <br />→ puis télécharge ton CV.
            </p>
            <Button
              onClick={() => handleShowAuth('candidat', 'register', true)}
              variant="primary"
              size="lg"
              className="shadow-xl hover:shadow-2xl cursor-pointer"
            >
              Je créé (enfin) un vrai CV efficace
            </Button>
          </motion.div>
          <motion.div
            className="w-full md:w-3/5 animate-float"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="/cv-optimization.png"
              alt="CV Optimization Process"
              width={730}
              height={410}
              className="w-full rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
              style={{
                boxShadow:
                  '0 0 30px 5px #00E9FD, 0 0 60px 10px rgba(0, 233, 253, 0.5)',
              }}
              onClick={() => setIsModalOpen(true)}
            />
          </motion.div>
        </div>
      </div>
      <div className="container mt-16">
        <p
          className="text-center text-2xl md:text-3xl font-bold"
          style={{
            color: '#00E9FD',
            textShadow: '0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          L'outil IA CV de référence pour trouver un poste rapidement
        </p>
      </div>
      {isModalOpen && (
        <Popup large onClose={() => setIsModalOpen(false)}>
          <div className="p-1">
            <Image
              src="/cv-optimization.png"
              width={730}
              height={410}
              alt="CV Optimization Process"
            />
          </div>
        </Popup>
      )}
    </section>
  );
}
