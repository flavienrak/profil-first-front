import Link from 'next/link';
import React from 'react';
import Logo from './Logo';
import { Heart, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 right-0 left-64 border-t border-gray-200 bg-[#F9FAFB]">
      <div className="h-20 flex items-center px-16">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Logo href={'/'} />
            <div className="text-xs text-gray-500 flex flex-col">
              <p className="font-medium">© 2025 ProfilFirst</p>
            </div>
            <ul className="flex gap-4 text-xs text-gray-600">
              <li>
                <Link
                  href="#"
                  className="hover:text-gray-900 transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-gray-900 transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-gray-900 transition-colors"
                >
                  CGU
                </Link>
              </li>
            </ul>
            <div className="flex items-center gap-1.5 text-xs">
              <Heart className="w-3.5 h-3.5 text-pink-500" />
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-medium">
                Une histoire en 3 clics
              </span>
            </div>
          </div>

          <Link
            href="#"
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
