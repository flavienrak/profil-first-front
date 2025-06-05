'use client';

import React from 'react';
import Image from 'next/image';

import { motion } from 'framer-motion';

export default function CreatorInfo() {
  return (
    <section className="py-8">
      <div className="container">
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Image
            src="/coach-victorien.png"
            alt="Creator Profile"
            width={96}
            height={96}
            className="rounded-full border-4 border-purple-200 shadow-lg"
          />
          <p className="text-lg font-medium text-[var(--text-primary-color)]">
            Outil créé par{' '}
            <span className="text-[var(--u-primary-color)]">Victorien Am</span>{' '}
            – Coach Carrière et recruteur
          </p>
        </motion.div>
      </div>
    </section>
  );
}
