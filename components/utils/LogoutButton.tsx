'use client';

import React from 'react';

import { LogOut } from 'lucide-react';
import { logoutService } from '@/services/auth.service';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function LogoutButton() {
  const { showMenu } = useSelector((state: RootState) => state.persistInfos);

  const handleLogout = async () => {
    await logoutService();
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-[var(--text-secondary-gray)] hover:text-red-500 hover:bg-red-500/25 transition-all duration-150 group cursor-pointer select-none"
    >
      <LogOut className="w-5 h-5" />
      {showMenu && (
        <span className="font-medium overflow-hidden whitespace-nowrap">
          Déconnexion
        </span>
      )}
    </button>
  );
}
