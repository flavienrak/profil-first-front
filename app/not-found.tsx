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
      <section className="flex items-center h-full p-8">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-md text-center">
            <h2 className="text-style bg-style">404</h2>
            <p className="text-4xl font-semibold">
              Ooops!, Nous n'avons pas trouvé la page.
            </p>
            <p className="py-6">
              Pour revenir à la page d'accueil, cliquer sur ce bouton.
            </p>
            <div>
              <Link
                href="/"
                className="flex justify-center gap-4 py-4 rounded-xl text-white bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                <span className="font-semibold text-lg">Accueil</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
