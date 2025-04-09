'use client';

import React from 'react';
import TextEditor from '../editor/TextEditor';
import SelectIcon from '@/components/utils/SelectIcon';
import PrimaryButton from '@/components/utils/PrimaryButton';

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
import { FieldInterface, PopupInterface } from './CvPreview';
import { updateCvMinuteSectionService } from '@/services/cvMinute.service';
import { isSameData } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { updateCvMinuteReducer } from '@/redux/slices/cvMinute.slice';
import { DynamicIcon } from 'lucide-react/dynamic';
import { RootState } from '@/redux/store';
import { IconInterface } from '@/interfaces/icon.interface';

interface EditPopupInterface {
  popup: PopupInterface;
  cvMinuteId: number;
  currentPosition: { x: number; y: number };
  handleClosePopup: () => void;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void;
}

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
  const [icon, setIcon] = React.useState(
    popup.fields.find((f) => f.icon)?.icon,
  );
  const [iconSize, setIconSize] = React.useState(
    popup.fields.find((f) => f.iconSize)?.iconSize,
  );
  const [showIcons, setShowIcons] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

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
      const { content, sectionTitle, title, company, date, contrat } =
        parseRes.data;

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
        sectionId: popup.sectionId,
        sectionOrder: popup.sectionOrder,
        sectionInfoId: popup.sectionInfoId,
        sectionInfoOrder: popup.sectionInfoOrder,
        cvMinuteSectionId: popup.cvMinuteSectionId,

        newSection: popup.newSection,
        updateExperience: popup.updateExperience,
        updateContactSection: popup.updateContactSection,
        updateCvMinuteSection: popup.updateCvMinuteSection,
      });

      if (res.cvMinuteSection) {
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
      className={`z-50 fixed bg-white rounded-[0.5em] shadow-xl border-[0.0625em] border-gray-200 w-[20em]`}
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
            : 'overflow-y-auto overflow-x-hidden'
        }`}
      >
        {popup.title && (
          <h3 className="text-center text-[1.125em] font-semibold tracking-wide px-[1em] select-none">
            {popup.title}
          </h3>
        )}
        {popup.openly && popup.conseil && (
          <div className="flex flex-col gap-[0.25em]">
            <p className="text-[0.875em]">Nos conseils :</p>
            <p className="text-[0.6875em]">{popup.conseil}</p>
          </div>
        )}
        {popup.deleteLabel && <PrimaryButton label={popup.deleteLabel} />}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-[0.5em]"
          >
            <div className="flex flex-col gap-[0.25em]">
              {popup.fields.map((field) => (
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
                                  onClick={() => setShowIcons((prev) => !prev)}
                                  className={`h-[2.5em] w-[2.5em] flex justify-center items-center text-[0.875em] text-gray-700 border rounded-[0.25em] cursor-pointer ${
                                    showIcons
                                      ? 'bg-[var(--primary-color)] text-white'
                                      : 'hover:bg-gray-200'
                                  }`}
                                >
                                  <DynamicIcon
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
                                onChange={formField.onChange}
                                content={field.value.toString()}
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
                              (form.formState.errors[field.key] as FieldError)
                                ?.message
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
              ))}
            </div>

            {popup.openly && (
              <div className="flex flex-col gap-[0.5em]">
                <PrimaryButton
                  label={'Génerer des suggestions'}
                  icon={'unplug'}
                  size={fontSize}
                  rotate={90}
                />
                <p className="text-[0.75em] text-center text-gray-700">
                  Cliquer sur 'Génerer des suggestions pour obtenir des
                  propositions personnalisées'
                </p>
                {popup.suggestion && (
                  <div className="flex flex-col gap-[0.5em]">
                    <h3 className="text-[0.875em] text-center font-medium">
                      {popup.suggestionTitle}
                    </h3>
                    <div className="border p-[0.5em] rounded-sm">
                      <p className="text-[0.75em]">{popup.suggestion}</p>
                    </div>
                  </div>
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
      </div>
    </div>
  );
}
