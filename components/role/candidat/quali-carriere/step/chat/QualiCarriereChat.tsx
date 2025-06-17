'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AudioRecorder from './AudioRecorder';
import StepLoader from '../StepLoader';
import Title from '@/components/utils/role/user/Title';
import PrimaryButton from '@/components/utils/role/user/button/PrimaryButton';

import { toast } from 'sonner';
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
import { Textarea } from '@/components/ui/textarea';
import { respondQuestionService } from '@/services/role/candidat/qualiCarriere.service';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useSocket } from '@/providers/Socket.provider';

const questionSchema = z.object({
  content: z.string().trim(),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

export default function QualiCarriereChat() {
  const { experience, qualiCarriereQuestion, totalQuestions } = useSelector(
    (state: RootState) => state.qualiCarriere,
  );
  const { isLoadingQuestion, setIsLoadingQuestion } = useSocket();

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
    if (isLoadingQuestion) {
      form.setValue('content', '');
      setIsLoadingQuestion(false);
    }
  }, [isLoadingQuestion, qualiCarriereQuestion]);

  const onSubmit = async (data: QuestionFormValues) => {
    const parseRes = questionSchema.safeParse(data);

    if (qualiCarriereQuestion && (parseRes.success || audio)) {
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

      if (res.nextStep) {
        toast.success('Entretien terminé !', {
          description: 'Génération des synthèses en cours...',
        });
        router.push('/quali-carriere/2');
      } else if (res.nextQuestion) {
        setIsLoading(false);
      }
      setResetForm(true);
      setIsLoadingQuestion(false);
    }
  };

  if (!experience) return <StepLoader />;

  return (
    <div className="max-h-full h-full w-full flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Link
            href={'/quali-carriere'}
            className="p-2 text-[var(--text-primary-color)] bg-[var(--bg-secondary-color)] hover:opacity-80 rounded-full cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 flex justify-center">
            <Title value={'Etape 1'} />
          </div>
        </div>
        <div>
          <Link
            href={'/quali-carriere'}
            className="px-6 py-3 p-[0.5em] bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] rounded-md transition-opacity duration-300 select-none hover:opacity-80 cursor-pointer text-white"
          >
            Enregistrer et revenir plus tard
          </Link>
        </div>
      </div>

      <p className="text-orange-600 text-sm">
        Quali Carrière n'est pas activé tant que vous n'avez pas finalisé le
        processus.
      </p>

      <div className="flex-1 max-h-4/5 h-full grid md:grid-cols-2 gap-12">
        <div className="max-h-full h-full bg-[var(--bg-secondary-color)] rounded-xl shadow-lg p-10 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 min-w-14 h-14 min-h-14 bg-purple-100 rounded-full flex items-center justify-center p-2 select-none">
              <Image
                src={'/coach.png'}
                width={52}
                height={52}
                alt="Profiler Coach AI"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary-color)]">
              Partagez vos expériences avec Profiler Coach Ai
            </h2>
          </div>

          {isLoadingQuestion ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="w-full h-4 rounded bg-[var(--bg-primary-color)]" />
              <div className="flex flex-col gap-1">
                <Skeleton className="w-full h-4 rounded bg-[var(--bg-primary-color)]" />
                <Skeleton className="w-3/5 h-4 rounded bg-[var(--bg-primary-color)]" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[var(--text-primary-color)]">
                {experience.date} : {experience.title} - {experience.company}
              </p>
              <p className="text-[var(--text-secondary-gray)] break-words text-sm first-letter:uppercase">
                {qualiCarriereQuestion?.content}
              </p>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 h-1/2 flex flex-col gap-6"
            >
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="max-h-4/5 h-full flex-1 flex flex-col rounded-md overflow-hidden">
                    <FormControl className="flex-1">
                      <div className="relative h-full">
                        <Textarea
                          {...field}
                          autoComplete="off"
                          className="max-h-full h-full text-[var(--text-primary-color)] placeholder:text-[var(--text-secondary-gray)] overflow-y-auto p-4 resize-none [&::-webkit-scrollbar]:w-[0.325rem] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
                          placeholder="Votre réponse..."
                          autoFocus
                        />
                        <div
                          className={`w-max absolute bottom-4 right-4 ${
                            isLoading
                              ? 'pointer-events-none'
                              : 'pointer-events-auto'
                          }`}
                        >
                          <AudioRecorder
                            resetForm={resetForm}
                            setResetForm={setResetForm}
                            setAudio={setAudio}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm">
                      {form.formState.errors.content?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-primary-color)]">
                  Question {qualiCarriereQuestion?.order}/{totalQuestions}
                </span>
                <PrimaryButton
                  label="Valider"
                  type="submit"
                  isDisabled
                  isLoading={isLoading}
                  className="w-36 h-10 rounded-md"
                />
              </div>
            </form>
          </Form>
        </div>

        <div className="bg-[var(--bg-secondary-color)] rounded-xl p-10 shadow-lg flex flex-col gap-8 justify-between">
          <div className="flex flex-col gap-8">
            <h3 className="font-semibold text-xl text-[var(--text-primary-color)]">
              Profiler Coach Ai adore :
            </h3>
            <ul className="space-y-6 text-[var(--text-secondary-gray)] text-xl flex-1 break-words">
              <li>- le contexte</li>
              <li>- les interlocuteurs</li>
              <li>- les faits</li>
              <li>- les détails</li>
              <li>- les outils</li>
              <li>- vos méthodologies</li>
            </ul>
          </div>
          <p className="font-medium text-[var(--u-primary-color)] text-xl break-words">
            Nous donnerons le meilleur aux recruteurs !
          </p>
        </div>
      </div>
    </div>
  );
}
