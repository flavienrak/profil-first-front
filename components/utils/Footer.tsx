'use client';

import Link from 'next/link';
import React from 'react';
import Logo from './Logo';

import { Airplay, Heart, Linkedin } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updatePersistReducer } from '@/redux/slices/persist.slice';

const links = [
  { label: 'Mentions légales', href: '/conditions' },
  { label: 'CGU', href: '/conditions' },
  { label: 'CGV', href: '/conditions' },
  { label: 'Politique de confidentialité', href: '/conditions' },
];

export default function Footer() {
  const dispatch = useDispatch();
  const { showFooter } = useSelector((state: RootState) => state.persistInfos);

  const toggleShowFooter = () => {
    if (showFooter) {
      dispatch(updatePersistReducer({ showFooter: false }));
    } else {
      dispatch(updatePersistReducer({ showFooter: true }));
    }
  };

  return (
    <footer
      className={`relative flex justify-center bg-[var(--bg-secondary-color)] border-t border border-[var(--text-primary-color)]/15 transition-[height] duration-500 ${
        showFooter ? 'h-20' : 'h-0'
      }`}
    >
      <div className={'w-full flex items-center px-16'}>
        {showFooter && (
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Logo href={'/'} />
              <div className="text-xs text-[var(--text-secondary-gray)] flex flex-col">
                <p className="font-medium">© 2025 ProfilFirst</p>
              </div>
              <ul className="flex gap-4 text-xs text-[var(--text-primary-gray)]">
                {links.map((item, index) => (
                  <div
                    key={`link-${index}`}
                    className="flex items-center gap-2"
                  >
                    <Link
                      href={item.href}
                      className="hover:text-[var(--text-primary-color)] transition-colors"
                    >
                      {item.label}
                    </Link>
                    {index < links.length - 1 && <span>|</span>}
                  </div>
                ))}
              </ul>
              <div className="flex items-center gap-1.5 text-xs">
                <Heart className="w-3.5 h-3.5 text-pink-500" />
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-medium">
                  Une histoire en 3 clics
                </span>
              </div>
            </div>

            <Link
              href="#"
              className="flex items-center gap-1.5 text-xs text-[var(--text-primary-gray)] hover:text-[var(--text-primary-color)] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </Link>
          </div>
        )}
      </div>

      <i
        onClick={toggleShowFooter}
        className="z-50 absolute right-0 -top-8 h-8 w-8 flex justify-center items-center bg-[var(--bg-secondary-color)] text-[var(--text-primary-color)] border border-[var(--text-primary-color)]/15 rounded-t-sm hover:text-[var(--u-primary-color)] cursor-pointer"
      >
        <Airplay />
      </i>
    </footer>
  );
}
