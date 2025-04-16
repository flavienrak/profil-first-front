'use client';

import React from 'react';
import TextEditor from '../utils/TextEditor';
import SelectIcon from '@/components/utils/SelectIcon';
import PrimaryButton from '@/components/utils/PrimaryButton';
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
import { FieldInterface, PopupInterface } from './CvPreview';
import { updateCvMinuteSectionService } from '@/services/cvMinute.service';
import { isSameData } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { updateCvMinuteReducer } from '@/redux/slices/cvMinute.slice';
import { RootState } from '@/redux/store';
import { IconInterface } from '@/interfaces/icon.interface';
import { LucideIcon } from '../utils/LucideIcon';
import { SectionInfoInterface } from '@/interfaces/sectionInfo.interface';
import { AdviceInterface } from '@/interfaces/advice.interface';

interface EditPopupInterface {
  popup: PopupInterface;
  cvMinuteId: number;
  currentPosition: { x: number; y: number };
  handleClosePopup: () => void;
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const details = `Lorem ipsum dolor sit amet consectetur adipisicing elit. \n
Fugiat nulla, soluta illum placeat molestiae, optio quo quae minus animi rem fuga ducimus, \n
architecto totam exercitationem id quas ratione hic provident!\nLorem ipsum dolor sit amet consectetur adipisicing elit. \n\n`;
const disponibility = `Lorem ipsum dolor sit amet consectetur adipisicing elit. \n
Fugiat nulla, soluta illum placeat molestiae, optio quo quae minus animi rem fuga ducimus, \n
architecto totam exercitationem id quas ratione hic provident!\nLorem ipsum dolor sit amet consectetur adipisicing elit. \n\n`;

export default function EditPopup({
  popup,
  cvMinuteId,
  currentPosition,
  handleClosePopup,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
}: EditPopupInterface) {
  const dispatch = useDispatch();
  const { fontSize } = useSelector((state: RootState) => state.persistInfos);
  const { cvMinute, sections, cvMinuteSections } = useSelector(
    (state: RootState) => state.cvMinute,
  );
  const getCvMinuteSection = (value: string) => {
    const section = sections.find((s) => s.name === value);
    return cvMinuteSections.find((c) => c.sectionId === section?.id);
  };
  const experiences = getCvMinuteSection('experiences');

  const [experienceInfo, setExperienceInfo] =
    React.useState<SectionInfoInterface | null>(null);
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

  React.useEffect(() => {
    if (popup.withScore) {
      const sectionInfo = experiences?.sectionInfos.find(
        (item) => item.id === popup.sectionInfoId,
      );

      if (sectionInfo) {
        setExperienceInfo(sectionInfo);
      }
    }
  }, [experiences, popup.withScore, popup.sectionInfoId]);

  React.useEffect(() => {
    if (cvMinute?.advices && popup.suggestionKey === 'title') {
      setSuggestions(cvMinute.advices.filter((a) => a.type === 'suggestion'));
    } else if (cvMinuteSections && popup.suggestionKey === 'content') {
      const cvMinuteSection = cvMinuteSections.find(
        (s) => s.id === popup.cvMinuteSectionId,
      );

      const sectionInfo = cvMinuteSection?.sectionInfos.find(
        (s) => s.id === popup.sectionInfoId,
      );

      if (sectionInfo) {
        setSuggestions(
          sectionInfo.advices.filter((a) => a.type === 'suggestion'),
        );
      }
    }
  }, [cvMinute?.advices, cvMinuteSections, popup.suggestionKey]);

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
      form.setValue('content', value);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const parseRes = formSchema.safeParse(data);

    if (
      parseRes.success &&
      (((popup.updateCvMinuteSection ||
        popup.updateExperience ||
        popup.updateContactSection) &&
        popup.cvMinuteSectionId) ||
        popup.updateBg ||
        popup.newSection)
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
        company,
        date,
        contrat,
        primaryBg,
        secondaryBg,
        tertiaryBg,
      } = parseRes.data;

      const res = await updateCvMinuteSectionService({
        id: cvMinuteId,
        title,
        sectionTitle,
        content,
        company,
        date,
        contrat,
        icon,
        iconSize,
        primaryBg,
        secondaryBg,
        tertiaryBg,
        sectionOrder: popup.sectionOrder,
        sectionInfoId: popup.sectionInfoId,
        sectionInfoOrder: popup.sectionInfoOrder,
        cvMinuteSectionId: popup.cvMinuteSectionId,

        updateBg: popup.updateBg,
        newSection: popup.newSection,
        updateExperience: popup.updateExperience,
        updateContactSection: popup.updateContactSection,
        updateCvMinuteSection: popup.updateCvMinuteSection,
      });

      if (res.cvMinute) {
        dispatch(updateCvMinuteReducer({ cvMinute: res.cvMinute }));
        handleClosePopup();
      } else if (res.cvMinuteSection) {
        dispatch(
          updateCvMinuteReducer({
            section: res.section,
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
      className={`z-50 fixed bg-white rounded-[0.5em] shadow-xl border-[0.0625em] border-gray-200 ${
        popup.large ? 'w-[22.5em]' : 'w-[20em]'
      }`}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="p-[0.625em] border-b-[0.0625em] border-gray-200 flex items-center justify-end bg-[#F3EAFD] rounded-t-[0.5em] cursor-move"
      >
        <button
          onClick={handleClosePopup}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X className="w-[1em] h-[1em]" />
        </button>
      </div>

      <div
        className={`flex flex-col gap-[1em] p-[0.75em] max-h-[calc(100vh-8rem)] ${
          popup.hidden === false
            ? 'overflow-y-visible'
            : 'overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300'
        }`}
      >
        {popup.title && (
          <h3 className="text-center text-[1.125em] font-semibold tracking-wide px-[1em] select-none">
            {popup.title}
          </h3>
        )}
        {popup.conseil && (
          <div className="flex flex-col gap-[0.25em]">
            <p className="text-[0.875em] font-semibold">Nos conseils :</p>
            <p className="text-[0.725em] whitespace-pre-line">
              {popup.conseil}
            </p>
          </div>
        )}

        {popup.withScore && experienceInfo && (
          <div className="flex flex-col gap-[0.25em]">
            <div className="flex items-center gap-[0.75em]">
              <div className="flex items-center gap-[0.25em] w-1/2">
                <i className="text-[var(--primary-color)]">
                  <Lightbulb size={fontSize + 8} />
                </i>
                <p className="text-[0.75em] font-semibold">
                  {experienceInfo.title}
                </p>
              </div>
              {experienceInfo.evaluation && (
                <div className="w-1/2 flex items-center gap-[0.5em]">
                  <div className="relative flex-1 h-[0.5em] bg-[#e5e7eb] rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ffccd3] to-[#8B5CF6] rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          experienceInfo.evaluation.actualScore
                            ? experienceInfo.evaluation.actualScore
                            : experienceInfo.evaluation.initialScore
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-[0.875em] font-semibold text-primary">
                    {experienceInfo?.evaluation.actualScore
                      ? experienceInfo.evaluation.actualScore
                      : experienceInfo?.evaluation.initialScore}
                    %
                  </p>
                </div>
              )}
            </div>
            {experienceInfo.evaluation && (
              <div className="flex flex-col gap-[0.5em] p-[0.25em] rounded-[0.25em] bg-gray-100">
                <div
                  onClick={() => setOpenDetails((prev) => !prev)}
                  className="flex items-center justify-end gap-[0.25em] text-gray-600 cursor-pointer"
                >
                  <p className="font-semibold text-[0.625em] select-none">
                    Pourquoi ce score ?
                  </p>
                  <Triangle
                    size={fontSize - 8}
                    fill={'currentColor'}
                    className="rotate-[180deg]"
                  />
                </div>
                {openDetails && (
                  <div className="flex flex-col gap-[0.5em] text-[0.625em]">
                    {experienceInfo.evaluation.content && (
                      <div className="flex flex-col gap-[0.5em]">
                        <p className="font-semibold">🟢 Points forts :</p>
                        <ul className="list-none list-inside flex flex-col gap-[0.25em]">
                          {experienceInfo.evaluation.content
                            ?.split('\n')
                            .map((text, index) => (
                              <li key={`scoreHigh-${index}`}>✓ {text}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                    {experienceInfo.evaluation.weakContent && (
                      <div className="flex flex-col gap-[0.5em]">
                        <p className="font-semibold">🔴 Points à améliorer :</p>
                        <ul className="list-disc list-inside flex flex-col gap-[0.25em]">
                          {experienceInfo.evaluation.weakContent
                            ?.split('\n')
                            .map((text, index) => (
                              <li key={`socreWeak-${index}`}>{text}</li>
                            ))}
                        </ul>
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
            isLoading={loadingButton}
          />
        )}

        {popup.fields.length > 0 && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-[0.5em]"
            >
              <div className="flex flex-col gap-[0.25em]">
                {popup.fields.map(
                  (field) =>
                    field.show !== false && (
                      <FormField
                        key={field.key}
                        name={field.key}
                        control={form.control}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel asChild className="!text-[0.875em]">
                              <div className="w-full flex flex-col items-start font-normal">
                                <p>{field.label}</p>
                                {field.example && (
                                  <p className="text-[0.6em] font-bold">
                                    {field.example}
                                  </p>
                                )}
                              </div>
                            </FormLabel>
                            <FormControl>
                              <div className="flex flex-col gap-[0.5em]">
                                <div className="flex gap-[0.5em]">
                                  {icon && iconSize && (
                                    <div className="relative">
                                      {showIcons && (
                                        <SelectIcon
                                          icon={icon}
                                          size={iconSize}
                                          onChange={(value: IconInterface) => {
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
                                        className={`h-[2.5em] w-[2.5em] flex justify-center items-center text-[0.875em] text-gray-700 border rounded-[0.25em] cursor-pointer ${
                                          showIcons
                                            ? 'bg-[var(--primary-color)] text-white'
                                            : 'hover:bg-gray-200'
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
                                      className="flex-1 min-h-[5em] px-[0.75em] py-[0.25em] rounded-[0.325em] !text-[0.875em] !placeholder:text-[1em]"
                                      placeholder={field.placeholder}
                                      required
                                    />
                                  ) : field.type === 'text' ? (
                                    <TextEditor
                                      content={formField.value}
                                      onChange={formField.onChange}
                                    />
                                  ) : field.type === 'color' ? (
                                    <Input
                                      {...formField}
                                      type="color"
                                      className="flex-1 h-[2.5em] px-[0.25em] py-[0.125em] rounded-[0.325em]"
                                    />
                                  ) : (
                                    <Input
                                      {...formField}
                                      autoComplete="off"
                                      className="flex-1 h-[2.5em] px-[0.75em] py-[0.25em] rounded-[0.325em] !text-[0.875em] !placeholder:text-[1em]"
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
                                <FormDescription className="text-[0.75em]">
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
                <div className="flex flex-col gap-[0.5em]">
                  {suggestions.length > 0 ? (
                    <div className="flex flex-col gap-[0.5em] pb-[0.5em]">
                      <h3 className="text-[0.875em] text-center font-medium">
                        {popup.suggestionTitle}
                      </h3>
                      <ul className="list-disc list-inside flex flex-col gap-[0.5em]">
                        {suggestions.map((s) => (
                          <li
                            key={`suggestion-${s.id}`}
                            onClick={() => handleAddSuggestion(s.content)}
                            className="text-[0.75em] border p-[0.5em] rounded-[0.25em] hover:bg-gray-100 cursor-pointer"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(s.content),
                            }}
                          ></li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <>
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
                      />
                      <p className="text-[0.75em] text-center text-gray-700">
                        Cliquer sur 'Génerer des suggestions pour obtenir des
                        propositions personnalisées'
                      </p>
                    </>
                  )}
                </div>
              )}

              <PrimaryButton
                type="submit"
                label={`Enregistrer ${
                  popup.fields.length > 1 ? 'les' : 'la'
                } modification${popup.fields.length > 1 ? 's' : ''}`}
                isLoading={isLoading}
              />
            </form>
          </Form>
        )}

        {popup.static && (
          <div>
            {popup.type === 'desc' ? (
              <>
                <div className="flex flex-col gap-[0.25em]">
                  <p className="text-[0.875em]">Explications :</p>
                  <p className="text-[0.6875em] whitespace-pre-line">
                    {details}
                  </p>
                </div>
                <div className="flex flex-col gap-[0.25em]">
                  <p className="text-[0.875em]">Disponibilité :</p>
                  <p className="text-[0.6875em] whitespace-pre-line">
                    {disponibility}
                  </p>
                </div>

                <div className="flex flex-col gap-[1em]">
                  <PrimaryButton
                    onClick={popup.onShowGuide}
                    label="Je veux un guide de 30 secondes"
                  />
                  <PrimaryButton
                    onClick={popup.onShowVideo}
                    label="Visionner la vidéo explicative"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-[0.25em]">
                  <div className="flex items-center gap-[0.5em]">
                    <i className="text-red-400">
                      <Goal />
                    </i>
                    <p className="text-[0.875em] font-semibold">
                      Choisir les bonnes expériences :
                    </p>
                  </div>
                  <p className="text-[0.6875em] whitespace-pre-line">
                    {details}
                  </p>
                </div>
                <div className="flex flex-col gap-[0.25em]">
                  <div className="flex items-center gap-[0.5em]">
                    <i className="text-yellow-400">
                      <Scale />
                    </i>
                    <p className="text-[0.875em] font-semibold">
                      Equilibrer vos compétences :
                    </p>
                  </div>

                  <p className="text-[0.6875em] whitespace-pre-line">
                    {disponibility}
                  </p>
                </div>
                <div className="flex flex-col gap-[0.25em]">
                  <div className="flex items-center gap-[0.5em]">
                    <i className="text-blue-400">
                      <Globe />
                    </i>
                    <p className="text-[0.875em] font-semibold">Langues :</p>
                  </div>

                  <p className="text-[0.6875em] whitespace-pre-line">
                    {disponibility}
                  </p>
                </div>
                <div className="flex flex-col gap-[0.25em]">
                  <div className="flex items-center gap-[0.5em]">
                    <i className="text-red-500">
                      <Heart fill={'currentColor'} />
                    </i>
                    <p className="text-[0.875em] font-semibold">
                      Centres d'intérêt :
                    </p>
                  </div>
                  <p className="text-[0.6875em] whitespace-pre-line">
                    {disponibility}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
