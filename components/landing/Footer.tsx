import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const links = [
  { label: 'Mentions légales', href: '/conditions' },
  { label: 'CGU', href: '/conditions' },
  { label: 'CGV', href: '/conditions' },
  { label: 'Politique de confidentialité', href: '/conditions' },
];

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
              width={300}
            />
          </div>
        </div>

        <div className="flex justify-center border-t border-[var(--text-primary-color)]/10 pt-8">
          <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 Profil First CV. Tous droits réservés.
            </p>
            <div className="flex space-x-4 text-sm text-gray-500">
              {links.map((item, index) => (
                <div key={`link-${index}`} className="flex items-center gap-2">
                  <Link
                    href={item.href}
                    className="hover:text-[var(--text-primary-color)] transition-colors"
                  >
                    {item.label}
                  </Link>
                  {index < links.length - 1 && <span>|</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
