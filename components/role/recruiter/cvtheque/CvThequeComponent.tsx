'use client';

import React from 'react';

import { toast } from 'sonner';
import { X, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';
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
import { Textarea } from '@/components/ui/textarea';
import { addCvThequeCritereService } from '@/services/role/recruiter/cvtheque.service';
import { useRouter } from 'next/navigation';

export const cvThequeCritereSchema = z.object({
  position: z.string().trim().min(5, "Offre d'emploi requis"),
  description: z.string().trim().optional(),
  domain: z.string().trim().min(1, 'Domaine requis'),
  competences: z.array(z.string()),
  experience: z.union([z.number().min(0), z.literal('')]),
  diplome: z.string().trim().optional(),
  localisation: z.string().trim().optional(),
  distance: z.union([z.number().min(0), z.literal('')]),
});

export type CvThequeCritereFormValues = z.infer<typeof cvThequeCritereSchema>;

export default function CvThequeComponent() {
  const { showCritere, mode } = useSelector(
    (state: RootState) => state.persistInfos,
  );

  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const [showAddCompetence, setShowAddCompetence] = React.useState(false);
  const [competence, setCompetence] = React.useState('');

  const form = useForm<CvThequeCritereFormValues>({
    resolver: zodResolver(cvThequeCritereSchema),
    defaultValues: {
      position: '',
      description: '',
      domain: '',
      competences: [],
      experience: '',
      diplome: '',
      localisation: '',
      distance: 0,
    },
  });

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

    if (parseRes.success) {
      setIsLoading(true);
      const res = await addCvThequeCritereService({
        position: parseRes.data.position,
        description: parseRes.data.description,
        domain: parseRes.data.domain,
        competences: parseRes.data.competences,
        experience:
          typeof parseRes.data.experience === 'number'
            ? parseRes.data.experience
            : undefined,
        diplome: parseRes.data.diplome,
        localisation: parseRes.data.localisation,
        distance:
          typeof parseRes.data.distance === 'number'
            ? parseRes.data.distance
            : undefined,
      });

      if (res.cvThequeCritere) {
        toast.success('Critères enregistrées !', {
          description: 'Recherche des talents en cours...',
        });
        router.push(`/cvtheque/${res.cvThequeCritere.id}`);
      }
    }
  };

  return (
    <div className="relative min-h-full w-full flex gap-6 py-8 px-12 bg-[var(--bg-tertiary-color)]">
      {showCritere && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-72">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--r-primary-color)] text-white rounded-md ${
                    isLoading
                      ? 'opacity-80 pointer-events-none'
                      : 'hover:opacity-80 cursor-pointer'
                  }`}
                >
                  {isLoading && (
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
                          autoFocus
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
                      <FormControl>
                        <div>
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
                              onOpenChange={(value) =>
                                setShowAddCompetence(value)
                              }
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
                        </div>
                      </FormControl>
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

                      <FormControl>
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
                              {educationLevels.map((e) => (
                                <SelectItem
                                  key={`education-level-${e}`}
                                  value={e}
                                  className={`h-8 ${
                                    field.value === e
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
                                  {e}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
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
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary-gray)]" />
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

      <div className="w-64 bg-[var(--bg-secondary-color)] rounded-lg shadow-sm p-4">
        <h2 className="font-medium mb-4 text-xl text-[var(--text-primary-color)]">
          Talents disponibles
        </h2>
      </div>

      <div className="flex-1 flex flex-col bg-[var(--bg-secondary-color)] rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--r-primary-color)] to-[#22D3EE] bg-clip-text text-transparent">
              Sélectionnez un profil
            </h2>
          </div>
          <button className="px-4 py-2 bg-[var(--r-primary-color)] text-white rounded-lg pointer-events-none">
            Contacter
          </button>
        </div>
        <div className="relative flex-1 bg-[var(--bg-primary-color)] rounded-lg overflow-auto">
          <div className="flex items-center justify-center h-full text-[var(--text-secondary-gray)]">
            Sélectionnez un profil pour voir le CV
          </div>
        </div>
      </div>
    </div>
  );
}
