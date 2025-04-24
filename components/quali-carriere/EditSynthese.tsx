'use client';

import React from 'react';
import PrimaryButton from '../utils/PrimaryButton';

import { X } from 'lucide-react';
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
import { updateCvMinuteSectionService } from '@/services/cvMinute.service';
import { isSameData } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { updateCvMinuteReducer } from '@/redux/slices/cvMinute.slice';
import { RootState } from '@/redux/store';

interface FieldInterface {
  key: string;
  label: string;
  placeholder: string;
  description?: string;
  example?: string;
  value: string | number;
  type: 'input' | 'textarea' | 'text' | 'color';
  initialValue: string | number;
  requiredError: string;
  trim?: boolean;
  show?: boolean;
}

interface PopupInterface {
  align?: 'left' | 'right';
  large?: boolean;
  hidden?: boolean;
  static?: boolean;
  title?: string;
  conseil?: string;
  openly?: boolean;
  section?: string;
  suggestionTitle?: string;
  suggestionKey?: string;
  actionLabel?: string;
  compare?: boolean;
  type?: string;
  fields: FieldInterface[];
  sectionInfoId?: number;
  cvMinuteSectionId?: number;
  deleteLoading?: boolean;
  withScore?: boolean;
  onClick?: () => Promise<void>;
  onGenerate?: () => Promise<void>;
  onShowGuide?: () => void;
  onShowVideo?: () => void;

  updateBg?: boolean;
  newSection?: boolean;
  updateExperience?: boolean;
  updateContactSection?: boolean;
  updateCvMinuteSection?: boolean;
}

interface EditSyntheseInterface {
  popup: PopupInterface;
  cvMinuteId: number;
  currentPosition: { x: number; y: number };
  handleClosePopup: () => void;
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function EditSynthese({
  popup,
  cvMinuteId,
  currentPosition,
  handleClosePopup,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
}: EditSyntheseInterface) {
  const dispatch = useDispatch();
  const { fontSize } = useSelector((state: RootState) => state.persistInfos);

  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = React.useState(false);

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
      if (popup.compare !== false && isSameData(defaultValues, parseRes.data)) {
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
        primaryBg,
        secondaryBg,
        tertiaryBg,
        sectionInfoId: popup.sectionInfoId,
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
        popup.large ? 'w-[35em]' : 'w-[20em]'
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
        className={`flex gap-[0.5em] p-[0.75em] max-h-[calc(100vh-8rem)] ${
          popup.hidden === false
            ? 'overflow-y-visible'
            : 'overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300'
        }`}
      >
        <div className="flex-1 flex flex-col gap-[1em]">
          {popup.title && (
            <h3 className="text-center text-[1.125em] font-semibold tracking-wide px-[1em] select-none">
              {popup.title}
            </h3>
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
                                    {field.type === 'textarea' ? (
                                      <Textarea
                                        {...formField}
                                        autoComplete="off"
                                        className="flex-1 min-h-[5em] px-[0.75em] py-[0.25em] rounded-[0.325em] !text-[0.875em] !placeholder:text-[1em] resize-none"
                                        placeholder={field.placeholder}
                                        required
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

                {popup.openly && suggestions.length === 0 && (
                  <div className="flex flex-col gap-[0.5em]">
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
        </div>
      </div>
    </div>
  );
}
