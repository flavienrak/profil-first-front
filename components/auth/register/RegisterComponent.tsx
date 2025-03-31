'use client';

import React from 'react';
import Link from 'next/link';

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
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const registerSchema = z.object({
  nom: z.string().trim().min(3, 'Nom requis'),
  email: z.string().trim().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export default function RegisterComponent() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nom: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: {
    nom: string;
    email: string;
    password: string;
  }) => {
    const parseRes = registerSchema.safeParse(data);

    if (parseRes.success) {
      // API CALL
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <Card className="p-8">
        <h1 className="text-3xl font-semibold text-center mb-4">Inscription</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <FormField
                  name="nom"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="nom">Nom</FormLabel>
                      <FormControl>
                        <Input
                          id="nom"
                          {...field}
                          autoComplete="off"
                          placeholder="Votre nom..."
                        />
                      </FormControl>
                      <FormMessage className="text-xs">
                        {form.formState.errors.nom?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
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
              </div>
              <Button type="submit" className="py-6 cursor-pointer">
                S'inscrire
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      <label className="text-center">
        A déjà un compte enregistré ?{' '}
        <Link href={'/auth/login'} className="underline">
          Se connecter{' '}
        </Link>
      </label>
    </div>
  );
}
