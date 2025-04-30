'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Application {
  position: string;
  period: string;
  candidate: string;
  rdvStatus: 'En attente' | 'Accepté';
  status: 'Accepté' | 'En attente';
  rdvDate: string;
  hasCV: boolean;
}
export default function DashboardComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);

  const itemsPerPage = 10;
  const totalItems = 30; // 3 pages of 10 items
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Define the possible RDV dates
  const possibleRdvDates = [
    'Jeudi 24 Avril 17h15',
    'Mardi 23 Avril 14h30',
    'Mercredi 24 Avril 11h00',
    'Vendredi 26 Avril 16h45',
  ];

  // Applications array declaration moved before its usage
  const applications: Application[] = [
    {
      position: 'Développeur Full Stack',
      period: 'Avril 2025',
      candidate: 'Profil First 127',
      rdvStatus: 'En attente',
      status: 'Accepté',
      rdvDate: '',
      hasCV: true,
    },
    // ...Array(29)
    //   .fill(0)
    //   .map((_, i) => ({
    //     position: [
    //       'Développeur Full Stack',
    //       'Chef de projet IT',
    //       'DevOps Engineer',
    //     ][i % 3],
    //     period: ['Avril 2025', 'Mars 2025', 'Mai 2025'][i % 3],
    //     candidate:
    //       i % 2 === 0
    //         ? `Profil First ${i + 128}`
    //         : [
    //             'Thomas DUPONT',
    //             'Marie LAURENT',
    //             'Lucas MARTIN',
    //             'Emma BERNARD',
    //             'Hugo PETIT',
    //             'Sarah MOREAU',
    //             'Jules DUBOIS',
    //             'Léa ROBERT',
    //             'Nathan MICHEL',
    //             'Camille LEROY',
    //             'Louis GIRARD',
    //             'Chloé ROUX',
    //             'Paul SIMON',
    //             'Alice LEFEBVRE',
    //             'Antoine GARCIA',
    //           ][i % 15],
    //     rdvStatus: i % 2 === 0 ? 'En attente' : 'Accepté',
    //     status: i % 3 === 0 ? 'En attente' : 'Accepté',
    //     rdvDate:
    //       i % 2 === 0
    //         ? ''
    //         : Math.random() > 0.5
    //         ? possibleRdvDates[
    //             Math.floor(Math.random() * possibleRdvDates.length)
    //           ]
    //         : 'Process terminé',
    //     hasCV: true,
    //   })),
  ];

  const getCurrentPageItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return (
      filteredApplications.length > 0 ? filteredApplications : applications
    ).slice(start, end);
  };

  React.useEffect(() => {
    const handleSidebarStateChange = (e: CustomEvent) => {};

    window.addEventListener(
      'sidebarStateChange',
      handleSidebarStateChange as EventListener,
    );
    return () => {
      window.removeEventListener(
        'sidebarStateChange',
        handleSidebarStateChange as EventListener,
      );
    };
  }, []);

  return (
    <div className="flex flex-col gap-8 py-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] bg-clip-text text-transparent">
        Tableau de bord recruteur
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <h3 className="text-sm text-gray-600 mb-3">Candidatures totales</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] bg-clip-text text-transparent">
            248
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <h3 className="text-sm text-gray-600 mb-3">En attente</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
            45
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <h3 className="text-sm text-gray-600 mb-3">Acceptées</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
            156
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <h3 className="text-sm text-gray-600 mb-3">Refusées</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
            47
          </p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] bg-clip-text text-transparent">
                Candidatures
              </h2>
              <p className="text-sm text-gray-500">
                Affichage {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalItems)} sur{' '}
                {totalItems} résultats
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-[#06B6D4] disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                        currentPage === page
                          ? 'bg-[#06B6D4] text-white'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-[#06B6D4] disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-300 shadow-sm ${
                  filteredApplications.length > 0
                    ? 'bg-[#06B6D4] text-white hover:bg-[#22D3EE]'
                    : 'bg-white border-gray-200 hover:border-[#06B6D4] hover:text-[#06B6D4]'
                }`}
              >
                <Filter className="w-4 h-4" />
                {filteredApplications.length > 0 ? 'Filtres actifs' : 'Filtrer'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#06B6D4] hover:text-[#06B6D4] transition-all duration-300 shadow-sm">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-white uppercase border-r border-gray-700 last:border-r-0">
                  Offres
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-white uppercase border-r border-gray-700 last:border-r-0">
                  Contacter en
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-white uppercase border-r border-gray-700 last:border-r-0">
                  Candidat
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-white uppercase border-r border-gray-700 last:border-r-0">
                  Statut RDV
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-white uppercase border-r border-gray-700 last:border-r-0">
                  Statut Message
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-white uppercase border-r border-gray-700 last:border-r-0">
                  Date de RDV
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-white uppercase">
                  CV
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getCurrentPageItems().map((app, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    !app.candidate.startsWith('Profil First')
                      ? 'bg-green-50/50'
                      : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-100">
                    {app.position}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-100">
                    {app.period}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-100">
                    {app.candidate.startsWith('Profil First') ? '🔒 ' : ''}
                    {app.candidate}
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                        app.rdvStatus === 'En attente'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {app.rdvStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-100">
                    {app.rdvStatus === 'En attente' ? (
                      '-'
                    ) : app.status === 'En attente' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] text-white">
                        ✉️ Nouveau message
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm bg-green-100 text-green-800">
                        ✅ tout est ok
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#06B6D4] hover:text-[#22D3EE] cursor-pointer transition-colors border-r border-gray-100">
                    {app.rdvDate}
                  </td>
                  <td className="px-6 py-4">
                    {app.hasCV && (
                      <FileText className="w-5 h-5 text-gray-400 hover:text-[#06B6D4] cursor-pointer transition-colors" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
