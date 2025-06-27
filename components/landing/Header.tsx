'use client';

import React from 'react';
import Image from 'next/image';
import Button from './Button';

import { Menu, Moon, Sun, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updatePersistReducer } from '@/redux/slices/persist.slice';
import { UserInterface } from '@/interfaces/user.interface';

export default function Header({
  handleShowAuth,
}: {
  handleShowAuth: (
    value: UserInterface['role'],
    show: string,
    empty: boolean,
  ) => void;
}) {
  const { mode } = useSelector((state: RootState) => state.persistInfos);

  const dispatch = useDispatch();

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 z-50 flex justify-center bg-[var(--bg-secondary-color)] shadow-md">
      <div className="max-w-7xl container flex items-center">
        <a href="#" className="flex items-center">
          <Image src="/logo.png" alt="Profile First" height={40} width={300} />
        </a>

        <div className="flex-1 flex justify-center">
          <Button
            onClick={() => handleShowAuth('candidat', 'login', false)}
            variant="secondary"
            size="sm"
            className="!bg-[#03E3F8] border border-[#03E3F8]/70 hover:opacity-90 shadow-[0_2px_4px_rgba(0,0,0,0.2)] cursor-pointer"
          >
            Se connecter
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#advantages"
            className="text-[var(--text-primary-color)] hover:text-primary-600 transition-colors duration-300"
          >
            Avantages
          </a>
          <a
            href="#testimonials"
            className="text-[var(--text-primary-color)] hover:text-primary-600 transition-colors duration-300"
          >
            Témoignages
          </a>
          <a
            href="#faq"
            className="text-[var(--text-primary-color)] hover:text-primary-600 transition-colors duration-300"
          >
            FAQ
          </a>
          <Button
            onClick={() => handleShowAuth('candidat', 'register', true)}
            variant="primary"
            size="sm"
            className="cursor-pointer"
          >
            Je démarre
          </Button>
          <div
            onClick={() =>
              dispatch(
                updatePersistReducer({
                  mode: mode === 'light' ? 'dark' : 'light',
                }),
              )
            }
            className="flex justify-center items-center p-2 rounded-full bg-[var(--u-secondary-color)]/10 cursor-pointer hover:bg-[var(--u-secondary-color)]/15"
          >
            {mode === 'light' ? (
              <Moon size={22} className="text-[var(--u-secondary-color)]" />
            ) : (
              <Sun size={22} className="text-[var(--u-secondary-color)]" />
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X size={24} className="text-gray-700" />
          ) : (
            <Menu size={24} className="text-gray-700" />
          )}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg py-4 md:hidden">
            <div className="container flex flex-col space-y-4">
              <a
                href="#advantages"
                className="text-gray-700 hover:text-primary-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Avantages
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-primary-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Témoignages
              </a>
              <a
                href="#faq"
                className="text-gray-700 hover:text-primary-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <Button
                href="#start"
                variant="primary"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                Je démarre
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
