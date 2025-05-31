'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/utils/Logo';
import LogoutButton from '@/components/utils/LogoutButton';

import { ChevronRight, ChevronLeft, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updatePersistReducer } from '@/redux/slices/persist.slice';
import { recruiterRoutes } from '@/lib/constants';
import { RootState } from '@/redux/store';

export default function RecruiterSidebar({ showMenu }: { showMenu: boolean }) {
  const { mode } = useSelector((state: RootState) => state.persistInfos);

  const pathname = usePathname();
  const dispatch = useDispatch();

  const toggleshowMenu = () => {
    if (showMenu) {
      dispatch(updatePersistReducer({ showMenu: false }));
    } else {
      dispatch(updatePersistReducer({ showMenu: true }));
    }
  };

  return (
    <div
      className={`relative h-screen flex flex-col justify-center border-r border-[var(--text-primary-color)]/15 transition-[width] duration-500 ${
        showMenu ? 'w-64' : 'w-20'
      }`}
    >
      <div className="px-6 h-20 flex items-center border-b border-[var(--text-primary-color)]/15">
        <Logo href={'/dashboard'} showText={showMenu} />
      </div>

      <nav className="flex-1 p-4">
        <ul className="flex flex-col gap-2">
          {recruiterRoutes.map((item) => (
            <li
              key={item.name}
              onClick={() => dispatch(updatePersistReducer({ showMenu: true }))}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 h-12 rounded-lg group select-none ${
                  pathname.startsWith(item.href)
                    ? 'bg-[var(--r-primary-color)] text-white'
                    : 'text-[var(--text-secondary-gray)] hover:text-[var(--r-primary-color)] hover:bg-[var(--r-primary-color)]/5'
                } ${showMenu ? 'px-4' : 'justify-center px-2'}`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    pathname.startsWith(item.href)
                      ? 'text-white'
                      : 'text-[var(--text-secondary-gray)] group-hover:text-[var(--r-primary-color)]'
                  }`}
                />
                {showMenu && (
                  <span className="font-medium transition-all duration-150 overflow-hidden whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <div
          onClick={() =>
            dispatch(
              updatePersistReducer({
                mode: mode === 'light' ? 'dark' : 'light',
              }),
            )
          }
          className={`h-12 flex items-center gap-3 text-[var(--r-primary-color)] hover:text-[var(--r-primary-color)] bg-[var(--r-primary-color)]/5 border-[var(--text-primary-color)]/15 cursor-pointer hover:opacity-80 ${
            showMenu ? 'px-8' : 'justify-center px-4'
          }`}
        >
          <i className="w-5 h-5">
            {mode === 'light' ? <Moon size={22} /> : <Sun size={22} />}
          </i>
          {showMenu && (
            <span className="select-none whitespace-nowrap overflow-hidden">
              Mode {mode === 'light' ? 'sombre' : 'clair'}
            </span>
          )}
        </div>
        <div className="px-4 h-20 flex justify-center items-center border-t border-[var(--text-primary-color)]/15">
          <LogoutButton />
        </div>
      </div>

      <i
        onClick={toggleshowMenu}
        className="z-50 absolute -right-8 h-8 w-8 flex justify-center items-center text-[var(--text-primary-color)] bg-[var(--bg-primary-color)] border border-[var(--text-primary-color)]/15 rounded-r-sm hover:opacity-80 cursor-pointer"
      >
        {showMenu ? <ChevronLeft /> : <ChevronRight />}
      </i>
    </div>
  );
}
