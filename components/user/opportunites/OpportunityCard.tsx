'use client';

import { Building2, ArrowRight, Calendar, Users2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function OpportunityCard({
  company,
  position,
  location,
  status,
  date,
}: {
  company: string;
  position: string;
  location: string;
  status: 'new' | 'discussion';
  date: string;
}) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/opportunites/1');
  };

  return (
    <motion.button
      onClick={handleRedirect}
      className="bg-white rounded-xl p-6 flex flex-col gap-4 shadow-sm group w-full relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      {status === 'new' && (
        <div className="absolute top-3 right-3">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary-color)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--primary-color)]"></span>
          </span>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-[var(--primary-color)]" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 group-hover:text-[var(--primary-color)] transition-colors duration-300">
              {company}
            </h3>
            <p className="text-sm text-gray-500">{position}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Users2 className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span
          className={`text-sm ${
            status === 'new'
              ? 'text-[var(--primary-color)]'
              : 'text-[var(--secondary-color)]'
          }`}
        >
          {status === 'new' ? 'Nouveau rendez-vous' : 'En discussion'}
        </span>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--primary-color)] group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </motion.button>
  );
}
