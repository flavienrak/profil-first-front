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
      <div className="w-full flex flex-col gap-6 justify-center items-center rounded-lg">
        <Card className="w-full p-4 bg-[var(--bg-secondary-color)] shadow-none border-none">
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
          <>
            {isRegister ? (
              <p
                onClick={() => setIsRegister(false)}
                className="text-[var(--text-primary-color)] text-center"
              >
                A déjà un compte ?{' '}
                <span className="underline underline-offset-4 cursor-pointer">
                  Se connecter
                </span>
              </p>
            ) : (
              <p
                onClick={() => setIsRegister(true)}
                className="text-[var(--text-primary-color)] text-center"
              >
                N'a pas encore de compte ?{' '}
                <span className="underline underline-offset-4 cursor-pointer">
                  S'inscrire
                </span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
