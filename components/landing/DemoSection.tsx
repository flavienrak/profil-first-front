'use client';

import React from 'react';
import MovingDots from './MovingDots';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function DemoSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const steps = [
    {
      id: 1,
      title: 'Télécharge ton CV',
      description: 'Importe ton CV actuel au format PDF ou Word.',
    },
    {
      id: 2,
      title: "Colle l'offre d'emploi",
      description: "Ajoute le texte de l'annonce pour analyse des mots-clés.",
    },
    {
      id: 3,
      title: 'Optimise en un clic',
      description: "L'IA suggère des améliorations pour chaque section.",
    },
  ];

  return (
    <section
      id="demo"
      className="relative flex justify-center py-24 overflow-hidden"
    >
      <MovingDots />
      <div className="max-w-7xl container relative flex flex-col gap-12">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-[var(--text-primary-color)]">
          Comment ça marche
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="w-full lg:w-2/5"
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--u-primary-color)] text-white flex items-center justify-center text-xl font-bold">
                    {step.id}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary-color)]">
                      {step.title}
                    </h3>
                    <p className="text-[var(--text-primary-gray)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="w-full lg:w-3/5 bg-[var(--bg-secondary-color)] rounded-xl shadow-xl p-4 relative"
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Demo Image Placeholder - Replace with actual demo UI */}
            <div className="aspect-video rounded-lg bg-[var(--bg-primary-color)] overflow-hidden flex items-center justify-center">
              <div className="text-center p-8">
                <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary-color)]">
                  Visualisez comment optimiser votre CV
                </h3>
                <p className="text-lg text-[var(--text-secondary-gray)] mb-6">
                  Notre interface intuitive vous guide à chaque étape pour
                  maximiser l'impact de votre CV.
                </p>
                <div className="w-24 h-24 mx-auto rounded-full bg-[var(--u-primary-color)]/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--u-primary-color)]/60 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[var(--u-primary-color)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
