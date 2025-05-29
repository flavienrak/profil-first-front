import React from 'react';

export default function CrossSourcingUserPage() {
  return (
    <div className="h-full w-full flex flex-col bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--r-primary-color)] to-[#22D3EE] bg-clip-text text-transparent">
            Sélectionnez un CV
          </h2>
        </div>
      </div>
      <div className="relative flex-1 bg-gray-50 rounded-lg overflow-auto">
        <div className="flex items-center justify-center h-full text-gray-400">
          Sélectionnez un CV
        </div>
      </div>
    </div>
  );
}
