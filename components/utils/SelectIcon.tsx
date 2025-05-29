'use client';

import React from 'react';

import { Input } from '@/components/ui/input';
import { allIcons } from '@/lib/icons';
import { IconInterface } from '@/interfaces/icon.interface';
import { Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { LucideIcon } from './LucideIcon';

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
    <div className="absolute bottom-[110%] left-0 w-[17.85em] h-[15em] shadow border border-[var(--text-primary-color)]/10 bg-[var(--bg-secondary-color)] p-[0.5em] flex flex-wrap rounded-[0.25em]">
      <div className="w-full h-max flex justify-between items-center border-b-[0.0625em] border-[var(--text-primary-color)]/10 gap-[0.5em] pb-[0.375em]">
        <div className="relative flex items-center">
          <i className="absolute h-[2.5em] w-[2.5em] flex justify-center items-center text-[var(--text-secondary-gray)]">
            <Search size={size * (fontSize / 16)} />
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
            className="!text-[0.875em] !placeholder:text-[0.875em] text-[var(--text-primary-color)] placeholder:text-[var(--text-secondary-gray)] border-[var(--text-primary-color)]/10 ps-[2.5em] pe-[0.75em] py-[0.25em]"
          />
        </div>
        <div className="flex items-center gap-[0.5em]">
          <Input
            type="number"
            onChange={(event) => {
              onChangeSize(Number(event.target.value));
            }}
            value={size}
            placeholder="16"
            className="w-[4.5em] !text-[0.875em] text-[var(--text-primary-color)] placeholder:text-[var(--text-secondary-gray)] px-[0.75em] py-[0.25em] border-[var(--text-primary-color)]/10"
          />
        </div>
      </div>
      <div
        ref={iconsRef}
        className="w-full h-full max-h-[11em] overflow-y-auto [&::-webkit-scrollbar]:w-[0.5em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <div className="flex flex-wrap py-[0.25em] gap-[0.5em]">
          {visibleIcons.map((i) => (
            <i
              key={i}
              onClick={() => onChange(i)}
              className={`h-[2em] w-[2em] min-h-[2em] min-w-[2em] flex justify-center items-center rounded-[0.25em] ${
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
