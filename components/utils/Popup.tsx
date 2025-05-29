'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Popup({
  large,
  full,
  onClose,
  children,
}: {
  large?: boolean;
  full?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0 z-[100] w-screen h-screen bg-black/40 flex justify-center items-center"
      >
        <div
          className={`bg-[var(--bg-secondary-color)] border border-[var(--text-primary-color)]/10 p-5 rounded-xl relative shadow ${
            full ? '' : large ? 'max-w-[52rem]' : 'max-w-[32rem]'
          }`}
        >
          {children}
          {onClose && (
            <i
              onClick={onClose}
              className="absolute z-10 text-[var(--text-primary-color)] top-2 right-2 p-2 cursor-pointer rounded-full flex justify-center items-center h-10 w-10 bg-[var(--bg-primary-color)] transition-all duration-150"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </i>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
