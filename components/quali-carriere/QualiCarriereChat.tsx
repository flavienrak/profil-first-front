'use client';

import React from 'react';
import qs from 'query-string';
import Image from 'next/image';
import Link from 'next/link';
import AudioRecorder from './AudioRecorder';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import { UidContext } from '@/providers/UidProvider';
import { Textarea } from '../ui/textarea';
import { respondQuestionService } from '@/services/qualiCarriere.service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { questionNumber } from '@/lib/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setQuestionReducer } from '@/redux/slices/qualiCarriere.slice';

const questionSchema = z.object({
  content: z.string().trim(),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

export default function QualiCarriereChat({
  setRedirectLoading,
}: {
  setRedirectLoading: (value: boolean) => void;
}) {
  const context = React.useContext(UidContext);
  const { question, qualiCarriereQuestion } = useSelector(
    (state: RootState) => state.qualiCarriere,
  );

  const dispatch = useDispatch();
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  const [resetForm, setResetForm] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [audio, setAudio] = React.useState<Blob | null>(null);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      content: '',
    },
  });

  React.useEffect(() => {
    setRedirectLoading(false);
    if (context) {
      context.setLoadingQuestion(false);
    }
  }, [context]);

  const onSubmit = async (data: QuestionFormValues) => {
    const parseRes = questionSchema.safeParse(data);

    if (question && qualiCarriereQuestion && (parseRes.success || audio)) {
      const formData = new FormData();

      if (
        !audio &&
        parseRes.success &&
        parseRes.data.content.trim().length === 0
      ) {
        form.setError('content', {
          type: 'manual',
          message: 'Réponse requise',
        });
        return;
      }

      if (parseRes.success && parseRes.data.content.trim().length > 0) {
        formData.append('content', parseRes.data.content);
      } else if (audio) {
        formData.append('file', audio);
      }

      setIsLoading(true);
      const res = await respondQuestionService({
        id: qualiCarriereQuestion.id,
        formData,
      });
      setIsLoading(false);

      if (res.nextStep) {
        let currentQuery = null;
        currentQuery = qs.parse(params.toString());
        const updateQuery = {
          ...currentQuery,
          step: 2,
        };
        const url = qs.stringifyUrl({
          url: pathname,
          query: updateQuery,
        });

        router.push(url);
      } else if (res.question) {
        dispatch(
          setQuestionReducer({
            question: res.question,
            qualiCarriereQuestion: res.qualiCarriereQuestion,
          }),
        );
        form.setValue('content', '');
      }

      setResetForm(true);
    }
  };

  if (context && context.loadingQuestion === false)
    return (
      <div className="h-full w-full flex flex-col gap-8 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => context.handleRemoveQuery('step')}
              className="p-2 bg-gray-50 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex-1 text-center">
              Etape 1
            </h1>
          </div>
          <div>
            <Link
              href={'/quali-carriere'}
              className="px-6 py-3 p-[0.5em] bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] rounded-md transition-opacity duration-300 select-none hover:opacity-90 cursor-pointer text-white"
            >
              Enregistrer et revenir plus tard
            </Link>
          </div>
        </div>

        <p className="text-orange-600 text-sm">
          Quali Carrière n'est pas activé tant que vous n'avez pas finalisé le
          processus.
        </p>

        <div className="flex-1 h-4/5 grid md:grid-cols-2 gap-12">
          <div className="h-full bg-white rounded-xl shadow-lg p-10 flex flex-col gap-6 overflow-hidden">
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
                Partagez vos expériences avec Profiler Coach Ai
              </h2>
            </div>
            <p className="text-gray-600 break-words first-letter:uppercase">
              {question?.content}
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex-1 h-1/2 flex flex-col gap-6"
              >
                <FormField
                  name="content"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1 flex flex-col max-h-4/5 rounded-md">
                      <FormControl className="flex-1">
                        <div className="relative">
                          <Textarea
                            {...field}
                            autoComplete="off"
                            className="h-full overflow-y-auto p-4 resize-none"
                            placeholder="Votre réponse..."
                          />
                          <div className="w-full absolute bottom-0 right-0">
                            <AudioRecorder
                              resetForm={resetForm}
                              setResetForm={setResetForm}
                              setAudio={setAudio}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs">
                        {form.formState.errors.content?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <div
                  className={`flex justify-between items-center ${
                    context.loadingQuestion ? 'pointer-events-none' : ''
                  }`}
                >
                  <span className="text-gray-500">
                    Question {qualiCarriereQuestion?.order}/{questionNumber}
                  </span>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 bg-[#6B2CF5] text-white rounded-md ${
                      isLoading
                        ? 'opacity-80'
                        : 'hover:bg-[#5a24cc] transition-colors cursor-pointer'
                    }`}
                  >
                    <p className="flex justify-center items-center gap-[0.5em] text-white">
                      {isLoading && (
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
                      )}
                      <span>Valider</span>
                    </p>
                  </button>
                </div>
              </form>
            </Form>
          </div>

          <div className="bg-purple-50 rounded-xl p-10 shadow-lg flex flex-col gap-8 justify-between">
            <div className="flex flex-col gap-8">
              <h3 className="font-semibold text-xl">
                Profiler Coach Ai adore :
              </h3>
              <ul className="space-y-6 text-gray-700 text-xl flex-1 break-words">
                <li>- le contexte</li>
                <li>- les interlocuteurs</li>
                <li>- les faits</li>
                <li>- les détails</li>
                <li>- les outils</li>
                <li>- vos méthodologies</li>
              </ul>
            </div>
            <p className="font-medium text-[#6B2CF5] text-xl break-words">
              Nous donnerons le meilleur aux recruteurs !
            </p>
          </div>
        </div>
      </div>
    );
}
