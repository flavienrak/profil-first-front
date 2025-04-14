'use client';

import React from 'react';
import DOMPurify from 'dompurify';

import { motion } from 'framer-motion';
import { Step } from '@/interfaces/step.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { X } from 'lucide-react';

export default function Guide({
  steps,
  currentStep,
  onNext,
  onPrevious,
  onClose,
}: {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}) {
  const { fontSize } = useSelector((state: RootState) => state.persistInfos);
  const step = steps[currentStep];
  const [clonedElements, setClonedElements] = React.useState<
    Record<string, string>
  >({});
  const [elementClone, setElementClone] = React.useState<string | null>(null);
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  // 1. Clone tous les éléments une seule fois
  React.useEffect(() => {
    const clones: Record<string, string> = {};

    steps.forEach((s) => {
      const el = document.querySelector(`.${s.class}`);
      if (el) {
        const clone = el.cloneNode(true) as HTMLElement;
        clones[s.class] = clone.outerHTML;
      }
    });

    setClonedElements(clones);
  }, [steps]);

  // 2. À chaque step, utilise les données déjà clonées
  React.useEffect(() => {
    if (step) {
      const el = document.querySelector(`.${step.class}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }

      setElementClone(clonedElements[step.class] || null);
    }
  }, [step, clonedElements]);

  if (!step) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center z-50"
    >
      {elementClone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          className="absolute py-[1em] px-[1em] flex justify-center items-center bg-gray-50 z-[100]"
          style={{
            top: `${position.top - fontSize}px`,
            left: `${position.left - fontSize}px`,
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(elementClone),
            }}
            className="pointer-events-none"
            style={{ width: position.width, height: position.height }}
          ></div>

          <div className="absolute w-[25rem] top-[125%] flex justify-center p-4 gap-4 bg-white">
            <p className="absolute -top-2 h-4 w-4 bg-white rotate-45"></p>
            <i
              onClick={onClose}
              className="absolute right-2 top-2 p-1 bg-white text-gray-300 cursor-pointer hover:text-gray-400"
            >
              <X size={24} />
            </i>
            <div className="w-full flex flex-col gap-6">
              <p className="text-center">{step.description}</p>
              <div className="flex gap-4">
                <button
                  onClick={onPrevious}
                  disabled={currentStep === 0}
                  className={`flex-1 px-4 py-2 bg-gray-200 select-none ${
                    currentStep === 0 ? 'opacity-50' : 'cursor-pointer'
                  }`}
                >
                  Précédent
                </button>
                <button
                  onClick={onNext}
                  className="flex-1 bg-[var(--primary-color)] text-white px-4 py-2 select-none cursor-pointer"
                >
                  {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
