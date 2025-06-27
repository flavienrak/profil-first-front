'use client';

import React from 'react';
import Image from 'next/image';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { candidatRoutes, recruiterRoutes } from '@/lib/routes';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import {
  resetPasswordService,
  verifyResetPasswordTokenService,
} from '@/services/auth.service';

const formSchema = z.object({
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  cPassword: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordComponent() {
  const params = useParams();

  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      cPassword: '',
    },
  });

  React.useEffect(() => {
    let isMounted = true;

    (async () => {
      const res = await verifyResetPasswordTokenService(params.token as string);

      if (isMounted) {
        if (!res.valid) {
          window.location.href = '/';
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [params.token]);

  const onSubmit = async (data: FormValues) => {
    const parseRes = formSchema.safeParse(data);

    if (parseRes.success) {
      // API CALL
      if (parseRes.data.password !== parseRes.data.cPassword) {
        form.setError('cPassword', {
          type: 'manual',
          message: 'Les mots de passe ne correspondent pas',
        });
      } else if (params.token) {
        setIsLoading(true);
        const res = await resetPasswordService({
          token: params.token as string,
          password: parseRes.data.password,
        });

        if (res.user) {
          toast.success('Mot de passe réinitialisé avec succès', {
            description: 'Accès à la plateforme',
          });
          if (res.user.role === 'candidat') {
            window.location.href =
              candidatRoutes.find((item) => item.ref)?.href ?? '/';
          } else {
            window.location.href =
              recruiterRoutes.find((item) => item.ref)?.href ?? '/';
          }
        } else {
          window.location.href = '/';
        }
      }
    }
  };

  return (
    <div className="w-full h-full">
      <div className="min-h-screen flex justify-center items-center [background-image:var(--bg-primary)] transition-all duration-150">
        <div className="flex flex-col gap-12">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={400}
              height={60}
              className=""
            />
          </div>
          <div className="flex flex-col items-center gap-8 shadow-xl p-12 rounded-xl">
            <h1 className="text-4xl font-semibold text-[var(--u-secondary-color)]">
              Réinitialiser mot de passe
            </h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex flex-col items-center gap-8"
              >
                <div className="w-full flex flex-col gap-4">
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          htmlFor="password"
                          className="text-base text-[var(--text-primary-color)]"
                        >
                          Nouveau mot de passe
                        </FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            <Input
                              {...field}
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="off"
                              className="h-12 pe-12 text-[var(--text-primary-color)] border-[var(--text-primary-color)]/25 placeholder:text-[var(--text-tertiary-gray)]"
                              placeholder="*******************"
                              required
                            />
                            <i
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-4 text-[var(--text-primary-color)] cursor-pointer"
                            >
                              {showPassword ? (
                                <Eye size={20} strokeWidth={1} />
                              ) : (
                                <EyeOff size={20} strokeWidth={1} />
                              )}
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
                    name="cPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          htmlFor="cPassword"
                          className="text-base text-[var(--text-primary-color)]"
                        >
                          Confirmer mot de passe
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="cPassword"
                            type="password"
                            autoComplete="off"
                            className="h-12 text-[var(--text-primary-color)] border-[var(--text-primary-color)]/25 placeholder:text-[var(--text-tertiary-gray)]"
                            placeholder="*******************"
                            required
                          />
                        </FormControl>
                        <FormMessage className="text-xs">
                          {form.formState.errors.cPassword?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <button
                  type="submit"
                  className="h-12 w-full flex justify-center items-center gap-2 rounded-lg text-base bg-[var(--u-secondary-color)] text-white cursor-pointer"
                >
                  {isLoading && (
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-5 h-5 animate-spin"
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
                  <span>Valider</span>
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
