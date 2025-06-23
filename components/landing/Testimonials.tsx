import React from 'react';
import Image from 'next/image';
import MovingDots from './MovingDots';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/data/content';

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const testimonialsPerPage = 3;
  const maxIndex = Math.ceil(testimonials.length / testimonialsPerPage) - 1;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === maxIndex ? 0 : prevIndex + 1,
      );
    }, 7000);

    return () => clearInterval(timer);
  }, [maxIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? maxIndex : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === maxIndex ? 0 : prevIndex + 1,
    );
  };

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex * testimonialsPerPage,
    (currentIndex + 1) * testimonialsPerPage,
  );

  return (
    <section
      id="testimonials"
      className="relative flex justify-center py-24 overflow-hidden"
    >
      <MovingDots />
      <div className="max-w-7xl container relative z-10 flex flex-col gap-24">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-[var(--text-primary-color)]">
          Ce qu’ils diraient si on leur demandait
        </h2>

        <div className="relative">
          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {visibleTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="bg-[var(--bg-secondary-color)] rounded-xl p-6 pt-16 shadow-sm relative mt-12"
                variants={itemVariants}
              >
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center border-4 border-[var(--bg-secondary-color)] shadow-lg">
                    <Image
                      src={`/users/${testimonial.src}`}
                      alt={testimonial.author}
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col h-full text-center">
                  <h3 className="text-xl font-semibold mb-1 text-[var(--text-primary-color)]">
                    {testimonial.author}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary-gray)] mb-4">
                    {testimonial.role}
                  </p>
                  <p className="text-[var(--text-primary-color)] flex-grow italic">
                    {testimonial.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center items-center mt-12 space-x-4">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full text-[var(--text-primary-color)] bg-[var(--bg-secondary-color)] shadow-md cursor-pointer hover:text-[var(--u-primary-color)]"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-[var(--u-primary-color)]'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-2 rounded-full text-[var(--text-primary-color)] bg-[var(--bg-secondary-color)] shadow-md cursor-pointer hover:text-[var(--u-primary-color)]"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
