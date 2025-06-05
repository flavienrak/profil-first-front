'use client';

import React from 'react';
import MovingDots from './MovingDots';
import Image from 'next/image';
import Popup from '../utils/Popup';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export default function OptimizeExperience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="optimize"
      className="relative flex justify-center py-24 overflow-hidden"
    >
      <MovingDots />
      <div className="max-w-7xl container relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-12"
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--text-primary-color)]">
              Optimisez votre description grâce au score d'optimisation
              d'expérience
            </h2>
            <p className="text-lg text-[var(--text-primary-gray)] mb-6">
              Notre outil d'intelligence artificielle analyse votre CV et
              l'offre d'emploi pour identifier les points forts à mettre en
              valeur et les éléments à améliorer.
            </p>
            <p className="text-lg text-[var(--text-primary-gray)]">
              En quelques clics seulement, transformez vos expériences
              professionnelles en atouts décisifs pour décrocher l'emploi de vos
              rêves.
            </p>
          </motion.div>
          <motion.div
            className="w-full md:w-1/2"
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="/optimize-exp.png"
              alt="CV Optimization Interface"
              width={608}
              height={342}
              className="w-full rounded-lg shadow-xl cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setIsModalOpen(true)}
            />
          </motion.div>
        </div>
      </div>
      {isModalOpen && (
        <Popup large onClose={() => setIsModalOpen(false)}>
          <div className="p-1">
            <Image
              src="/optimize-exp.png"
              alt="CV Optimization Interface"
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
