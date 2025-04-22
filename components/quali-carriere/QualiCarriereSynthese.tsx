'use client';

import React from 'react';
import Image from 'next/image';
import ChatContent from './ChatContent';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import { UidContext } from '@/providers/UidProvider';
import { Textarea } from '../ui/textarea';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { sendQualiCarriereMessageService } from '@/services/qualiCarriere.service';
import { newMessageReducer } from '@/redux/slices/qualiCarriere.slice';
import { QualiCarriereChatInterface } from '@/interfaces/quali-carriere/chatInterface';

const profilerChatSchema = z.object({
  message: z.string().trim().min(1, 'Message requis'),
});

type ProfilerChatFormValues = z.infer<typeof profilerChatSchema>;

const initialMessage =
  'Bonjour ! Je suis là pour vous aider à valoriser vos expériences professionnelles.';

export default function QualiCarriereSynthese({
  setRedirectLoading,
}: {
  setRedirectLoading: (value: boolean) => void;
}) {
  const { qualiCarriereResume, messages } = useSelector(
    (state: RootState) => state.qualiCarriere,
  );
  const context = React.useContext(UidContext);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ProfilerChatFormValues>({
    resolver: zodResolver(profilerChatSchema),
    defaultValues: {
      message: '',
    },
  });

  React.useEffect(() => {
    setRedirectLoading(false);
    if (context) {
      context.setLoadingQuestion(false);
    }
  }, [context]);

  const onSubmit = async (data: ProfilerChatFormValues) => {
    const parseRes = profilerChatSchema.safeParse(data);

    if (parseRes.success) {
      setIsLoading(true);
      const res = await sendQualiCarriereMessageService(parseRes.data.message);

      if (res.message) {
        dispatch(
          newMessageReducer({ message: res.message, response: res.response }),
        );
      }
      form.setValue('message', '');
      setIsLoading(false);
    }
  };

  if (context && context.loadingQuestion === false)
    return (
      <div className="h-full flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => context.handleRemoveQuery('step')}
              className="p-2 bg-gray-50 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex-1 text-center">
              Etape 2
            </h1>
          </div>
        </div>

        <div className="flex-1 h-3/5 grid grid-cols-2 gap-12">
          <div className="flex max-h-full flex-col gap-6 bg-gradient-to-br from-[#6B2CF5]/5 to-purple-50 rounded-xl p-8 shadow-lg overflow-hidden">
            <h2 className="text-2xl font-semibold text-[#6B2CF5]">
              Synthèse détaillée de vos expériences
            </h2>
            <div className="relative h-4/5">
              <Textarea
                readOnly
                defaultValue={qualiCarriereResume?.content}
                className="bg-white max-h-full overflow-y-auto resize-none border border-purple-100 rounded-xl p-8 shadow-inner"
              />
              <div className="absolute top-3 right-3 w-10 h-10 bg-[#6B2CF5] rounded-full flex items-center justify-center hover:bg-[#5a24cc] transition-colors cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-white transform rotate-180" />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 bg-white rounded-xl p-8 shadow-lg overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-20 min-w-20 h-20 min-h-20 bg-purple-100 rounded-full flex items-center justify-center p-3">
                <Image
                  src={'/coach.png'}
                  width={48}
                  height={48}
                  alt="Profiler Coach AI"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-2xl font-semibold">
                Discutez avec Profiler Carrière Ai
              </h2>
              <button className="ml-auto px-4 py-2 bg-[#6B2CF5] text-white rounded-full text-sm hover:bg-[#5a24cc] transition-colors cursor-pointer">
                Enregistrer la discussion
              </button>
            </div>

            <div className="flex-1 h-3/5 flex flex-col gap-4 bg-gray-50 rounded-xl p-6">
              <div className="flex-1 flex flex-col py-4 gap-4 pe-4 overflow-y-auto [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
                <ChatContent message={initialMessage} />
                {messages.map((m: QualiCarriereChatInterface) => (
                  <ChatContent
                    key={m.id}
                    mine={m.role === 'user'}
                    message={m.content}
                  />
                ))}
              </div>

              <div className="relative">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex-1 h-1/2 flex flex-col gap-6"
                  >
                    <FormField
                      name="message"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="rounded-2xl">
                          <FormControl>
                            <Textarea
                              {...field}
                              autoComplete="off"
                              className="max-h-28 min-h-14 overflow-y-auto p-4 rounded-2xl resize-none"
                              placeholder="Votre message..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  form.handleSubmit(onSubmit)();
                                }
                              }}
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`absolute right-2 top-2 w-10 h-10 bg-[#6B2CF5] rounded-full flex items-center justify-center transition-colors shadow-md ${
                        isLoading
                          ? 'opacity-80'
                          : 'hover:bg-[#5a24cc] cursor-pointer'
                      }`}
                    >
                      {isLoading ? (
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline w-4 h-4 text-white animate-spin"
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
                      ) : (
                        <ArrowLeft className="w-5 h-5 text-white transform rotate-180" />
                      )}
                    </button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button className="w-max px-10 py-4 bg-[#6B2CF5] text-white rounded-full text-lg font-semibold hover:bg-[#5a24cc] transition-colors shadow-lg cursor-pointer">
            Activer Quali Carrière
          </button>
        </div>
      </div>
    );
}
