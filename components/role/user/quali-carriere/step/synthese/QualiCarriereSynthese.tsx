'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StepLoader from '@/components/role/user/quali-carriere/step/StepLoader';
import ChatContent from '@/components/role/user/quali-carriere/step/chat/ChatContent';
import Title from '@/components/utils/role/user/Title';
import PrimaryButton from '@/components/utils/role/user/button/PrimaryButton';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ArrowLeft, ArrowRight, CheckCheck, Edit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  changeQualiCarriereStatusService,
  editQualiCarriereCompetenceService,
  editQualiCarriereResumeService,
  sendQualiCarriereMessageService,
} from '@/services/role/user/qualiCarriere.service';
import {
  newMessageReducer,
  updateCompetenceReducer,
  updateResumeReducer,
} from '@/redux/slices/role/user/qualiCarriere.slice';
import { QualiCarriereChatInterface } from '@/interfaces/role/user/quali-carriere/chatInterface';
import { QualiCarriereCompetenceInteface } from '@/interfaces/role/user/quali-carriere/competence.interface';
import { updateUserReducer } from '@/redux/slices/user.slice';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useSocket } from '@/providers/Socket.provider';
import { CvMinuteSectionInterface } from '@/interfaces/role/user/cv-minute/cvMinuteSection.interface';

const profilerChatSchema = z.object({
  message: z.string().trim().min(1, 'Message requis'),
});

type ProfilerChatFormValues = z.infer<typeof profilerChatSchema>;

const initialMessage =
  'Bonjour ! Je suis là pour vous aider à valoriser vos expériences professionnelles.';

export default function QualiCarriereSynthese() {
  const { cvMinute, messages } = useSelector(
    (state: RootState) => state.qualiCarriere,
  );
  const { isLoadingResponse, setIsLoadingResponse } = useSocket();

  const dispatch = useDispatch();
  const router = useRouter();
  const lastMessage = React.useRef<HTMLDivElement | null>(null);

  const [editedExperiences, setEditedExperiences] = React.useState<
    CvMinuteSectionInterface[]
  >([]);

  const [totalPages, setTotalPages] = React.useState(0);
  const [actualIndex, setActualIndex] = React.useState(0);
  const [actualSubIndex, setActualSubIndex] = React.useState(0);
  const [totalSubIndex, setTotalSubIndex] = React.useState(0);
  const [actualExperienceContent, setActualExperienceContent] = React.useState<{
    id: number;
    content: string;
  } | null>(null);
  const [actualCompetenceContent, setActualCompetenceContent] = React.useState<
    QualiCarriereCompetenceInteface[]
  >([]);
  const [actualExperience, setActualExperience] =
    React.useState<CvMinuteSectionInterface | null>(null);
  const [loadingStatus, setLoadingStatus] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);

  const [edit, setEdit] = React.useState(false);

  const form = useForm<ProfilerChatFormValues>({
    resolver: zodResolver(profilerChatSchema),
    defaultValues: {
      message: '',
    },
  });

  React.useEffect(() => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lastMessage.current, messages]);

  React.useEffect(() => {
    if (cvMinute) {
      const experiences = cvMinute.cvMinuteSections.filter(
        (c) => c.name === 'experiences',
      );
      setTotalPages(experiences.length);
      setEditedExperiences(experiences);
    }
  }, [cvMinute]);

  React.useEffect(() => {
    if (editedExperiences[actualIndex]) {
      setActualExperience(editedExperiences[actualIndex]);
    }
  }, [editedExperiences, actualIndex]);

  React.useEffect(() => {
    if (actualExperience) {
      const lines =
        actualExperience.qualiCarriereResumes?.[0]?.content
          ?.split('\n')
          .filter((r) => r.trim() !== '') || [];

      const newTotalSubIndex = lines.length + 6;
      setTotalSubIndex(newTotalSubIndex);

      if (actualSubIndex < newTotalSubIndex - 6) {
        // Affichage de résumé ligne par ligne
        setActualCompetenceContent([]);
        setActualExperienceContent({
          id: actualExperience.id,
          content: lines[actualSubIndex] || '',
        });
      } else {
        // Affichage des compétences
        setActualExperienceContent(null);

        const competences = actualExperience.qualiCarriereCompetences || [];
        const start = (actualSubIndex - (newTotalSubIndex - 6)) * 5;
        const end = start + 5;
        setActualCompetenceContent(competences.slice(start, end));
      }
    }
  }, [actualExperience, actualSubIndex]);

  React.useEffect(() => {
    if (isLoadingResponse) {
      form.setValue('message', '');
    }
  }, [isLoadingResponse]);

  const incrementPagination = () => {
    if (actualSubIndex < totalSubIndex - 1) {
      setActualSubIndex((prev) => prev + 1);
    } else {
      // fin des sous-index : on passe à l'élément suivant
      if (actualIndex < totalPages - 1) {
        setActualIndex((prev) => prev + 1);
      } else {
        // fin totale → on boucle tout
        setActualIndex(0);
      }
      setActualSubIndex(0);
    }
  };

  const handleUpdateResume = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setActualExperienceContent((prev) => {
      if (prev?.id) {
        return { ...prev, content: event.target.value };
      }
      return null;
    });
  };

  const handleUpdateCompetence = async (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    competenceId: number,
  ) => {
    setActualCompetenceContent((prev) => {
      return prev.map((c) =>
        c.id !== competenceId ? c : { ...c, content: event.target.value },
      );
    });
  };

  const handleSave = async () => {
    if (
      actualExperience &&
      actualExperience.qualiCarriereResumes &&
      actualExperienceContent
    ) {
      setSaveLoading(true);
      const resumes = actualExperience.qualiCarriereResumes;

      // 1) on récupère les lignes non-vides
      const filteredLines = resumes[0].content
        .split('\n')
        .filter((line) => line.trim() !== '');

      // 2) on sépare en trois : avant, cible, après
      const before = filteredLines.slice(0, actualSubIndex);
      const after = filteredLines.slice(actualSubIndex + 1);

      // 3) on reconstruit l’ensemble avec la nouvelle valeur
      const updatedLines = [
        ...before,
        actualExperienceContent.content,
        ...after,
      ];
      const updatedContent = updatedLines.join('\n');

      const res = await editQualiCarriereResumeService({
        id: resumes[0].id,
        content: updatedContent,
      });

      if (res.qualiCarriereResume) {
        dispatch(
          updateResumeReducer({ qualiCarriereResume: res.qualiCarriereResume }),
        );
      }

      setSaveLoading(false);
    } else if (actualCompetenceContent.length > 0) {
      setSaveLoading(true);
      const res = await editQualiCarriereCompetenceService(
        actualCompetenceContent.map((c) => ({ id: c.id, content: c.content })),
      );

      if (res.qualiCarriereCompetences) {
        dispatch(
          updateCompetenceReducer({
            qualiCarriereCompetences: res.qualiCarriereCompetences,
          }),
        );
      }
      setSaveLoading(false);
    }
    setEdit(false);
  };

  const handleChangeStatus = async () => {
    setLoadingStatus(true);
    const res = await changeQualiCarriereStatusService();

    if (res.user) {
      dispatch(updateUserReducer({ user: res.user }));
      router.push('/quali-carriere/success');
    }
  };

  const onSubmit = async (data: ProfilerChatFormValues) => {
    const parseRes = profilerChatSchema.safeParse(data);

    if (parseRes.success) {
      setIsLoading(true);
      const res = await sendQualiCarriereMessageService(parseRes.data.message);

      if (res.response) {
        dispatch(newMessageReducer({ message: res.response }));
      }
      setIsLoading(false);
      setIsLoadingResponse(false);
    }
  };

  if (!cvMinute) return <StepLoader />;

  return (
    <div className="h-full flex flex-col p-8 gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Link
            href={'/quali-carriere'}
            className="p-2 bg-gray-50 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex-1 flex justify-center">
            <Title value={'Etape 2'} />
          </div>
        </div>
      </div>

      <div className="flex-1 h-3/5 grid grid-cols-2 gap-12">
        <div className="flex max-h-full flex-col gap-6 p-8 bg-gradient-to-br from-[var(--u-primary-color)]/5 to-purple-50 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[var(--u-primary-color)]">
              Synthèse détaillée de vos expériences
            </h2>
            {edit ? (
              <div
                onClick={handleSave}
                className={`flex items-center justify-center gap-1 py-2 px-3 text-xs text-white bg-[var(--u-primary-color)] rounded-full hover:opacity-80 select-none ${
                  saveLoading
                    ? 'opacity-80 pointer-events-none'
                    : 'cursor-pointer'
                }`}
              >
                <i>
                  {saveLoading ? (
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
                    <CheckCheck size={14} />
                  )}
                </i>
                <span>Enregistrer</span>
              </div>
            ) : (
              <div
                onClick={() => setEdit(true)}
                className="flex items-center justify-center gap-1 py-2 px-3 text-xs text-white bg-[var(--u-primary-color)] rounded-full hover:opacity-80 select-none cursor-pointer"
              >
                <i>
                  <Edit size={14} />
                </i>
                <span>Editer</span>
              </div>
            )}
          </div>
          <div className="relative flex-1 h-4/5 py-6 px-1 bg-white rounded-xl shadow-inner overflow-y-auto">
            {actualExperience && actualExperience.qualiCarriereResumes && (
              <div className="flex flex-col gap-3">
                <p className="text-xl font-semibold px-5">
                  {actualExperience.date} : {actualExperience.title} -{' '}
                  {actualExperience.company}
                </p>

                {typeof actualExperienceContent?.content === 'string' && (
                  <Textarea
                    onChange={(event) => {
                      if (edit) {
                        handleUpdateResume(event);
                      } else {
                        event.preventDefault();
                      }
                    }}
                    spellCheck={false}
                    value={actualExperienceContent.content}
                    className={`!text-base text-justify border-none py-3 px-5 shadow-none resize-none focus-visible:ring-0`}
                  />
                )}

                {actualCompetenceContent.length > 0 && (
                  <div className="flex flex-col gap-3 px-5">
                    <p className="text-lg font-semibold">30 compétences :</p>
                    <div className="flex flex-col">
                      {actualCompetenceContent?.map((c) => (
                        <div
                          key={`competence-${c.id}`}
                          className="flex items-center gap-1"
                        >
                          <span>- </span>
                          <Textarea
                            onChange={(event) => {
                              if (edit) {
                                handleUpdateCompetence(event, c.id);
                              } else {
                                event.preventDefault();
                              }
                            }}
                            spellCheck={false}
                            value={c.content}
                            className={`h-max min-h-auto !text-base border-none px-2 shadow-none resize-none hover:bg-gray-100 focus-visible:ring-0`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div
              onClick={incrementPagination}
              className="absolute top-3 right-3 w-8 h-8 text-white bg-[var(--u-primary-color)] rounded-full flex items-center justify-center hover:opacity-80 cursor-pointer"
            >
              <ArrowRight size={16} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 bg-white rounded-xl p-8 shadow-lg overflow-hidden">
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
            <h2 className="text-xl font-semibold">
              Discutez avec Profiler Carrière Ai
            </h2>
            {/* <button className="ml-auto px-4 py-2 bg-[var(--u-primary-color)] text-white rounded-full text-sm hover:bg-[#5a24cc] transition-colors select-none cursor-pointer">
              Enregistrer
            </button> */}
          </div>

          <div className="flex-1 h-3/5 flex flex-col bg-gray-50 rounded-xl p-4">
            <div className="flex-1 flex flex-col gap-2 pb-4 pe-4 overflow-y-auto [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
              <ChatContent message={initialMessage} />
              {messages.map((m: QualiCarriereChatInterface) => (
                <ChatContent
                  key={`quali-carriere-message-${m.id}`}
                  mine={m.role === 'user'}
                  message={m.content}
                />
              ))}
              {isLoadingResponse && (
                <div className="flex gap-2 max-w-4/5">
                  <div className="w-8 min-w-8 h-8 min-h-8 bg-purple-100 p-1.5 rounded-full">
                    <Image
                      src={'/coach.png'}
                      width={24}
                      height={24}
                      alt="Profiler Coach AI"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Skeleton className="h-36 w-full rounded-md rounded-tl-none shadow-sm" />
                </div>
              )}
              <div ref={lastMessage}></div>
            </div>

            <div className="relative">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex-1 flex flex-col gap-6"
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
                            className="max-h-28 min-h-10 overflow-y-auto text-sm placeholder:text-sm py-3 px-4 rounded-3xl resize-none"
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
                    className={`absolute right-2 top-[0.425rem] w-8 h-8 text-white bg-[var(--u-primary-color)] rounded-full flex items-center justify-center ${
                      isLoading
                        ? 'opacity-80 pointer-events-none'
                        : 'hover:opacity-80 cursor-pointer'
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
                      <i>
                        <ArrowRight size={14} />
                      </i>
                    )}
                  </button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <PrimaryButton
          label="Activer Quali Carrière"
          isLoading={loadingStatus}
          onClick={handleChangeStatus}
          className="w-72 h-16 rounded-full text-base"
        />
      </div>
    </div>
  );
}
