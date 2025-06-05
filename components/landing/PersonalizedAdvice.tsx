'use client';

import React from 'react';
import MovingDots from './MovingDots';
import Popup from '../utils/Popup';
import Image from 'next/image';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export default function PersonalizedAdvice() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative flex justify-center py-24 overflow-hidden">
      <MovingDots />
      <div className="max-w-7xl container relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="w-full md:w-1/2"
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/conseils.png"
              alt="Conseils personnalisés"
              width={608}
              height={342}
              className="w-full rounded-lg shadow-xl cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setIsModalOpen(true)}
            />
          </motion.div>

          <motion.div
            className="w-full md:w-1/2"
            ref={ref}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--text-primary-color)]">
              Bénéficiez de conseils personnalisés pour optimiser une expérience
            </h2>
            <p className="text-lg text-[var(--text-primary-gray)]">
              Notre système d'intelligence artificielle analyse en profondeur
              votre profil et vous guide pas à pas pour mettre en valeur chacune
              de vos expériences professionnelles de manière pertinente et
              impactante.
            </p>
          </motion.div>
        </div>
      </div>
      {isModalOpen && (
        <Popup large onClose={() => setIsModalOpen(false)}>
          <div className="p-1">
            <Image
              src="/conseils.png"
              alt="Conseils personnalisés"
              width={608}
              height={342}
              className="w-full rounded-lg"
            />
          </div>
        </Popup>
      )}
    </section>
  );
}
