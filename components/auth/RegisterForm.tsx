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
import { registerService } from '@/services/auth.service';
import { toast } from 'sonner';
import { UserInterface } from '@/interfaces/user.interface';
import { useRouter } from 'next/navigation';
import { LockKeyhole, Mail, UserRound } from 'lucide-react';

export default function RegisterForm({
  role,
  setIsRegister,
}: {
  role: UserInterface['role'];
  setIsRegister: (value: boolean) => void;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const registerSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, 'Nom requis')
      .min(3, 'Nom au moins 3 caractères'),
    email: z.string().trim().min(1, 'Email requis').email('Email invalide'),
    password: z
      .string()
      .min(1, 'Mot de passe requis')
      .min(6, 'Mot de passe au moins 6 caractères'),
    role: z.string(),
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const parseRes = registerSchema.safeParse(data);

    if (parseRes.success) {
      // API CALL
      setIsLoading(true);
      const res = await registerService({
        name: parseRes.data.name,
        email: parseRes.data.email,
        password: parseRes.data.password,
        role: parseRes.data.role,
      });

      if (res.token) {
        toast.success('Inscription réussie !', {
          description: "Validation de l'email en attente.",
        });
        router.push(`/auth/mail-validation/${res.token}`);
      } else if (res.userAlreadyExist) {
        form.setError('email', {
          type: 'manual',
          message: 'Adresse email déjà enregistré',
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="name"
                    className="text-base text-[var(--text-primary-color)]"
                  >
                    Nom
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        id="name"
                        {...field}
                        autoComplete="off"
                        className="h-12 ps-16 text-[var(--text-primary-color)] border-[var(--text-primary-color)]/25 placeholder:text-[var(--text-tertiary-gray)]"
                        placeholder="Votre nom"
                        autoFocus
                        required
                      />
                      <i className="absolute left-4 border-r pe-3 text-[var(--text-primary-color)]">
                        <UserRound size={20} strokeWidth={1} />
                      </i>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs">
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
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
          </div>

          <PrimaryButton
            label="S'inscrire"
            type="submit"
            className="h-12 rounded-lg text-base"
            isLoading={isLoading}
          />
        </div>
      </form>
    </Form>
  );
}
