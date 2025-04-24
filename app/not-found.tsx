import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Not Found',
  description: '404 - Not Found Profil First',
};

export default function NotFound() {
  return (
    <div>
      <section className="min-h-screen min-w-screen flex items-center justify-center">
        <div className="container flex flex-col items-center px-4">
          <div className="max-w-[24rem] text-center">
            <h2 className="text-style bg-clip-text text-white font-bold text-[6rem] sm:text-[12rem] select-none bg-style">
              404
            </h2>
            <p className="text-2xl sm:text-4xl font-semibold">
              Ooops!, Nous n'avons pas trouvé la page.
            </p>
            <p className="py-6">
              Pour revenir à la page d'accueil, cliquer sur ce bouton.
            </p>
            <div>
              <Link
                href="/"
                className="flex justify-center gap-4 py-3 sm:py-4 rounded-lg text-white bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] transition-opacity duration-150 hover:opacity-80"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 sm:h-7 sm:w-7"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                <span className="font-semibold text-base sm:text-lg">
                  Accueil
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
