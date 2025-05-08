'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '../../utils/Logo';

import { LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { logoutService } from '@/services/auth.service';
import { useDispatch } from 'react-redux';
import { updatePersistReducer } from '@/redux/slices/persist.slice';
import { recruiterRoutes } from '@/lib/constants';

export default function RecruiterSidebar({ showMenu }: { showMenu: boolean }) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const toggleshowMenu = () => {
    if (showMenu) {
      dispatch(updatePersistReducer({ showMenu: false }));
    } else {
      dispatch(updatePersistReducer({ showMenu: true }));
    }
  };

  const handleLogout = async () => {
    await logoutService();
    window.location.reload();
  };

  return (
    <div
      className={`relative h-screen bg-white border-r border-gray-200 flex flex-col justify-center transition-[width] duration-500 ${
        showMenu ? 'w-64' : 'w-20'
      }`}
    >
      <div className="px-6 h-20 flex items-center border-b border-gray-200">
        <Logo href={'/dashboard'} showText={showMenu} />
      </div>

      <nav className="flex-1 p-4">
        <ul className="flex flex-col gap-2">
          {recruiterRoutes.map((item) => (
            <li
              key={item.name}
              onClick={() => dispatch(updatePersistReducer({ showMenu: true }))}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 h-12 rounded-lg transition-colors duration-200 group select-none ${
                  pathname.startsWith(item.href)
                    ? 'bg-[var(--r-primary-color)] text-white'
                    : 'text-gray-600 hover:bg-[var(--r-primary-color)]/5'
                } ${showMenu ? 'px-4' : 'justify-center px-2'}`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    pathname.startsWith(item.href)
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-[var(--r-primary-color)]'
                  }`}
                />
                {showMenu && (
                  <span className="font-medium transition-all duration-150 overflow-hidden whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 h-20 flex justify-center items-center border-t border-gray-200">
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
      </div>

      <i
        onClick={toggleshowMenu}
        className="z-50 absolute -right-8 h-8 w-8 flex justify-center items-center bg-gray-50 border border-gray-200 rounded-r-sm hover:bg-gray-100 cursor-pointer"
      >
        {showMenu ? <ChevronLeft /> : <ChevronRight />}
      </i>
    </div>
  );
}
