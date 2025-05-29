'use client';

import React from 'react';
import TextEditor from '@/components/utils/TextEditor';
import SelectIcon from '@/components/utils/SelectIcon';
import PrimaryButton from '@/components/utils/role/user/button/PrimaryButton';
import DOMPurify from 'dompurify';

import {
  Globe,
  Goal,
  Heart,
  Lightbulb,
  Scale,
  Triangle,
  X,
} from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FieldInterface,
  PopupInterface,
} from '@/components/role/user/cv-minute/id/CvPreview';
import { updateCvMinuteSectionService } from '@/services/role/user/cvMinute.service';
import { isSameData } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateCvMinuteReducer,
  updateCvMinuteSectionReducer,
} from '@/redux/slices/role/user/cvMinute.slice';
import { RootState } from '@/redux/store';
import { IconInterface } from '@/interfaces/icon.interface';
import { LucideIcon } from '@/components/utils/LucideIcon';
import { AdviceInterface } from '@/interfaces/advice.interface';
import { CvMinuteSectionInterface } from '@/interfaces/role/user/cv-minute/cvMinuteSection.interface';

interface EditPopupInterface {
  popup: PopupInterface;
  cvMinuteId: number;
  currentPosition: { x: number; y: number };
  handleClosePopup: () => void;
  setCurrentPosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
}

const guides = [
  {
    label: `Sélectionnez des compétences qui correspondent directement aux exigences de l'offre d'emploi. Privilégiez les compétences techniques spécifiques et les savoir-faire concrets plutôt que des qualités génériques.
    `,
  },
  {
    label: `Incluez un mélange de compétences techniques (hard skills) et de compétences transversales (soft skills) pertinentes pour le poste. Idéalement, privilégiez 3 compétences techniques et 1 compétence transversale.
    `,
  },
  {
    label: `Précisez votre niveau pour chaque langue (débutant, intermédiare, courant, bilingue, langue maternelle). Les langues sont souvent un atout différenciant, surtout pour les postes internationaux.
    `,
  },
  {
    label: `Mentionnez des centres d'intérêt qui révèlent des qualités utiles pour le poste (sport d'équipe pour l'esprit collectif, activités créatives pour l'innovation, etc.) ou qui peuvent créer un lien avec le recruteur.
    `,
  },
];

export default function EditPopup({
  popup,
  cvMinuteId,
  currentPosition,
  handleClosePopup,
  setCurrentPosition,
}: EditPopupInterface) {
  const dispatch = useDispatch();
  const { fontSize } = useSelector((state: RootState) => state.persistInfos);
  const { cvMinute } = useSelector((state: RootState) => state.cvMinute);

  const experiences = cvMinute?.cvMinuteSections.filter(
    (c) => c.name === 'experiences',
  );

  const [actualExperience, setActualExperience] =
    React.useState<CvMinuteSectionInterface | null>(null);
  const [suggestions, setSuggestions] = React.useState<AdviceInterface[]>([]);

  const [icon, setIcon] = React.useState(
    popup.fields.find((f) => f.icon)?.icon,
  );
  const [iconSize, setIconSize] = React.useState(
    popup.fields.find((f) => f.iconSize)?.iconSize,
  );
  const [showIcons, setShowIcons] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);

  const [loadingButton, setLoadingButton] = React.useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = React.useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    // calcul de l'offset souris → coin du div
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // handler local pour le move, qui capture offsetX/offsetY
    const onMouseMove = (e: MouseEvent) => {
      setCurrentPosition({
        x: e.clientX - offsetX,
        y: e.clientY - offsetY,
      });
    };

    // handler local pour le up : enlève les deux listeners
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    // on attache aux events globaux
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  React.useEffect(() => {
    if (experiences && experiences.length > 0 && popup.withScore) {
      const actualExperience = experiences.find(
        (item) => item.id === popup.cvMinuteSectionId,
      );

      if (actualExperience) {
        setActualExperience(actualExperience);
      }
    }
  }, [experiences, popup.withScore]);

  React.useEffect(() => {
    if (cvMinute) {
      if (popup.suggestionKey === 'title') {
        setSuggestions(cvMinute.advices.filter((a) => a.type === 'suggestion'));
      } else if (popup.suggestionKey === 'content') {
        const cvMinuteSection = cvMinute.cvMinuteSections.find(
          (s) => s.id === popup.cvMinuteSectionId,
        );

        if (cvMinuteSection) {
          setSuggestions(
            cvMinuteSection.advices.filter((a) => a.type === 'suggestion'),
          );
        }
      }
    }
  }, [cvMinute.advices, cvMinute.cvMinuteSections, popup.suggestionKey]);

  const dynamicSchema = (fields: FieldInterface[]) => {
    const shape: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
      const key = field.key;
      // Base validator
      let validator = z.string();

      // Appliquer trim si field.trim est true ou non défini
      if (field.trim !== false) {
        validator = validator.trim();
      }

      // Appliquer min(1) avec le message d'erreur personnalisé
      validator = validator.min(1, field.requiredError);
      shape[key] = validator;
    });

    return z.object(shape);
  };

  const formSchema = dynamicSchema(popup.fields);
  type FormValues = z.infer<typeof formSchema>;
  const defaultValues = Object.fromEntries(
    popup.fields.map((field) => [field.key, field.initialValue]),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleAddSuggestion = async (value: string) => {
    if (popup.suggestionKey === 'title') {
      form.setValue('title', value);
    } else if (popup.suggestionKey === 'content') {
      if (popup.section === 'experience') {
        const currentContent = form.getValues('content') || '';
        form.setValue('content', `${currentContent} <p>${value}</p>`);
      } else {
        form.setValue('content', value);
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    const parseRes = formSchema.safeParse(data);

    if (
      parseRes.success &&
      (popup.updateName ||
        popup.updateFirstname ||
        popup.updateContact ||
        popup.updateEditableSection ||
        popup.updateTitle ||
        popup.updatePresentation ||
        popup.updateExperience ||
        popup.updateBg ||
        popup.newContact ||
        popup.newEditableSection ||
        popup.newExperience)
    ) {
      // API CALL
      if (
        !icon &&
        popup.compare !== false &&
        isSameData(defaultValues, parseRes.data)
      ) {
        handleClosePopup();
        return;
      }

      setIsLoading(true);
      const {
        content,
        sectionTitle,
        title,
        name,
        company,
        date,
        contrat,
        primaryBg,
        secondaryBg,
        tertiaryBg,
      } = parseRes.data;

      const res = await updateCvMinuteSectionService({
        id: cvMinuteId,
        name,
        sectionTitle,
        title,
        content,
        company,
        date,
        contrat,
        icon,
        iconSize,
        primaryBg,
        secondaryBg,
        tertiaryBg,
        cvMinuteSectionId: popup.cvMinuteSectionId,

        updateBg: popup.updateBg,
        updateName: popup.updateName,
        updateFirstname: popup.updateFirstname,
        updateContact: popup.updateContact,
        updateEditableSection: popup.updateEditableSection,
        updateTitle: popup.updateTitle,
        updatePresentation: popup.updatePresentation,
        updateExperience: popup.updateExperience,

        newContact: popup.newContact,
        newEditableSection: popup.newEditableSection,
        newExperience: popup.newExperience,
      });

      if (res.cvMinute) {
        dispatch(updateCvMinuteReducer({ cvMinute: res.cvMinute }));
        handleClosePopup();
      } else if (res.cvMinuteSection) {
        dispatch(
          updateCvMinuteSectionReducer({
            cvMinuteSection: res.cvMinuteSection,
          }),
        );
        handleClosePopup();
      } else if (res.sectionAlreadyExist) {
        form.setError('title', {
          type: 'manual',
          message: 'La rubrique existe déjà',
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`z-50 fixed bg-[var(--bg-secondary-color)] rounded-md shadow-xl border border-[var(--text-primary-color)]/10 ${
        popup.large && suggestions.length > 0 ? 'w-[40rem]' : 'w-[22rem]'
      }`}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="p-2.5 flex items-center justify-end bg-[var(--bg-purple)] rounded-t-md cursor-move"
      >
        <button
          onClick={handleClosePopup}
          className="text-[var(--text-primary-color)] hover:opacity-80 cursor-pointer"
        >
          <X size={22} />
        </button>
      </div>

      <div
        className={`max-h-[calc(100vh-9rem)] rounded-b-md overflow-y-auto ${
          popup.hidden === false
            ? 'overflow-y-visible'
            : 'overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300'
        }`}
      >
        <div className="flex gap-4 p-4">
          <div className="flex-1 flex flex-col gap-4">
            {popup.title && (
              <h3 className="text-center text-lg text-[var(--text-primary-color)] font-semibold tracking-wide px-4 select-none">
                {popup.title}
              </h3>
            )}
            {popup.conseil && (
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-[var(--text-primary-color)]">
                  Nos conseils :
                </p>
                <p className="text-sm whitespace-pre-line text-[var(--text-secondary-gray)]">
                  {popup.conseil}
                </p>
              </div>
            )}

            {popup.withScore && actualExperience && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-1/2">
                    <i className="text-[var(--u-primary-color)]">
                      <Lightbulb size={fontSize + 8} />
                    </i>
                    <p className="text-xs font-semibold text-[var(--text-primary-color)]">
                      {actualExperience.title}
                    </p>
                  </div>
                  {actualExperience.evaluation && (
                    <div className="w-1/2 flex items-center gap-2">
                      <div className="relative flex-1 h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ffccd3] to-[#8B5CF6] rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              actualExperience.evaluation.actualScore
                                ? actualExperience.evaluation.actualScore
                                : actualExperience.evaluation.initialScore
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-primary-color)]">
                        {actualExperience?.evaluation.actualScore
                          ? actualExperience.evaluation.actualScore
                          : actualExperience?.evaluation.initialScore}
                        %
                      </p>
                    </div>
                  )}
                </div>
                {actualExperience.evaluation && (
                  <div className="flex flex-col gap-2 p-2 rounded-sm bg-[var(--bg-primary-color)]">
                    <div
                      onClick={() => setOpenDetails((prev) => !prev)}
                      className="flex items-center justify-end gap-1 text-[var(--text-primary-color)] cursor-pointer"
                    >
                      <p className="font-semibold text-xs select-none">
                        Pourquoi ce score ?
                      </p>
                      <Triangle
                        size={fontSize - 8}
                        fill={'currentColor'}
                        className="rotate-[180deg]"
                      />
                    </div>
                    {openDetails && (
                      <div className="flex flex-col gap-2 text-xs">
                        {actualExperience.evaluation.content && (
                          <div className="flex flex-col gap-2">
                            <p className="font-semibold text-[var(--text-primary-color)]">
                              🟢 Points forts :
                            </p>
                            <div>
                              {actualExperience.evaluation.content
                                .split('✓')
                                .filter((sentence) => sentence.trim() !== '')
                                .map((sentence, index) => (
                                  <p
                                    key={`point-fort-${index}`}
                                    className="text-[var(--text-secondary-gray)]"
                                  >
                                    ✓ {sentence.trim()}
                                  </p>
                                ))}
                            </div>
                          </div>
                        )}
                        {actualExperience.evaluation.weakContent && (
                          <div className="flex flex-col gap-2">
                            <p className="font-semibold text-[var(--text-primary-color)]">
                              🔴 Points à améliorer :
                            </p>
                            <div>
                              {actualExperience.evaluation.weakContent
                                .split('•')
                                .filter((sentence) => sentence.trim() !== '')
                                .map((sentence, index) => (
                                  <p
                                    key={`point-fort-${index}`}
                                    className="text-[var(--text-secondary-gray)]"
                                  >
                                    • {sentence.trim()}
                                  </p>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {popup.actionLabel && (
              <PrimaryButton
                label={popup.actionLabel}
                onClick={async () => {
                  if (popup.onClick) {
                    setLoadingButton(true);
                    await popup.onClick();
                    setLoadingButton(false);
                  }
                }}
                className="rounded-sm py-2"
                isLoading={loadingButton}
              />
            )}

            {popup.fields.length > 0 && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-2"
                >
                  <div className="flex flex-col gap-1">
                    {popup.fields.map(
                      (field) =>
                        field.show !== false && (
                          <FormField
                            key={field.key}
                            name={field.key}
                            control={form.control}
                            render={({ field: formField }) => (
                              <FormItem className="flex flex-col gap-2">
                                <FormLabel>
                                  <div className="w-full flex flex-col gap-1 items-start font-normal">
                                    <p className="text-base text-[var(--text-primary-color)]">
                                      {field.label}
                                    </p>
                                    {field.example && (
                                      <p className="text-[0.6rem] font-bold text-[var(--text-secondary-gray)]">
                                        {field.example}
                                      </p>
                                    )}
                                  </div>
                                </FormLabel>
                                <FormControl>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                      {icon && iconSize && (
                                        <div className="relative">
                                          {showIcons && (
                                            <SelectIcon
                                              icon={icon}
                                              size={iconSize}
                                              onChange={(
                                                value: IconInterface,
                                              ) => {
                                                setIcon(value);
                                                setShowIcons(false);
                                              }}
                                              onChangeSize={(value: number) =>
                                                setIconSize(value)
                                              }
                                            />
                                          )}
                                          <i
                                            onClick={() =>
                                              setShowIcons((prev) => !prev)
                                            }
                                            className={`h-10 w-10 flex justify-center items-center text-sm text-[var(--text-primary-color)] border rounded-sm cursor-pointer ${
                                              showIcons
                                                ? 'bg-[var(--u-primary-color)] text-white'
                                                : 'hover:bg-[var(--bg-primary-color)]'
                                            }`}
                                          >
                                            <LucideIcon
                                              name={icon}
                                              size={iconSize * (fontSize / 16)}
                                            />
                                          </i>
                                        </div>
                                      )}
                                      {field.type === 'textarea' ? (
                                        <Textarea
                                          {...formField}
                                          autoComplete="off"
                                          className="flex-1 min-h-20 px-3 py-2 rounded-sm !text-sm !placeholder:text-sm text-[var(--text-primary-color)] placeholder:text-[var(--text-secondary-gray)] resize-none"
                                          placeholder={field.placeholder}
                                          required
                                        />
                                      ) : field.type === 'text' ? (
                                        <TextEditor
                                          dynamic
                                          content={formField.value}
                                          onChange={formField.onChange}
                                          className="border rounded-sm"
                                        />
                                      ) : field.type === 'color' ? (
                                        <Input
                                          {...formField}
                                          type="color"
                                          className="flex-1 h-10 px-1 py-1 text-[var(--text-primary-color)] placeholder:text-[var(--text-secondary-gray)] rounded-sm"
                                        />
                                      ) : (
                                        <Input
                                          {...formField}
                                          autoComplete="off"
                                          className="flex-1 h-10 px-3 py-1 rounded-sm !text-sm !placeholder:text-sm text-[var(--text-primary-color)] placeholder:text-[var(--text-secondary-gray)]"
                                          placeholder={field.placeholder}
                                          required
                                        />
                                      )}
                                    </div>
                                    <FormMessage className="text-xs">
                                      {
                                        (
                                          form.formState.errors[
                                            field.key
                                          ] as FieldError
                                        )?.message
                                      }
                                    </FormMessage>
                                    <FormDescription className="text-xs">
                                      {field.description}
                                    </FormDescription>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ),
                    )}
                  </div>

                  {popup.openly && (
                    <div className="flex flex-col gap-2">
                      <PrimaryButton
                        label={'Génerer des suggestions'}
                        icon={'unplug'}
                        size={fontSize}
                        rotate={90}
                        isLoading={loadingSuggestion}
                        onClick={async () => {
                          if (popup.onGenerate) {
                            setLoadingSuggestion(true);
                            await popup.onGenerate();
                            setLoadingSuggestion(false);
                          }
                        }}
                        className="rounded-sm py-2"
                      />
                      <p className="text-xs text-center text-[var(--text-secondary-gray)]">
                        Cliquer sur 'Génerer des suggestions pour obtenir des
                        propositions personnalisées'
                      </p>
                    </div>
                  )}

                  <PrimaryButton
                    type="submit"
                    label={`Enregistrer ${
                      popup.fields.length > 1 ? 'les' : 'la'
                    } modification${popup.fields.length > 1 ? 's' : ''}`}
                    isLoading={isLoading}
                    className="rounded-sm py-2"
                  />
                </form>
              </Form>
            )}

            {popup.static && (
              <div>
                {popup.type === 'desc' ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-[var(--text-primary-color)]">
                        Explications :
                      </p>
                      <p className="text-sm whitespace-pre-line text-[var(--text-secondary-gray)]">
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Cupiditate autem ab provident tempore nulla quae
                        ipsa expedita facilis nobis, omnis, dolores nostrum
                        vitae molestiae porro obcaecati dolor suscipit vel.
                        Molestias!
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-[var(--text-primary-color)]">
                        Disponibilité :
                      </p>
                      <p className="text-sm whitespace-pre-line text-[var(--text-secondary-gray)]">
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Cupiditate autem ab provident tempore nulla quae
                        ipsa expedita facilis nobis, omnis, dolores nostrum
                        vitae molestiae porro obcaecati dolor suscipit vel.
                        Molestias!
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <PrimaryButton
                        onClick={popup.onShowGuide}
                        label="Je veux un guide de 30 secondes"
                        className="py-2"
                      />
                      <PrimaryButton
                        onClick={popup.onShowVideo}
                        label="Visionner la vidéo explicative"
                        className="py-2"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <i className="text-red-400">
                          <Goal />
                        </i>
                        <p className="text-sm font-semibold">
                          Choisir les bonnes compétences :
                        </p>
                      </div>
                      <p className="text-xs whitespace-pre-line">
                        {guides[0].label}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <i className="text-yellow-400">
                          <Scale />
                        </i>
                        <p className="text-sm font-semibold">
                          Equilibrer vos compétences :
                        </p>
                      </div>

                      <p className="text-xs whitespace-pre-line">
                        {guides[1].label}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <i className="text-blue-400">
                          <Globe />
                        </i>
                        <p className="text-sm font-semibold">Langues :</p>
                      </div>

                      <p className="text-xs whitespace-pre-line">
                        {guides[2].label}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <i className="text-red-500">
                          <Heart fill={'currentColor'} />
                        </i>
                        <p className="text-sm font-semibold">
                          Centres d'intérêt :
                        </p>
                      </div>
                      <p className="text-xs whitespace-pre-line">
                        {guides[3].label}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="w-1/2 flex flex-col gap-2 pb-2">
              <h3 className="text-center font-medium text-[var(--text-primary-color)]">
                {popup.suggestionTitle}
              </h3>
              <ul className="list-disc list-inside flex flex-col gap-2">
                {suggestions.map((s) => (
                  <li
                    key={`suggestion-${s.id}`}
                    onClick={() => handleAddSuggestion(s.content)}
                    className="text-sm border p-2 rounded-sm text-[var(--text-primary-color)] hover:bg-[var(--bg-primary-color)] cursor-pointer"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(s.content),
                    }}
                  ></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
