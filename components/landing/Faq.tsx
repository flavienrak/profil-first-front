'use client';

import React from 'react';
import MovingDots from './MovingDots';
import Button from './Button';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { faqItems } from '@/data/content';

export default function Faq() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [showAllFaq, setShowAllFaq] = React.useState(false);
  const [openItem, setOpenItem] = React.useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  const toggleShowAllFaq = () => {
    setShowAllFaq(!showAllFaq);
    setOpenItem(null);
  };

  return (
    <section
      id="faq"
      className="relative flex justify-center py-24 overflow-hidden"
    >
      <MovingDots />
      <div className="container max-w-7xl relative flex flex-col gap-14 z-10">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-[var(--text-primary-color)]">
          FAQ
        </h2>

        <div className="text-center mb-8">
          <Button
            onClick={toggleShowAllFaq}
            variant="secondary"
            className="inline-flex items-center gap-2 text-[var(--u-primary-color)] border-[var(--u-primary-color)] cursor-pointer"
          >
            {showAllFaq ? (
              <Minus className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            Consulter notre FAQ
          </Button>
        </div>

        <AnimatePresence>
          {showAllFaq && (
            <motion.div
              ref={ref}
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-[var(--text-primary-color)]/15 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-4 md:p-6 text-left bg-[var(--secondary-color)] hover:bg-[var(--bg-primary-color)] transition-colors duration-200"
                    onClick={() => toggleItem(item.id)}
                  >
                    <h3 className="text-lg font-medium text-[var(--text-primary-color)]">
                      {item.question}
                    </h3>
                    {openItem === item.id ? (
                      <ChevronUp
                        className="flex-shrink-0 text-[var(--u-primary-color)]"
                        size={20}
                      />
                    ) : (
                      <ChevronDown
                        className="flex-shrink-0 text-[var(--text-secondary-gray)]"
                        size={20}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {openItem === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 md:p-6 pt-0 text-[var(--text-secondary-gray))]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
