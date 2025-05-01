'use client';

import React from 'react';

import { X, MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { educationLevels } from '@/lib/constants';
import { updatePersistReducer } from '@/redux/slices/persist.slice';
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
import { updateCvCritereService } from '@/services/role/recruiter/cvtheque.service';
import { setCvThequeReducer } from '@/redux/slices/role/recruiter/cvtheque.slice';

const cvCritereSchema = z.object({
  position: z.string().trim().min(5, "Offre d'emploi requis"),
  description: z.string().trim(),
  competences: z.array(z.string()),
  experience: z.preprocess((val) => {
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed === '') return undefined;
      const num = Number(trimmed);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }, z.number().min(0).optional()),
  diplome: z.union([
    z.enum(educationLevels.map((e) => e.value) as [string, ...string[]]),
    z.literal(''),
  ]),
  localisation: z.string().trim(),
  distance: z.number().min(0).optional(),
});

type CvCritereFormValues = z.infer<typeof cvCritereSchema>;

export default function CvThequeDetails() {
  const { cvCritere } = useSelector((state: RootState) => state.cvTheque);
  const { showCritere } = useSelector((state: RootState) => state.persistInfos);
  const dispatch = useDispatch();

  const [showAddCompetence, setShowAddCompetence] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [competence, setCompetence] = React.useState('');
  const [selectedCV, setSelectedCV] = React.useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState(1);

  const form = useForm<CvCritereFormValues>({
    resolver: zodResolver(cvCritereSchema),
    defaultValues: {
      position: cvCritere?.position,
      description: cvCritere?.description,
      competences: cvCritere?.cvCritereCompetences?.map((c) => c.content),
      experience: cvCritere?.experience,
      diplome: cvCritere?.diplome,
      localisation: cvCritere?.localisation,
      distance: cvCritere?.distance || 0,
    },
  });

  // Reset zoom when changing CV
  const handleCVSelect = (cv: string) => {
    setSelectedCV(cv);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const cvList = [
    ...Array(98)
      .fill(0)
      .map((_, i) => `Profil First ${i + 1}`),
  ];

  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 7;
  const itemsPerPage = 14;

  const getCurrentPageItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return cvList.slice(start, end);
  };

  const getDisplayedPages = () => {
    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
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

  const onSubmit = async (data: CvCritereFormValues) => {
    const parseRes = cvCritereSchema.safeParse(data);

    if (parseRes.success && cvCritere) {
      setIsLoading(true);
      const res = await updateCvCritereService({
        id: cvCritere?.id,
        position: parseRes.data.position,
        description: parseRes.data.description,
        competences: parseRes.data.competences,
        experience: parseRes.data.experience,
        diplome: parseRes.data.diplome,
        localisation: parseRes.data.localisation,
        distance: parseRes.data.distance,
      });

      if (res.cvCritere) {
        dispatch(setCvThequeReducer({ cvCritere: res.cvCritere }));
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col">
      <div className="w-full px-8 h-20 border-b border-gray-200 bg-white flex items-center">
        <div className="w-full flex items-center justify-between gap-6">
          <button
            onClick={() =>
              dispatch(updatePersistReducer({ showCritere: !showCritere }))
            }
            className="px-4 py-2 text-[var(--r-secondary-color)] font-bold hover:bg-[var(--r-primary-color)]/5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            {showCritere ? 'Masquer' : 'Afficher'} mes critères
          </button>
          <div className="flex items-center gap-4">
            <button className="text-[var(--r-primary-color)] px-4 py-2 rounded-lg bg-[var(--r-primary-color)]/5 hover:bg-[var(--r-primary-color)]/10 cursor-pointer">
              Enregistrer ma recherche
            </button>
            <button className="text-gray-600 hover:text-[var(--r-primary-color)] transition-colors px-4 py-2 rounded-lg hover:bg-gray-50">
              Historique
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-[calc(100vh-5rem)] bg-[#faf7f5] overflow-y-auto">
        <div className="min-h-full flex justify-center py-8 px-12">
          <div className="w-full flex gap-6">
            {showCritere && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-72">
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
                              className="text-sm font-medium text-gray-700"
                            >
                              Mon offre d'emploi *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                id="position"
                                autoComplete="off"
                                className="h-32 p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:!border-[var(--r-primary-color)] focus:!ring-2 focus:!ring-[var(--r-primary-color)]/20 resize-none"
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
                              className="text-sm font-medium text-gray-700"
                            >
                              Je recherche...
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                id="description"
                                autoComplete="off"
                                className="h-32 p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:!border-[var(--r-primary-color)] focus:!ring-2 focus:!ring-[var(--r-primary-color)]/20 resize-none"
                                placeholder="Décrivez vos critères de recherche..."
                              />
                            </FormControl>
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
                              className="text-sm font-medium text-gray-700"
                            >
                              Compétences
                            </FormLabel>
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((c) => (
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
                                  className="rounded-lg"
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
                                      className="w-full h-10 p-3 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:!border-[var(--r-primary-color)] focus:!ring-2 focus:!ring-[var(--r-primary-color)]/20"
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
                              className="text-sm font-medium text-gray-700"
                            >
                              Années d'expérience
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ''}
                                onChange={(event) => {
                                  if (
                                    event.target.value &&
                                    !isNaN(Number(event.target.value))
                                  ) {
                                    field.onChange(event);
                                  } else if (event.target.value === '') {
                                    field.onChange(event);
                                  }
                                }}
                                id="experience"
                                autoComplete="off"
                                className="h-12 p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:!border-[var(--r-primary-color)] focus:!ring-2 focus:!ring-[var(--r-primary-color)]/20"
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
                              className="text-sm font-medium text-gray-700"
                            >
                              Niveau de diplôme
                            </FormLabel>

                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full !h-12 p-3 bg-white data-[state=open]:border-[var(--r-primary-color)] data-[state=open]:ring-2 data-[state=open]:ring-[var(--r-primary-color)]/20">
                                <SelectValue placeholder="Choisir un niveau de diplôme" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {educationLevels.map((e) => (
                                    <SelectItem
                                      key={`education-level-${e.value}`}
                                      value={e.value}
                                      className={`h-8 ${
                                        form.getValues('diplome') === e.value
                                          ? '!text-[var(--r-primary-color)] [&_svg]:!text-[var(--r-primary-color)] !bg-accent'
                                          : 'hover:!text-[var(--r-primary-color)] !bg-transparent hover:!bg-accent'
                                      }`}
                                    >
                                      {e.label}
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
                              className="text-sm font-medium text-gray-700"
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
                                  className="h-12 pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:!border-[var(--r-primary-color)] focus:!ring-2 focus:!ring-[var(--r-primary-color)]/20"
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
                              className="text-sm font-medium text-gray-700"
                            >
                              Rayon: {field.value}km
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="distance"
                                type="range"
                                min="0"
                                max="100"
                                autoComplete="off"
                                className="h-2 p-0 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--r-primary-color)]"
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

            <div className="w-64 bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-medium mb-4">Talents disponibles</h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 mx-auto">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#06B6D4] transition-colors"
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
                            ? 'bg-[#06B6D4]/20 text-[#06B6D4] font-medium'
                            : 'text-gray-600 hover:text-[#06B6D4]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#06B6D4] transition-colors"
                    disabled={currentPage === totalPages}
                  >
                    →
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {getCurrentPageItems().map((cv, index) => (
                  <button
                    key={index}
                    onClick={() => handleCVSelect(cv)}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      selectedCV === cv
                        ? 'bg-[#06B6D4]/20 text-[#06B6D4] font-medium'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cv}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-white rounded-lg shadow-sm p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] bg-clip-text text-transparent">
                    {selectedCV || 'Sélectionnez un profil'}
                  </h2>
                  {selectedCV && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleZoomIn}
                        className="p-2 text-gray-500 hover:text-[#06B6D4] transition-colors rounded-full hover:bg-gray-100"
                        title="Zoom in"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </button>
                      {zoomLevel > 1 && (
                        <button
                          onClick={handleZoomOut}
                          className="p-2 text-gray-500 hover:text-[#06B6D4] transition-colors rounded-full hover:bg-gray-100"
                          title="Zoom out"
                        >
                          <ZoomOut className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <button className="px-4 py-2 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891b2] transition-colors">
                  Contacter
                </button>
              </div>
              <div
                className={`relative bg-gray-50 rounded-lg overflow-auto ${
                  zoomLevel > 1
                    ? 'h-[calc(100vh-12rem)]'
                    : 'aspect-[3/4] overflow-hidden'
                }`}
              >
                {selectedCV ? (
                  <div className="min-w-fit px-8 py-4">Selected CV</div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Sélectionnez un profil pour voir le CV
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
