'use client';

import React from 'react';
import OpportunityCard from './OpportunityCard';

import { MessageSquare, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OpportunitesCompontent() {
  const newOpportunities = [
    {
      company: 'TechCorp Solutions',
      position: 'Développeur Full Stack',
      location: 'Paris',
      status: 'new' as const,
      date: '15 Juin 2025',
    },
    {
      company: 'Digital Innovation Labs',
      position: 'Lead Developer',
      location: 'Lyon',
      status: 'new' as const,
      date: '14 Juin 2025',
    },
    {
      company: 'Future Systems',
      position: 'Senior Frontend Developer',
      location: 'Remote',
      status: 'new' as const,
      date: '13 Juin 2025',
    },
  ];

  const ongoingOpportunities = [
    {
      company: 'Cloud Nine Tech',
      position: 'Backend Developer',
      location: 'Bordeaux',
      status: 'discussion' as const,
      date: '10 Juin 2025',
    },
    {
      company: 'Smart Solutions Inc',
      position: 'DevOps Engineer',
      location: 'Nantes',
      status: 'discussion' as const,
      date: '9 Juin 2025',
    },
    {
      company: 'Web Masters Pro',
      position: 'React Developer',
      location: 'Toulouse',
      status: 'discussion' as const,
      date: '8 Juin 2025',
    },
  ];

  return (
    <div className="min-h-full w-full px-12 py-6">
      <div className="flex flex-col gap-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-[var(--primary-color)]" />
            <h2 className="text-2xl font-bold text-gray-800">
              Mes nouvelles opportunités
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {newOpportunities.map((opportunity, index) => (
              <OpportunityCard
                key={index}
                company={opportunity.company}
                position={opportunity.position}
                location={opportunity.location}
                status={opportunity.status}
                date={opportunity.date}
              />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-[var(--primary-color)]" />
            <h2 className="text-2xl font-bold text-gray-800">
              Mes opportunités en cours
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {ongoingOpportunities.map((opportunity, index) => (
              <OpportunityCard
                key={index}
                company={opportunity.company}
                position={opportunity.position}
                location={opportunity.location}
                status={opportunity.status}
                date={opportunity.date}
              />
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
