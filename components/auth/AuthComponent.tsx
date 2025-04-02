'use client';

import React from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

import { Card } from '@/components/ui/card';
import { UserInterface } from '@/interfaces/user.interface';

export default function AuthComponent({
  role,
}: {
  role: UserInterface['role'];
}) {
  const [isRegister, setIsRegister] = React.useState(false);

  return (
    <div className="w-full bg-white">
      <div className="w-[900px] flex gap-8">
        <div className="flex-1 flex flex-col py-6 px-3">
          {/* <Logo href={'/'} /> */}
          <div className="flex-1 flex justify-center items-center">
            <h2 className="text-4xl font-bold max-w-[32rem] text-center bg-gradient-to-r from-[#4461F2] to-[#6B7FFF] bg-clip-text text-transparent">
              {role === 'user'
                ? 'Vous êtes candidat ?'
                : 'Vous êtes recruteur ?'}
            </h2>
          </div>
        </div>
        <div className="flex-1 flex justify-center p-10 bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] rounded-lg">
          <div className="w-full flex flex-col gap-10 justify-center items-center">
            <Card className="w-full p-8">
              <h1 className="text-4xl text-[var(--primary-color)] text-center font-semibold mb-4">
                {isRegister ? 'Inscription' : 'Connexion'}
              </h1>
              {isRegister ? (
                <RegisterForm role={role} setIsRegister={setIsRegister} />
              ) : (
                <LoginForm role={role} />
              )}
            </Card>
            {isRegister ? (
              <p
                onClick={() => setIsRegister(false)}
                className="text-white text-center"
              >
                A déjà un compte ?{' '}
                <span className="underline underline-offset-4 cursor-pointer">
                  Se connecter
                </span>
              </p>
            ) : (
              <p
                onClick={() => setIsRegister(true)}
                className="text-white text-center"
              >
                N'a pas encore de compte ?{' '}
                <span className="underline underline-offset-4 cursor-pointer">
                  S'inscrire
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
