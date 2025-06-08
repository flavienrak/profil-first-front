'use client';

import React from 'react';

import { ClipboardList } from 'lucide-react';

export default function MesAbonnementsComponent() {
  return (
    <div className="max-h-screen w-full overflow-y-auto flex justify-center">
      <div className="max-w-7xl h-max flex flex-col gap-12 py-12 px-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Mes abonnements
        </h1>

        <div className="bg-[var(--bg-secondary-color)] rounded-2xl border border-[var(--text-primary-color)]/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-[var(--text-primary-color)]">
              <ClipboardList size={22} />
              <h3 className="text-lg font-semibold">Mes abonnements</h3>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {/* {userSubscription.premiumActive && ( */}
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div>
                  <p className="font-semibold text-purple-800">Premium CV</p>
                  <p className="text-sm text-purple-600">
                    Renouvellement le{' '}
                    {/* {userSubscription.premiumExpiry &&
                            formatDate(userSubscription.premiumExpiry)} */}
                  </p>
                </div>
                <button
                  // onClick={handleCancelPremium}
                  className="text-sm text-red-600 hover:text-red-800 underline cursor-pointer"
                >
                  Annuler
                </button>
              </div>
              {/* )} */}

              {/* {userSubscription.boosterCredits > 0 && ( */}
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                <div>
                  <p className="font-semibold text-orange-800">
                    Crédits Booster
                  </p>
                  <p className="text-sm text-orange-600">
                    {/* {userSubscription.boosterCredits.toLocaleString()}{' '} */}
                    crédits disponibles
                  </p>
                </div>
              </div>
              {/* )} */}

              {/* {userSubscription.qualiCarriereActive && ( */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <p className="font-semibold text-green-800">Quali Carrière</p>
                  <p className="text-sm text-green-600">
                    Expire le{' '}
                    {/* {userSubscription.qualiCarriereExpiry &&
                            formatDate(userSubscription.qualiCarriereExpiry)} */}
                  </p>
                </div>
              </div>
              {/* )} */}
            </div>

            <p className="text-xs text-[var(--text-secondary-gray)] text-center">
              Pour toute question sur tes abonnements, contacte notre support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
