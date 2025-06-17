'use client';

import React from 'react';
import Button from './Button';
import MovingDots from './MovingDots';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Lightbulb, Settings } from 'lucide-react';
import { advantages } from '@/data/content';
import { UserInterface } from '@/interfaces/user.interface';

const iconComponents = {
  target: Target,
  lightbulb: Lightbulb,
  settings: Settings,
};

export default function Advantages({
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
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="advantages"
      className="relative flex justify-center py-24 overflow-hidden"
    >
      <MovingDots />
      <div className="max-w-7xl relative flex flex-col gap-12 z-10">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-[var(--text-primary-color)]">
          3 avantages qui changent tout
        </h2>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {advantages.map((advantage) => {
            const IconComponent =
              iconComponents[advantage.icon as keyof typeof iconComponents];

            return (
              <motion.div
                key={advantage.id}
                className="flex flex-col items-center p-8 customShadow rounded-md bg-[var(--bg-secondary-color)]"
                variants={itemVariants}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-200 text-[var(--u-primary-color)] mb-6">
                  <IconComponent size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[var(--text-primary-color)]">
                  {advantage.title}
                </h3>
                <p className="text-center text-[var(--text-secondary-gray)]">
                  {advantage.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div className="text-center" variants={itemVariants}>
          <Button
            onClick={() => handleShowAuth('candidat', 'register', true)}
            variant="primary"
            size="lg"
            className="shadow-xl hover:shadow-2xl cursor-pointer"
          >
            Démarrer mon CV gratuitement
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
