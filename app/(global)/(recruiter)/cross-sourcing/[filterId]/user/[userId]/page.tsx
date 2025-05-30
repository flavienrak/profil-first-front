import React from 'react';

export default function CrossSourcingUserPage() {
  return (
    <div className="h-full w-full flex flex-col bg-[var(--bg-secondary-color)] rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--r-primary-color)] to-[#22D3EE] bg-clip-text text-transparent">
            Sélectionnez un CV
          </h2>
        </div>
      </div>
      <div className="relative flex-1 bg-[var(--bg-primary-color)] rounded-lg overflow-auto">
        <div className="flex items-center justify-center h-full text-[var(--text-secondary-gray)]">
          Sélectionnez un CV
        </div>
      </div>
    </div>
  );
}
