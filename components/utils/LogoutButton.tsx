'use client';

import React from 'react';

import { LogOut } from 'lucide-react';
import { logoutService } from '@/services/auth.service';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function LogoutButton() {
  const { showMenu } = useSelector((state: RootState) => state.persistInfos);

  const [redirect, setRedirect] = React.useState(false);

  React.useEffect(() => {
    if (redirect) {
      window.location.reload();
    }
  }, [redirect]);

  const handleLogout = async () => {
    const res = await logoutService();

    console.log('res:', res);
    // if (res.loggedOut) {
    //   setRedirect(true);
    // }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 transition-colors duration-200 group cursor-pointer select-none"
    >
      <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
      {showMenu && (
        <span className="font-medium group-hover:text-red-500 transition-all duration-500 overflow-hidden whitespace-nowrap">
          Déconnexion
        </span>
      )}
    </button>
  );
}
