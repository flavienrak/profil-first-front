'use client';

import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  remember: z.boolean().default(false).optional(),
});

export default function LoginComponent() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    const parseRes = loginSchema.safeParse(data);

    if (parseRes.success) {
      // API CALL
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <Card className="p-8">
        <h1 className="text-3xl font-semibold text-center mb-4">Connexion</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          {...field}
                          autoComplete="off"
                          placeholder="Adresse e-mail..."
                        />
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
                      <FormLabel htmlFor="password">Mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          autoComplete="off"
                          placeholder="*************"
                        />
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
                        />
                      </FormControl>
                      <FormLabel htmlFor="remember-me">
                        Se souvenir de moi
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="py-6 cursor-pointer">
                Se connecter
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      <label className="text-center">
        N'a pas encore de compte ?{' '}
        <Link href={'/auth/register'} className="underline">
          S'inscrire
        </Link>
      </label>
    </div>
  );
}
