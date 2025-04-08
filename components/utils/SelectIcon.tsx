'use client';

import React from 'react';

import { Input } from '@/components/ui/input';
import { DynamicIcon } from 'lucide-react/dynamic';
import { allIcons } from '@/lib/icons';
import { IconInterface } from '@/interfaces/icon.interface';
import { Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function SelectIcon({
  icon,
  size,
}: {
  icon: IconInterface;
  size: number;
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
    <div className="absolute bottom-[110%] left-0 w-[17.85em] h-[15em] shadow border bg-white p-[0.5em] flex flex-wrap rounded-[0.25em]">
      <div className="w-full h-max flex justify-between items-center border-b-[0.0625em] gap-[0.5em] pb-[0.375em]">
        <div className="relative flex items-center">
          <i className="absolute left-[0.5em] text-gray-400">
            <Search className="h-[1.25em]" />
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
            className="ps-[2.5em] !text-[1em] !placeholder:text-[1em] px-[0.75em] py-[0.25em]"
          />
        </div>
        <div className="flex items-center gap-[0.5em]">
          {/* <Globe /> */}
          <Input
            type="number"
            onChange={() => {}}
            value={size}
            className="w-[4.5em] !text-[1em] px-[0.75em] py-[0.25em]"
          />
        </div>
      </div>
      <div
        ref={iconsRef}
        className="w-full h-full max-h-[11em] overflow-y-auto &::-webkit-scrollbar]:w-[0.5em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <div className="flex flex-wrap py-[0.25em] gap-[0.5em]">
          {visibleIcons.map((i) => (
            <i
              key={i}
              className={`h-[2em] w-[2em] min-h-[2em] min-w-[2em] flex justify-center items-center rounded-[0.25em] ${
                icon === i
                  ? 'bg-[var(--primary-color)] text-white'
                  : 'text-gray-600 bg-gray-50 hover:bg-[var(--primary-color)] hover:text-white cursor-pointer'
              }`}
            >
              <DynamicIcon name={i} size={size * (fontSize / 16)} />
            </i>
          ))}
        </div>
      </div>
    </div>
  );
}
