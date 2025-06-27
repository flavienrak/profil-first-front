import React from 'react';
import ResetPasswordComponent from '@/components/auth/reset-password/ResetPasswordComponent';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset Password Profile First',
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full">
      <ResetPasswordComponent />
    </div>
  );
}
