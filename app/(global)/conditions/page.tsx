import React from 'react';
import ConditionsComponent from '@/components/conditions/ConditionsComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions',
  description: 'Conditions Profile First',
};

export default function ConditionsPage() {
  return (
    <div className="w-full h-full [background-image:var(--bg-primary)]">
      <ConditionsComponent />
    </div>
  );
}
