'use client';

import React from 'react';
import Button from './Button';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { UserInterface } from '@/interfaces/user.interface';

export default function Cta({
  handleShowAuth,
}: {
  handleShowAuth: (
    value: UserInterface['role'],
    show: string,
    empty: boolean,
  ) => void;
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section
      id="start"
      className="py-20 [background-image:var(--bg-secondary)] relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="container relative z-10">
        <motion.div
          ref={ref}
          className="max-w-3xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à décrocher plus d'entretiens ?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            3 minutes pour transformer votre CV. Zéro risque. Résultat immédiat.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Button
              onClick={() => handleShowAuth('candidat', 'register', true)}
              variant="primary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100 shadow-xl cursor-pointer"
            >
              Créer mon CV gratuitement
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
