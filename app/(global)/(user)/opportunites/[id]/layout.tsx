'use client';

import React from 'react';

export default function OpportuniteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full flex justify-center overflow-y-auto">
      <div className="max-w-7xl w-full h-full">{children}</div>
    </div>
  );
}
