import Image from 'next/image';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark py-12">
      <div className="container">
        <div className="flex justify-center mb-8">
          <div>
            <Image
              src="/logo.png"
              alt="Profil First CV Logo"
              height={40}
              width={310}
            />
          </div>
        </div>

        <div className="flex justify-center border-t border-[var(--text-primary-color)]/10 pt-8">
          <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 Profil First CV. Tous droits réservés.
            </p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <a
                href="#"
                className="hover:text-[var(--text-primary-color)] transition-colors"
              >
                Mentions légales
              </a>
              <span>|</span>
              <a
                href="#"
                className="hover:text-[var(--text-primary-color)] transition-colors"
              >
                CGU
              </a>
              <span>|</span>
              <a
                href="#"
                className="hover:text-[var(--text-primary-color)] transition-colors"
              >
                CGV
              </a>
              <span>|</span>
              <a
                href="#"
                className="hover:text-[var(--text-primary-color)] transition-colors"
              >
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
