'use client';

import React from 'react';
import LucideIcon from '@/components/utils/LucideIcon';

import { Input } from '@/components/ui/input';
import { allIcons } from '@/lib/icons';
import { IconInterface } from '@/interfaces/icon.interface';
import { Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function SelectIcon({
  icon,
  size,
  onChange,
  onChangeSize,
}: {
  icon: IconInterface;
  size: number;
  onChange: (value: IconInterface) => void;
  onChangeSize: (value: number) => void;
}) {
  const { fontSize } = useSelector((state: RootState) => state.persistInfos);
  const [visibleIcons, setVisibleIcons] = React.useState<IconInterface[]>([]);
  const [page, setPage] = React.useState(1);
  const [filter, setFilter] = React.useState('');
  const [debouncedFilter, setDebouncedFilter] = React.useState('');

  const iconsRef = React.useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 60;

  const loadIcons = () => {
    const newIcons = allIcons.slice(0, page * itemsPerPage);
    setVisibleIcons(newIcons);
  };

  const handleScroll = (container: HTMLDivElement) => {
    const isPastHalf =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight / 2;

    if (isPastHalf) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (filter.length >= 3) {
        setDebouncedFilter(filter);
      } else {
        setDebouncedFilter('');
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [filter]);

  React.useEffect(() => {
    if (debouncedFilter) {
      setVisibleIcons(allIcons.filter((i) => i.includes(debouncedFilter)));
    } else {
      setVisibleIcons(allIcons.slice(0, 60));
    }
  }, [debouncedFilter]);

  React.useEffect(() => {
    loadIcons();
  }, [page]);

  React.useEffect(() => {
    const container = iconsRef.current;
    if (!container) return;

    const onScroll = () => handleScroll(container);

    container.addEventListener('scroll', onScroll);
    return () => {
      container.removeEventListener('scroll', onScroll);
    };
  }, [iconsRef]);

  return (
    <div className="absolute bottom-[110%] left-0 w-80 h-56 shadow border border-[var(--text-primary-color)]/10 bg-[var(--bg-secondary-color)] p-2 flex flex-wrap rounded-md">
      <div className="w-full h-max flex justify-between items-center border-b border-[var(--text-primary-color)]/10 gap-2 pb-2">
        <div className="relative flex-1 flex items-center">
          <i className="absolute h-8 w-8 flex justify-center items-center text-[var(--text-secondary-gray)]">
            <Search size={16} />
          </i>
          <Input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            }}
            type="search"
            placeholder="Rechercher..."
            className="!text-sm !placeholder:text-sm text-[var(--text-primary-color)] placeholder:text-[var(--text-secondary-gray)] border-[var(--text-primary-color)]/10 ps-8 pe-3 py-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            onChange={(event) => {
              onChangeSize(Number(event.target.value));
            }}
            value={size}
            placeholder="16"
            className="w-16 !text-sm text-[var(--text-primary-color)] placeholder:text-[var(--text-secondary-gray)] px-2 py-1 border-[var(--text-primary-color)]/10"
          />
        </div>
      </div>
      <div
        ref={iconsRef}
        className="w-full h-full max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <div className="flex flex-wrap py-1 gap-2">
          {visibleIcons.map((i) => (
            <i
              key={i}
              onClick={() => onChange(i)}
              className={`h-8 w-8 min-h-8 min-w-8 flex justify-center items-center rounded-md ${
                icon === i
                  ? 'bg-[var(--u-primary-color)] text-white'
                  : 'text-[var(--text-primary-color)] bg-[var(--bg-primary-color)] hover:bg-[var(--u-primary-color)] hover:text-white cursor-pointer'
              }`}
            >
              <LucideIcon name={i} size={size * (fontSize / 16)} />
            </i>
          ))}
        </div>
      </div>
    </div>
  );
}
