'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

import {
  FileText,
  Clock,
  MessageSquare,
  User,
  LogOut,
  Briefcase,
  Star,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { logoutService } from '@/services/auth.service';
import { useDispatch } from 'react-redux';
import { updatePersistReducer } from '@/redux/slices/persist.slice';

export default function Sidebar({ showMenu }: { showMenu: boolean }) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const menuItems = [
    { name: 'Quali Carrière CV', icon: FileText, href: '/quali-carriere' },
    { name: 'CV Minute', icon: Clock, href: '/cv-minute' },
    { name: 'CV et Offres', icon: Briefcase, href: '/cv-offres' },
    { name: 'Mes opportunités', icon: Star, href: '/opportunites' },
    { name: 'Ma messagerie', icon: MessageSquare, href: '/messages' },
    { name: 'Mon Compte', icon: User, href: '/compte' },
  ];

  const toggleshowMenu = () => {
    if (showMenu) {
      dispatch(updatePersistReducer({ showMenu: false }));
    } else {
      dispatch(updatePersistReducer({ showMenu: true }));
    }
  };

  const handleLogout = async () => {
    await logoutService();
    window.location.href = '/';
  };

  return (
    <div
      className={`relative h-screen bg-white border-r border-gray-200 flex flex-col justify-center transition-[width] duration-500 ${
        showMenu ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="px-6 h-20 flex items-center border-b border-gray-200">
        <Logo href={'/cv-minute'} showText={showMenu} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 h-12 rounded-lg transition-colors duration-200 group select-none ${
                  pathname === item.href
                    ? 'bg-[#6B2CF5] text-white'
                    : 'text-gray-600 hover:bg-[#6B2CF5]/5'
                } ${showMenu ? 'px-4' : 'justify-center px-2'}`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-[#6B2CF5]'
                  }`}
                />
                {showMenu && (
                  <span
                    className={`font-medium transition-all duration-500 overflow-hidden inline-block whitespace-nowrap ${
                      showMenu ? 'max-w-auto opacity-100' : 'max-w-0 opacity-0'
                    }`}
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-4 h-20 flex justify-center items-center border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 transition-colors duration-200 group cursor-pointer select-none"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
          {showMenu && (
            <span
              className={`font-medium group-hover:text-red-500 transition-all duration-500 overflow-hidden inline-block whitespace-nowrap ${
                showMenu ? 'max-w-auto opacity-100' : 'max-w-0 opacity-0'
              }`}
            >
              Déconnexion
            </span>
          )}
        </button>
      </div>

      <i
        onClick={toggleshowMenu}
        className="z-50 absolute -right-8 h-8 w-8 flex justify-center items-center bg-gray-50 border rounded-r-sm hover:bg-gray-100 cursor-pointer"
      >
        {showMenu ? <ChevronLeft /> : <ChevronRight />}
      </i>
    </div>
  );
}
