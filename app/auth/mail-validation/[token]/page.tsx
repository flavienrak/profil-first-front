import React from 'react';
import MailValidationComponent from '@/components/auth/mail-validation/MailValidationComponent';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mail Validation',
  description: 'Mail Validation Profile First',
};

export default function MailValidationPage() {
  return (
    <div className="w-full">
      <MailValidationComponent />
    </div>
  );
}
