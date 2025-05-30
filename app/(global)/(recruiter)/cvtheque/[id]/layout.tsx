'use client';

import React from 'react';
import Link from 'next/link';
import Popup from '@/components/utils/Popup';
import ContactModal from '@/components/role/recruiter/cvtheque/cv-anonym/ContactModal';

import { X, MapPin, ZoomIn, ZoomOut, Inbox } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { domains, educationLevels } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { Textarea } from '@/components/ui/textarea';
import {
  getCvThequeCritereService,
  resendCvThequeCritereService,
  updateCvThequeCritereService,
} from '@/services/role/recruiter/cvtheque.service';
import {
  saveCvThequeCritereReducer,
  setCvThequeCritereReducer,
} from '@/redux/slices/role/recruiter/cvtheque.slice';
import { isArraysEqual } from '@/lib/function';
import { updatePersistReducer } from '@/redux/slices/persist.slice';
import {
  CvThequeCritereFormValues,
  cvThequeCritereSchema,
} from '@/components/role/recruiter/cvtheque/CvThequeComponent';
import { UpdateCvThequeCritereInterface } from '@/interfaces/role/recruiter/cvtheque-form';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import TextEditor from '@/components/utils/TextEditor';

export default function CvThequeDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fontSize, mode } = useSelector(
    (state: RootState) => state.persistInfos,
  );
  const { cvThequeCritere, cvAnonym } = useSelector(
    (state: RootState) => state.cvTheque,
  );
  const { showCritere } = useSelector((state: RootState) => state.persistInfos);
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  const [actualId, setActualId] = React.useState<number | null>(null);
  const [showMessage, setShowMessage] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);
  const [showAddCompetence, setShowAddCompetence] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = React.useState(false);
  const [redirectLoading, setRedirectLoading] = React.useState<number | null>(
    null,
  );
  const [competence, setCompetence] = React.useState('');

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 13;
  const totalPages = Math.ceil(
    (cvThequeCritere?.cvMinutes?.length ?? 1) / itemsPerPage,
  );

  const form = useForm<CvThequeCritereFormValues>({
    resolver: zodResolver(cvThequeCritereSchema),
    defaultValues: {
      position: cvThequeCritere?.position || '',
      description: cvThequeCritere?.description || '',
      domain: cvThequeCritere?.domain || '',
      competences: cvThequeCritere?.cvThequeCompetences?.map((c) => c.content),
      ...(cvThequeCritere?.experience != null && {
        experience: cvThequeCritere.experience,
      }),
      diplome: cvThequeCritere?.diplome || '',
      localisation: cvThequeCritere?.localisation || '',
      distance: cvThequeCritere?.distance || 0,
    },
  });

  React.useEffect(() => {
    if (cvThequeCritere) {
      form.reset({
        position: cvThequeCritere.position,
        description: cvThequeCritere.description || '',
        domain: cvThequeCritere.domain,
        competences: cvThequeCritere.cvThequeCompetences?.map((c) => c.content),
        ...(cvThequeCritere.experience != null && {
          experience: cvThequeCritere.experience,
        }),
        diplome: cvThequeCritere.diplome || '',
        localisation: cvThequeCritere.localisation || '',
        distance: cvThequeCritere.distance,
      });
    }
  }, [cvThequeCritere]);

  React.useEffect(() => {
    if (params.id) {
      if (isNaN(Number(params.id))) {
        router.push('/cvtheque');
      } else if (Number(params.id) !== actualId) {
        setActualId(Number(params.id));

        (async () => {
          setIsLoading(true);
          const res = await getCvThequeCritereService(Number(params.id));

          if (res.cvThequeCritere) {
            dispatch(
              setCvThequeCritereReducer({
                cvThequeCritere: res.cvThequeCritere,
              }),
            );
          } else {
            router.push('/cvtheque');
          }
          setIsLoading(false);
        })();
      }
    }
  }, [params.id]);

  React.useEffect(() => {
    if (cvAnonym) {
      setRedirectLoading(null);
    }
  }, [cvAnonym]);

  const getCurrentPageItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return cvThequeCritere?.cvMinutes?.slice(start, end);
  };

  const getDisplayedPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Si on est en début de pagination et il manque des pages à droite
    while (pages.length < 3 && pages[pages.length - 1] < totalPages) {
      pages.push(pages[pages.length - 1] + 1);
    }

    // Si on est en fin de pagination et il manque des pages à gauche
    while (pages.length < 3 && pages[0] > 1) {
      pages.unshift(pages[0] - 1);
    }

    return pages;
  };

  const increaseFontSize = () => {
    dispatch(updatePersistReducer({ fontSize: fontSize + 1 }));
  };
  const decreaseFontSize = () => {
    dispatch(updatePersistReducer({ fontSize: fontSize - 1 }));
  };

  const handleAddCompetence = () => {
    const prevCompetences = form.getValues('competences');
    if (
      !prevCompetences.some(
        (c) => c.toLocaleLowerCase() === competence.trim().toLocaleLowerCase(),
      )
    ) {
      form.setValue('competences', [...prevCompetences, competence.trim()]);
    }
    setCompetence('');
    setShowAddCompetence(false);
  };

  const handleRemoveCompetence = (value: string) => {
    const prevCompetences = form.getValues('competences');
    form.setValue(
      'competences',
      prevCompetences.filter((c) => c !== value),
    );
  };

  const onSubmit = async (data: CvThequeCritereFormValues) => {
    const parseRes = cvThequeCritereSchema.safeParse(data);

    if (parseRes.success && cvThequeCritere) {
      // Les champs string | number à comparer automatiquement
      const simpleFields = [
        'position',
        'description',
        'domain',
        'experience',
        'diplome',
        'localisation',
        'distance',
      ] as const;

      const dataToUpdate: UpdateCvThequeCritereInterface = Object.fromEntries(
        simpleFields
          .map((key) => [key, parseRes.data[key]] as const)
          .filter(
            ([key, value]) =>
              value !== undefined &&
              typeof value === 'string' &&
              value !== cvThequeCritere[key],
          ),
      ) as UpdateCvThequeCritereInterface;

      // Comparaison spécifique des tableaux de compétences
      const newComps = parseRes.data.competences ?? [];
      const oldComps = cvThequeCritere.cvThequeCompetences?.map(
        (c) => c.content,
      );

      if (oldComps && !isArraysEqual(newComps, oldComps)) {
        dataToUpdate.competences = newComps;
      }

      if (Object.keys(dataToUpdate).length > 0) {
        setSubmitLoading(true);
        const res = await updateCvThequeCritereService({
          id: cvThequeCritere.id,
          ...dataToUpdate,
        });

        if (res.cvThequeCritere) {
          dispatch(
            setCvThequeCritereReducer({ cvThequeCritere: res.cvThequeCritere }),
          );
          router.refresh();
        }
        setSubmitLoading(false);
      }
    }
  };

  const handleResendSearch = async () => {
    if (cvThequeCritere) {
      setIsLoadingSearch(true);
      const res = await resendCvThequeCritereService(cvThequeCritere.id);

      if (res.cvThequeCritere) {
        dispatch(
          saveCvThequeCritereReducer({
            cvThequeCritere: res.cvThequeCritere,
          }),
        );
      }
      setIsLoadingSearch(false);
    }
  };

  return (
    <div className="relative min-h-full w-full flex gap-6 py-8 px-12 bg-[var(--bg-tertiary-color)]">
      {showCritere && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-72 min-w-72"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--r-primary-color)] text-white rounded-md ${
                    submitLoading
                      ? 'opacity-80 pointer-events-none'
                      : 'hover:opacity-80 cursor-pointer'
                  }`}
                >
                  {submitLoading && (
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-5 h-5 text-white animate-spin"
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
                  <span>Voir les talents</span>
                </button>

                <FormField
                  name="position"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="position"
                        className="text-sm font-medium text-[var(--text-primary-color)]"
                      >
                        Mon offre d'emploi *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="position"
                          autoComplete="off"
                          className="h-32 p-3 text-[var(--text-primary-color)] bg-[var(--bg-secondary-color)] border border-[var(--text-primary-color)]/10 placeholder:text-[var(--text-secondary-gray)] rounded-lg focus:outline-none focus:!border-[var(--r-primary-color)] focus:!ring-2 focus:!ring-[var(--r-primary-color)]/20 resize-none"
                          placeholder="Décrivez votre offre d'emploi..."
                          required
                        />
                      </FormControl>
                      <FormMessage className="text-xs">
                        {form.formState.errors.position?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="description"
                        className="text-sm font-medium text-[var(--text-primary-color)]"
                      >
                        Je recherche...
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="description"
                          autoComplete="off"
                          className="h-32 p-3 text-[var(--text-primary-color)] bg-[var(--bg-secondary-color)] border border-[var(--text-primary-color)]/10 placeholder:text-[var(--text-secondary-gray)] rounded-lg focus:outline-none focus:!border-[var(--r-primary-color)] focus:!ring-2 focus:!ring-[var(--r-primary-color)]/20 resize-none"
                          placeholder="Décrivez vos critères de recherche..."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="domain"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="domain"
                        className="text-sm font-medium text-[var(--text-primary-color)]"
                      >
                        Domaine
                      </FormLabel>

                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className={`w-full !h-12 p-3 !text-[var(--text-primary-color)] [&_svg]:!text-[var(--text-primary-color)] border-[var(--text-primary-color)]/10 data-[state=open]:border-[var(--r-primary-color)] data-[state=open]:ring-2 data-[state=open]:ring-[var(--r-primary-color)]/20 ${
                              mode === 'light'
                                ? 'bg-white'
                                : 'bg-[var(--bg-secondary-color)]'
                            }`}
                          >
                            <SelectValue placeholder="Choisir le domaine" />
                          </SelectTrigger>
                          <SelectContent
                            className={`${
                              mode === 'light'
                                ? ''
                                : 'bg-[#31374b] border-[#FFFFFF]/10'
                            }`}
                          >
                            <SelectGroup>
                              {domains.map((d) => (
                                <SelectItem
                                  key={`domain-${d.id}`}
                                  value={d.label}
                                  className={`h-8 ${
                                    field.value === d.label
                                      ? `${
                                          mode === 'light'
                                            ? '!text-[var(--r-primary-color)] [&_svg]:!text-[var(--r-primary-color)] !bg-accent'
                                            : '!text-white [&_svg]:!text-white !bg-cyan-700'
                                        }`
                                      : `!text-[var(--text-primary-color)] hover:!text-[var(--r-primary-color)] !bg-transparent ${
                                          mode === 'light'
                                            ? 'hover:!bg-accent'
                                            : '!text-white hover:!bg-cyan-700/25'
                                        }`
                                  }`}
                                >
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage className="text-xs">
                        {form.formState.errors.domain?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  name="competences"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="competences"
                        className="text-sm font-medium text-[var(--text-primary-color)]"
                      >
                        Compétences
                      </FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((c) => (
                          <label
                            key={`competence-${c}`}
                            className="flex items-center gap-2 px-3 py-1 bg-[var(--r-primary-color)]/10 text-[var(--r-primary-color)] rounded-full text-sm hover:opacity-80"
                          >
                            <span>{c}</span>
                            <i
                              onClick={() => handleRemoveCompetence(c)}
                              className="cursor-pointer"
                            >
                              <X size={16} />
                            </i>
                          </label>
                        ))}
                      </div>
                      <div>
                        <Popover
                          open={showAddCompetence}
                          onOpenChange={(value) => setShowAddCompetence(value)}
                        >
                          <PopoverTrigger className="text-sm text-[var(--r-primary-color)] focus:outline-none hover:underline cursor-pointer">
                            Ajouter des compétences
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className={`rounded-lg border ${
                              mode === 'light'
                                ? 'bg-white border-gray-700/10'
                                : 'border-white/10 bg-[#31374b]'
                            }`}
                          >
                            <div className="w-full flex flex-col gap-4">
                              <Input
                                type="text"
                                value={competence}
                                onChange={(event) =>
                                  setCompetence(event.target.value)
                                }
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleAddCompetence();
                                  }
                                }}
                                placeholder="Compétence"
                                className={`w-full h-10 p-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:!border-[var(--r-primary-color)] focus:!ring-2 focus:!ring-[var(--r-primary-color)]/20 ${
                                  mode === 'light'
                                    ? 'bg-white'
                                    : 'text-white bg-[#151823] border-white/25 placeholder:text-gray-400'
                                }`}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={(event) => {
                                    event.preventDefault();
                                    setCompetence('');
                                    setShowAddCompetence(false);
                                  }}
                                  className="flex-1 px-6 py-2 bg-gray-200 text-sm text-gray-700 rounded-md cursor-pointer hover:opacity-80"
                                >
                                  Annuler
                                </button>
                                <button
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleAddCompetence();
                                  }}
                                  className="flex-1 px-6 py-2 bg-[var(--r-primary-color)] text-sm text-white rounded-md cursor-pointer hover:opacity-80"
                                >
                                  Ajouter
                                </button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="experience"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="experience"
                        className="text-sm font-medium text-[var(--text-primary-color)]"
                      >
                        Années d'expérience
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          onChange={(event) => {
                            const value = event.target.value;
                            if (value && !isNaN(Number(value))) {
                              field.onChange(Number(value));
                            } else if (value === '') {
                              field.onChange(value);
                            }
                          }}
                          id="experience"
                          autoComplete="off"
                          className="h-12 p-3 text-[var(--text-primary-color)] bg-[var(--bg-secondary-color)] border border-[var(--text-primary-color)]/10 placeholder:text-[var(--text-secondary-gray)] rounded-lg focus:outline-none focus:!border-[var(--r-primary-color)] focus:!ring-2 focus:!ring-[var(--r-primary-color)]/20"
                          placeholder="Nombre d'années"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="diplome"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="diplome"
                        className="text-sm font-medium text-[var(--text-primary-color)]"
                      >
                        Niveau de diplôme
                      </FormLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={`w-full !h-12 p-3 !text-[var(--text-primary-color)] [&_svg]:!text-[var(--text-primary-color)] border-[var(--text-primary-color)]/10 data-[state=open]:border-[var(--r-primary-color)] data-[state=open]:ring-2 data-[state=open]:ring-[var(--r-primary-color)]/20 ${
                            mode === 'light' ? 'bg-white' : 'bg-[#31374b]'
                          }`}
                        >
                          <SelectValue placeholder="Choisir un niveau de diplôme" />
                        </SelectTrigger>
                        <SelectContent
                          className={`${
                            mode === 'light'
                              ? ''
                              : 'bg-[#31374b] border-[#FFFFFF]/10'
                          }`}
                        >
                          <SelectGroup>
                            {educationLevels.map((item) => (
                              <SelectItem
                                key={`education-level-${item}`}
                                value={item}
                                className={`h-8 ${
                                  field.value === item
                                    ? `${
                                        mode === 'light'
                                          ? '!text-[var(--r-primary-color)] [&_svg]:!text-[var(--r-primary-color)] !bg-accent'
                                          : '!text-white [&_svg]:!text-white !bg-cyan-700'
                                      }`
                                    : `!text-[var(--text-primary-color)] hover:!text-[var(--r-primary-color)] !bg-transparent ${
                                        mode === 'light'
                                          ? 'hover:!bg-accent'
                                          : '!text-white hover:!bg-cyan-700/25'
                                      }`
                                }`}
                              >
                                {item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  name="localisation"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="localisation"
                        className="text-sm font-medium text-[var(--text-primary-color)]"
                      >
                        Localisation
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            {...field}
                            id="localisation"
                            autoComplete="off"
                            className="h-12 pl-10 pr-3 py-3 text-[var(--text-primary-color)] bg-[var(--bg-secondary-color)] border border-[var(--text-primary-color)]/10 placeholder:text-[var(--text-secondary-gray)] rounded-lg focus:outline-none focus:!border-[var(--r-primary-color)] focus:!ring-2 focus:!ring-[var(--r-primary-color)]/20"
                            placeholder="Ville ou région"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="distance"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="distance"
                        className="text-sm font-medium text-[var(--text-primary-color)]"
                      >
                        Rayon: {field.value}km
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(event) => {
                            const value = event.target.value;
                            if (!isNaN(Number(value))) {
                              field.onChange(Number(value));
                            }
                          }}
                          id="distance"
                          type="range"
                          min="0"
                          max="100"
                          autoComplete="off"
                          className="h-2 p-0 bg-[var(--bg-secondary-color)] border-[var(--text-primary-color)]/10 rounded-lg appearance-none cursor-pointer accent-[var(--r-primary-color)]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      )}

      {!cvThequeCritere || isLoading ? (
        <>
          <Skeleton className="min-h-full w-64 bg-[var(--bg-primary-color)] rounded-xl" />
          <Skeleton className="min-h-full flex-1 bg-[var(--bg-primary-color)] rounded-xl" />
        </>
      ) : (
        <>
          <div className="w-64 min-w-64 flex flex-col gap-6 bg-[var(--bg-secondary-color)] rounded-lg shadow-sm p-4">
            <h2 className="font-medium text-xl text-[var(--text-primary-color)]">
              Talents disponibles
            </h2>
            {cvThequeCritere.cvMinutes &&
              cvThequeCritere.cvMinutes.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="w-full flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={`w-8 h-8 flex items-center justify-center text-[var(--text-primary-color)] ${
                          currentPage === 1
                            ? 'opacity-50 pointer-events-none'
                            : 'hover:text-[var(--r-primary-color)] transition-colors cursor-pointer'
                        }`}
                        disabled={currentPage === 1}
                      >
                        ←
                      </button>
                      <div className="flex items-center">
                        {getDisplayedPages().map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                              currentPage === pageNum
                                ? 'bg-[var(--r-primary-color)]/20 text-[var(--r-primary-color)] font-medium'
                                : 'text-[var(--text-secondary-gray)] hover:text-[var(--r-primary-color)] cursor-pointer'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1),
                          )
                        }
                        className={`w-8 h-8 flex items-center justify-center text-[var(--text-primary-color)] ${
                          currentPage === totalPages
                            ? 'opacity-50 pointer-events-none'
                            : 'hover:text-[var(--r-primary-color)] transition-colors cursor-pointer'
                        }`}
                        disabled={currentPage === totalPages}
                      >
                        →
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {cvThequeCritere &&
                      getCurrentPageItems()?.map((c) => (
                        <Link
                          key={`cv-minute-${c.id}`}
                          href={`/cvtheque/${cvThequeCritere.id}/cv-anonym/${c.id}`}
                          onClick={() => setRedirectLoading(c.id)}
                          className={`w-full flex items-center gap-2 p-3 text-left rounded-lg transition-colors ${
                            cvAnonym?.id === c.id || redirectLoading === c.id
                              ? 'bg-[var(--r-primary-color)]/20 text-[var(--r-primary-color)] font-medium'
                              : 'bg-[var(--bg-primary-color)] text-[var(--text-primary-color)] hover:text-[var(--r-primary-color)] cursor-pointer'
                          }`}
                        >
                          {redirectLoading === c.id && !cvAnonym && (
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
                          <span>{c.name}</span>
                        </Link>
                      ))}
                  </div>
                  <button
                    onClick={handleResendSearch}
                    className={`w-full flex items-center justify-center gap-2 p-2 bg-[var(--r-primary-color)] text-white rounded-lg ${
                      isLoadingSearch
                        ? 'opacity-80 pointer-events-none'
                        : 'hover:opacity-80 cursor-pointer'
                    }`}
                  >
                    {isLoadingSearch && (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-5 h-5 text-white animate-spin"
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
                    <span>Relancer la recherche</span>
                  </button>
                </>
              )}
          </div>

          <div
            className={`flex-1 flex flex-col gap-4 bg-[var(--bg-secondary-color)] rounded-lg shadow-sm p-4 overflow-auto ${
              showCritere ? 'w-[calc(100%-17.5rem)]' : 'w-[37rem]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--r-primary-color)] to-[#22D3EE] bg-clip-text text-transparent">
                  {cvAnonym?.name || 'Sélectionnez un profil'}
                </h2>
                {cvAnonym && (
                  <div className="flex items-center gap-2">
                    <i
                      onClick={increaseFontSize}
                      className="h-8 w-8 flex justify-center items-center text-[var(--text-primary-color)] hover:bg-[var(--text-primary-color)]/10 cursor-pointer rounded-[0.35em]"
                    >
                      <ZoomIn size={20} />
                    </i>
                    <i
                      onClick={decreaseFontSize}
                      className="h-8 w-8 flex justify-center items-center text-[var(--text-primary-color)] hover:bg-[var(--text-primary-color)]/10 cursor-pointer rounded-[0.35em]"
                    >
                      <ZoomOut size={20} />
                    </i>
                  </div>
                )}
              </div>
              {cvAnonym?.cvThequeContacts &&
              cvAnonym.cvThequeContacts
                .map((c) => c.userId)
                .includes(cvAnonym.userId) ? (
                <button
                  onClick={() => setShowMessage(true)}
                  className={`px-4 py-2 bg-[var(--r-primary-color)]/10 hover:bg-[var(--r-primary-color)]/20 text-[var(--r-primary-color)] rounded-lg select-none ${
                    cvAnonym
                      ? 'hover:opacity-80 cursor-pointer'
                      : 'pointer-events-none'
                  }`}
                >
                  Message envoyé
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (cvAnonym) {
                      setShowContact(true);
                    }
                  }}
                  className={`px-4 py-2 bg-[var(--r-primary-color)] text-white rounded-lg select-none ${
                    cvAnonym
                      ? 'hover:opacity-80 cursor-pointer'
                      : 'pointer-events-none'
                  }`}
                >
                  Contacter
                </button>
              )}
            </div>

            <div className="relative flex-1 bg-[var(--bg-primary-color)] rounded-lg overflow-auto">
              {cvThequeCritere.cvMinutes &&
              cvThequeCritere.cvMinutes.length > 0 ? (
                children
              ) : (
                <div className="h-full w-full flex justify-center items-center">
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-6 text-3xl text-[var(--text-secondary-gray)]">
                      <Inbox size={50} />
                      <p>Aucun resultat trouvé</p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={handleResendSearch}
                        className={`w-max flex items-center justify-center gap-2 px-8 py-3 bg-[var(--r-primary-color)] text-white text-lg rounded-xl ${
                          isLoadingSearch
                            ? 'opacity-80 pointer-events-none'
                            : 'hover:opacity-80 cursor-pointer'
                        }`}
                      >
                        {isLoadingSearch && (
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-5 h-5 text-white animate-spin"
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
                        <span>Relancer la recherche</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {showContact && (
        <Popup large onClose={() => setShowContact(false)}>
          <ContactModal onClose={() => setShowContact(false)} />
        </Popup>
      )}

      {showMessage && cvAnonym && cvAnonym.cvThequeContacts && (
        <Popup large onClose={() => setShowMessage(false)}>
          <div className="w-[40rem] rounded-xl ps-6 pe-2 pt-2 pb-6">
            <div className="relative h-full w-full">
              <div className="absolute top-0 left-0 z-10 w-full h-14 bg-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span className="text-gray-900">Message envoyé à </span>
                  <span className="bg-gradient-to-r from-[var(--r-primary-color)] to-[#22D3EE] bg-clip-text text-transparent">
                    {cvAnonym.name}
                  </span>
                </h2>
              </div>

              <div className="max-h-[80vh] h-full pt-14 pe-4 overflow-y-auto [&::-webkit-scrollbar]:w-[0.325rem] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
                <div className="flex flex-col gap-6">
                  <TextEditor
                    readOnly
                    content={
                      cvAnonym.cvThequeContacts.find(
                        (c) => c.userId === cvAnonym.userId,
                      )?.message ?? ''
                    }
                    className="readOnlyEditor"
                  />
                </div>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
