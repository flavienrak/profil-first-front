'use client';

import React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useParams, useRouter } from 'next/navigation';
import { domains } from '@/lib/constants';
import { updatePersistReducer } from '@/redux/slices/persist.slice';
import { DomainType } from '@/types/Domain.type';

export default function CrossSourcingLayoutv({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showFilter } = useSelector((state: RootState) => state.persistInfos);

  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [domain, setDomain] = React.useState<DomainType>('');

  React.useEffect(() => {
    if (!params.filterId) {
      router.push('/cross-sourcing/all');
    } else {
      let actualDomain: DomainType = 'all';

      const filterId = Number(params.filterId);

      if (!isNaN(filterId)) {
        const foundDomain = domains.find((d) => d.id === filterId);
        actualDomain = foundDomain ?? 'all';
      }

      setDomain(actualDomain);
    }
  }, [params.filterId]);

  React.useEffect(() => {
    if (domain) {
      router.push(
        `/cross-sourcing/${typeof domain === 'string' ? domain : domain.id}`,
      );
    }
  }, [domain]);

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
                    value={typeof domain === 'string' ? domain : domain.label}
                    onValueChange={(value: number | string) =>
                      setDomain(
                        () => domains.find((d) => d.label === value) ?? 'all',
                      )
                    }
                  >
                    <SelectTrigger className="w-full !h-12 p-3 bg-white data-[state=open]:border-[var(--r-primary-color)] data-[state=open]:ring-2 data-[state=open]:ring-[var(--r-primary-color)]/20">
                      <SelectValue placeholder="Choisir le domaine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          value="all"
                          className={`h-8 ${
                            domain === 'all'
                              ? '!text-[var(--r-primary-color)] [&_svg]:!text-[var(--r-primary-color)] !bg-accent'
                              : 'hover:!text-[var(--r-primary-color)] !bg-transparent hover:!bg-accent'
                          }`}
                        >
                          Tous
                        </SelectItem>
                        {domains.map((d) => (
                          <SelectItem
                            key={`domain-${d.id}`}
                            value={d.label}
                            className={`h-8 ${
                              (typeof domain === 'string' &&
                                domain === d.label) ||
                              (typeof domain !== 'string' &&
                                domain.label === d.label)
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

            <div className="flex-1 min-h-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
