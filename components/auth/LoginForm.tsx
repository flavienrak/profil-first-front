'use client';

import React from 'react';
import PrimaryButton from '@/components/utils/button/PrimaryButton';

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
import { loginService } from '@/services/auth.service';
import { UserInterface } from '@/interfaces/user.interface';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  remember: z.boolean().default(false),
  role: z.enum(['user', 'recruiter', 'admin']),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm({ role }: { role: UserInterface['role'] }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showForgot, setShowForgot] = React.useState(false);

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

      if (res.userId) {
        toast.success('Connexion réussie!', {
          description: 'Accès à la plateforme',
        });
        window.location.href = '/cv-minute';
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
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email" className="text-base">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        id="email"
                        {...field}
                        autoComplete="off"
                        className="h-12 ps-16"
                        placeholder="xyz@domain.com"
                        autoFocus
                        required
                      />
                      <i className="absolute left-4 border-r pe-3 text-muted-foreground">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
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
                  <FormLabel htmlFor="password" className="text-base">
                    Mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        autoComplete="off"
                        className="h-12 ps-16"
                        placeholder="*******************"
                        required
                      />
                      <i className="absolute left-4 border-r pe-3 text-muted-foreground">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="16" r="1" />
                          <rect x="3" y="10" width="18" height="12" rx="2" />
                          <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                        </svg>
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
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="remember-me"
                      className="border-muted-foreground/40 data-[state=checked]:bg-[var(--primary-color)] data-[state=checked]:border-[var(--primary-color)] cursor-pointer"
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
          {showForgot && (
            <p className="text-center text-sm text-[var(--primary-color)] hover:underline">
              Mot de passe oublié ?
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}
