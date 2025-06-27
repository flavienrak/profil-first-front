'use client';

import React from 'react';
import PrimaryButton from '@/components/utils/role/user/button/PrimaryButton';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  loginService,
  sendResetPasswordMailService,
} from '@/services/auth.service';
import { UserInterface } from '@/interfaces/user.interface';
import { useRouter } from 'next/navigation';
import { LockKeyhole, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  remember: z.boolean().default(false),
  role: z.enum(['candidat', 'recruiter', 'admin']),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm({ role }: { role: UserInterface['role'] }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const [showForgot, setShowForgot] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
      role,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const parseRes = loginSchema.safeParse(data);

    if (parseRes.success) {
      // API CALL
      setIsLoading(true);
      const res = await loginService({
        email: parseRes.data.email,
        password: parseRes.data.password,
        remember: parseRes.data.remember,
        role: parseRes.data.role,
      });

      if (res.notVerified) {
        toast.warning('Adresse e-mail non vérifiée', {
          description: 'Validation en attente.',
        });
        router.push(`/auth/mail-validation/${res.token}`);
      } else if (res.userNotFound) {
        form.setError('email', {
          type: 'manual',
          message: 'Adresse email inconnu',
        });
        setIsLoading(false);
      } else if (res.incorrectPassword) {
        form.setError('password', {
          type: 'manual',
          message: 'Mot de passe incorrect',
        });
        setShowForgot(true);
        setIsLoading(false);
      } else if (res.user) {
        toast.success('Connexion réussie!', {
          description: 'Accès à la plateforme',
        });

        if (res.user.role === 'candidat') {
          window.location.href = '/cv-minute';
        } else {
          window.location.href = '/cross-sourcing';
        }
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleResetPassword = async () => {
    const email = form.getValues('email');

    if (email) {
      setResetLoading(true);
      const res = await sendResetPasswordMailService(email);

      if (res.sent) {
        toast.success('Réinitialisation de mot de passe initiée', {
          description: 'Consultez votre boîte mail',
        });
      }

      form.reset();
      setResetLoading(false);
      setShowForgot(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="email"
                      className="text-base text-[var(--text-primary-color)]"
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          id="email"
                          {...field}
                          autoComplete="off"
                          className="h-12 ps-16 text-[var(--text-primary-color)] border-[var(--text-primary-color)]/25 placeholder:text-[var(--text-tertiary-gray)]"
                          placeholder="xyz@domain.com"
                          autoFocus
                          required
                        />
                        <i className="absolute left-4 border-r pe-3 text-[var(--text-primary-color)]">
                          <Mail size={20} strokeWidth={1} />
                        </i>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs">
                      {form.formState.errors.email?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="password"
                      className="text-base text-[var(--text-primary-color)]"
                    >
                      Mot de passe
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          autoComplete="off"
                          className="h-12 ps-16 text-[var(--text-primary-color)] border-[var(--text-primary-color)]/25 placeholder:text-[var(--text-tertiary-gray)]"
                          placeholder="*******************"
                          required
                        />
                        <i className="absolute left-4 border-r pe-3 text-[var(--text-primary-color)]">
                          <LockKeyhole size={20} strokeWidth={1} />
                        </i>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs">
                      {form.formState.errors.password?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                name="remember"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 text-[var(--text-primary-color)]">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="remember-me"
                        className="border-[var(--text-primary-color)]/50 data-[state=checked]:bg-[var(--u-primary-color)] data-[state=checked]:border-[var(--u-primary-color)] cursor-pointer"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="remember-me"
                      className="font-normal text-sm"
                    >
                      Se souvenir de moi
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <PrimaryButton
              label="Se connecter"
              type="submit"
              className="h-12 rounded-lg text-base"
              isLoading={isLoading}
            />
          </div>
        </form>
      </Form>

      {showForgot && (
        <div className="flex justify-center">
          <button
            onClick={handleResetPassword}
            disabled={resetLoading}
            className={`flex items-center gap-2 text-center text-sm text-[var(--u-primary-color)] ${
              resetLoading
                ? 'opacity-80 pointer-events-none'
                : 'hover:underline cursor-pointer'
            }`}
          >
            {resetLoading && (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            )}
            <span>Mot de passe oublié ?</span>
          </button>
        </div>
      )}
    </div>
  );
}
