'use client';

import React from 'react';
import {
  FileText,
  Clock,
  MessageSquare,
  User,
  LogOut,
  Briefcase,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { logoutService } from '@/services/auth.service';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Quali Carrière CV', icon: FileText, href: '/quali-carriere' },
    { name: 'CV Minute', icon: Clock, href: '/cv-minute' },
    { name: 'CV et Offres', icon: Briefcase, href: '/cv-offres' },
    { name: 'Mes opportunités', icon: Star, href: '/opportunites' },
    { name: 'Ma messagerie', icon: MessageSquare, href: '/messages' },
    { name: 'Mon Compte', icon: User, href: '/compte' },
  ];

  const handleLogout = async () => {
    await logoutService();
    window.location.href = '/';
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 h-20 flex items-center border-b border-gray-200">
        <Logo href={'/cv-minute'} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${
                  pathname === item.href
                    ? 'bg-[#6B2CF5] text-white'
                    : 'text-gray-600 hover:bg-[#6B2CF5]/5'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-[#6B2CF5]'
                  }`}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-4 h-20 flex justify-center items-center border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 transition-colors duration-200 group cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
          <span className="font-medium group-hover:text-red-500">
            Déconnexion
          </span>
        </button>
      </div>
    </div>
  );
}
