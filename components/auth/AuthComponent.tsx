'use client';

import React from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

import { Card } from '@/components/ui/card';
import { UserInterface } from '@/interfaces/user.interface';

export default function AuthComponent({
  role,
  show,
  empty,
}: {
  role: UserInterface['role'];
  show: string;
  empty: boolean;
}) {
  const [isRegister, setIsRegister] = React.useState(show === 'register');

  return (
    <div className="w-[400px] p-1">
      <div className="w-full justify-center items-center rounded-lg">
        <Card className="w-full px-4 bg-[var(--bg-secondary-color)] shadow-none border-none">
          <h1 className="text-4xl text-[var(--u-primary-color)] text-center font-semibold mb-4">
            {isRegister ? 'Inscription' : 'Connexion'}
          </h1>
          {isRegister ? (
            <RegisterForm role={role} setIsRegister={setIsRegister} />
          ) : (
            <LoginForm role={role} />
          )}
        </Card>

        {!empty && (
          <div className="pb-4">
            {isRegister ? (
              <p className="text-[var(--text-primary-color)] text-center">
                A déjà un compte ?{' '}
                <span
                  onClick={() => setIsRegister(false)}
                  className="underline underline-offset-4 cursor-pointer"
                >
                  Se connecter
                </span>
              </p>
            ) : (
              <p className="text-[var(--text-primary-color)] text-center">
                N'a pas encore de compte ?{' '}
                <span
                  onClick={() => setIsRegister(true)}
                  className="underline underline-offset-4 cursor-pointer"
                >
                  S'inscrire
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
