'use client';

import React from 'react';
import Link from 'next/link';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { setUsersReducer } from '@/redux/slices/role/recruiter/cross-sourcing.slice';
import { getUsersService } from '@/services/role/recruiter/cross-sourcing.service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { domains } from '@/lib/constants';
import { updatePersistReducer } from '@/redux/slices/persist.slice';

export default function CrossSourcingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showFilter } = useSelector((state: RootState) => state.persistInfos);
  const { users } = useSelector((state: RootState) => state.crossSourcing);

  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [domain, setDomain] = React.useState('tous');
  const [loadingUsers, setLoadingUsers] = React.useState(true);

  const [actualId, setActualId] = React.useState<number | null>(null);
  const [redirectLoading, setRedirectLoading] = React.useState<number | null>(
    null,
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 13;
  const totalPages = Math.ceil((users.length ?? 1) / itemsPerPage);

  React.useEffect(() => {
    (async () => {
      const res = await getUsersService();

      if (res.users) {
        dispatch(setUsersReducer({ users: res.users }));
      }
      setLoadingUsers(false);
    })();
  }, []);

  React.useEffect(() => {
    if (isNaN(Number(params.id))) {
      router.push('/cross-sourcing');
    } else {
      setActualId(Number(params.id));
    }
  }, [params.id]);

  React.useEffect(() => {
    setRedirectLoading(null);
  }, [pathname]);

  const getCurrentPageItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return users.slice(start, end);
  };

  const getDisplayedPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Si on est en début de pagination et il manque des pages à droite
    while (pages.length < 3 && pages[pages.length - 1] < totalPages) {
      pages.push(pages[pages.length - 1] + 1);
    }

    // Si on est en fin de pagination et il manque des pages à gauche
    while (pages.length < 3 && pages[0] > 1) {
      pages.unshift(pages[0] - 1);
    }

    return pages;
  };

  return (
    <div className="w-full h-full">
      <div className="h-full w-full flex flex-col">
        <div className="w-full px-8 h-20 border-b border-gray-200 bg-white flex items-center">
          <div className="w-full flex items-center justify-between gap-6">
            <button
              onClick={() =>
                dispatch(updatePersistReducer({ showFilter: !showFilter }))
              }
              className="px-4 py-2 text-[var(--r-secondary-color)] font-bold hover:bg-[var(--r-primary-color)]/5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              {showFilter ? 'Masquer' : 'Afficher'} les filtres
            </button>
          </div>
        </div>

        <div className="w-full h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="relative min-h-full w-full flex gap-6 py-8 px-12 bg-[#faf7f5]">
            {showFilter && (
              <div className="w-72 min-w-72 flex flex-col gap-6">
                <label className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--r-primary-color)] text-white font-semibold rounded-md">
                  Filtres
                </label>
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="domain"
                    className="text-sm font-medium text-gray-700"
                  >
                    Domaine
                  </label>

                  <Select
                    value={domain}
                    onValueChange={(value: string) =>
                      setDomain((prev) => (prev === value ? '' : value))
                    }
                  >
                    <SelectTrigger className="w-full !h-12 p-3 bg-white data-[state=open]:border-[var(--r-primary-color)] data-[state=open]:ring-2 data-[state=open]:ring-[var(--r-primary-color)]/20">
                      <SelectValue placeholder="Choisir le domaine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          value="tous"
                          className={`h-8 ${
                            domain === 'tous'
                              ? '!text-[var(--r-primary-color)] [&_svg]:!text-[var(--r-primary-color)] !bg-accent'
                              : 'hover:!text-[var(--r-primary-color)] !bg-transparent hover:!bg-accent'
                          }`}
                        >
                          Tous
                        </SelectItem>
                        {domains.map((d) => (
                          <SelectItem
                            key={`doamin-${d.label}`}
                            value={d.label}
                            className={`h-8 ${
                              domain === d.label
                                ? '!text-[var(--r-primary-color)] [&_svg]:!text-[var(--r-primary-color)] !bg-accent'
                                : 'hover:!text-[var(--r-primary-color)] !bg-transparent hover:!bg-accent'
                            }`}
                          >
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="w-64 min-w-64 bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-medium mb-4">Profils</h2>
              {users.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="w-full flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={`w-8 h-8 flex items-center justify-center text-gray-400 ${
                          currentPage === 1
                            ? 'opacity-50 pointer-events-none'
                            : 'hover:text-[var(--r-primary-color)] transition-colors cursor-pointer'
                        }`}
                        disabled={currentPage === 1}
                      >
                        ←
                      </button>
                      <div className="flex items-center">
                        {getDisplayedPages().map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                              currentPage === pageNum
                                ? 'bg-[var(--r-primary-color)]/20 text-[var(--r-primary-color)] font-medium'
                                : 'text-gray-600 hover:text-[var(--r-primary-color)] cursor-pointer'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1),
                          )
                        }
                        className={`w-8 h-8 flex items-center justify-center text-gray-400 ${
                          currentPage === totalPages
                            ? 'opacity-50 pointer-events-none'
                            : 'hover:text-[var(--r-primary-color)] transition-colors cursor-pointer'
                        }`}
                        disabled={currentPage === totalPages}
                      >
                        →
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {users &&
                      getCurrentPageItems()?.map((c) => (
                        <Link
                          key={`user-${c.id}`}
                          href={`/cross-sourcing/${c.id}`}
                          onClick={() => setRedirectLoading(c.id)}
                          className={`w-full flex items-center gap-2 p-3 text-left rounded-lg transition-colors ${
                            actualId === c.id || redirectLoading === c.id
                              ? 'bg-[var(--r-primary-color)]/20 text-[var(--r-primary-color)] font-medium'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
                          }`}
                        >
                          {redirectLoading === c.id && (
                            <svg
                              aria-hidden="true"
                              role="status"
                              className="inline w-4 h-4 animate-spin"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="#E5E7EB"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentColor"
                              />
                            </svg>
                          )}
                          <span>{c.name}</span>
                        </Link>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-gray-400">
                  Aucun profil disponible
                </p>
              )}
            </div>

            <div className="flex-1 min-h-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
