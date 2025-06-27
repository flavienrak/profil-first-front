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
import { Phone } from 'lucide-react';
import { sendReservationContactService } from '@/services/user.service';

const formSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s().-]{8,20}$/, 'Numéro de téléphone invalide'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ConctactForm({
  showConfirm,
  setShowConfirm,
}: {
  showConfirm: 'confirm' | 'sent';
  setShowConfirm: React.Dispatch<
    React.SetStateAction<'confirm' | 'sent' | null>
  >;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    const parseRes = formSchema.safeParse(data);

    if (parseRes.success) {
      // API CALL
      setIsLoading(true);
      const res = await sendReservationContactService(parseRes.data.phone);

      if (res.sent) {
        setShowConfirm('sent');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 scale-100">
        {showConfirm === 'confirm' ? (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Demande de contact
                    </h3>
                    <p className="text-gray-600">
                      Confirmez-vous votre demande de contact pour une séance de
                      coaching ?
                    </p>
                  </div>

                  <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="phone"
                          className="text-base text-[var(--text-primary-color)]"
                        >
                          Numéro de téléphone
                        </FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            <Input
                              id="phone"
                              {...field}
                              autoComplete="off"
                              className="h-12 ps-16 text-[var(--text-primary-color)] border-[var(--text-primary-color)]/25 placeholder:text-[var(--text-tertiary-gray)]"
                              placeholder="01 .. .. .. .."
                              autoFocus
                              required
                            />
                            <i className="absolute left-4 border-r pe-3 text-[var(--text-primary-color)]">
                              <Phone size={20} strokeWidth={1} />
                            </i>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs">
                          {form.formState.errors.phone?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-full font-semibold transition-all duration-300 shadow-lg${
                        isLoading
                          ? 'opacity-80 pointer-events-none'
                          : 'hover:shadow-xl transform hover:-translate-y-1  hover:from-purple-700 hover:to-pink-700 cursor-pointer'
                      }`}
                    >
                      {isLoading && (
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
                      <span>Confirmer ma demande de contact</span>
                    </button>
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        setShowConfirm(null);
                      }}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-full font-medium hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </form>
            </Form>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 text-white text-2xl">✓</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Demande transmise !
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Votre demande a été transmise. Restez près de votre téléphone,
                <br />
                <strong className="text-gray-900 font-bold text-lg">
                  vous serez contacté dans les 24h.
                </strong>
              </p>
              <button
                onClick={() => setShowConfirm(null)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
