'use client';

import React from 'react';
import Link from 'next/link';

import { setUsersReducer } from '@/redux/slices/role/recruiter/cross-sourcing.slice';
import { getUsersService } from '@/services/role/recruiter/cross-sourcing.service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { domains } from '@/lib/constants';
import { DomainType } from '@/types/domain.type';

export default function CrossSourcingFilterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { users } = useSelector((state: RootState) => state.crossSourcing);

  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [domain, setDomain] = React.useState<DomainType>(() => {
    const filterId = Number(params.filterId);
    if (!isNaN(filterId)) {
      const foundDomain = domains.find((d) => d.id === filterId);
      return foundDomain ?? 'all';
    }
    return 'all';
  });

  const [loadingUsers, setLoadingUsers] = React.useState(true);
  const [actualId, setActualId] = React.useState<number | null>(null);
  const [redirectLoading, setRedirectLoading] = React.useState<number | null>(
    null,
  );

  const [currentPage, setCurrentPage] = React.useState(1);

  const itemsPerPage = 13;
  const totalPages = Math.ceil((users.length ?? 1) / itemsPerPage);

  React.useEffect(() => {
    if (isNaN(Number(params.userId))) {
      router.push(`/cross-sourcing/${params.filterId}`);
    } else {
      setActualId(Number(params.userId));
    }
  }, [params.userId]);

  React.useEffect(() => {
    let isMounted = true;

    if (domain) {
      (async () => {
        const res = await getUsersService(
          typeof domain === 'string' ? domain : domain.id,
        );

        if (isMounted) {
          if (res.users) {
            dispatch(setUsersReducer({ users: res.users }));
          } else {
            setDomain('all');
          }
          setLoadingUsers(false);
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, [domain]);

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
    <div className="h-full w-full flex gap-6">
      <div className="w-64 min-w-64 flex flex-col gap-4 bg-[var(--bg-secondary-color)] rounded-lg shadow-sm p-4">
        <h2 className="font-medium text-xl text-[var(--text-primary-color)]">
          Profils
        </h2>
        {users.length > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="w-full flex items-center justify-center gap-3">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  className={`w-8 h-8 flex items-center justify-center text-[var(--text-primary-color)] ${
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
                          : 'text-[var(--text-secondary-gray)] hover:text-[var(--r-primary-color)] cursor-pointer'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className={`w-8 h-8 flex items-center justify-center text-[var(--text-primary-color)] ${
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
              {users.length > 0 &&
                getCurrentPageItems().map((c) => (
                  <Link
                    key={`user-${c.id}`}
                    href={`/cross-sourcing/${params.filterId}/user/${c.id}`}
                    onClick={() => setRedirectLoading(c.id)}
                    className={`w-full flex items-center gap-2 p-3 text-left rounded-lg transition-colors ${
                      actualId === c.id || redirectLoading === c.id
                        ? 'bg-[var(--r-primary-color)]/20 text-[var(--r-primary-color)] font-medium'
                        : 'bg-[var(--bg-primary-color)] text-[var(--text-primary-color)] hover:text-[var(--r-primary-color)] cursor-pointer'
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
          <p className="text-sm italic text-[var(--text-secondary-gray)]">
            Aucun profil disponible
          </p>
        )}
      </div>

      <div className="flex-1 min-h-full">{children}</div>
    </div>
  );
}
