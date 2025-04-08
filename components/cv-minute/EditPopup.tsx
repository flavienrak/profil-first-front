'use client';

import React from 'react';
import TextEditor from '../editor/TextEditor';
import SelectIcon from '@/components/utils/SelectIcon';
import PrimaryButton from '@/components/utils/PrimaryButton';

import { X } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
  const [showIcons, setShowIcons] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const dynamicSchema = (fields: FieldInterface[]) => {
    const shape: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
      const key = field.key;
      shape[key] = z.string().trim().min(1, `${field.label} requis`);
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

    if (parseRes.success && (popup.sectionId || popup.cvMinuteSectionId)) {
      // API CALL

      if (isSameData(defaultValues, parseRes.data)) {
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
        conseil,
        suggestion,
      } = parseRes.data;

      const res = await updateCvMinuteSectionService({
        id: cvMinuteId,
        content,
        sectionTitle,
        title,
        company,
        date,
        contrat,
        conseil,
        suggestion,
        sectionId: popup.sectionId,
        sectionOrder: popup.sectionOrder,
        sectionInfoId: popup.sectionInfoId,
        sectionInfoOrder: popup.sectionInfoOrder,
        cvMinuteSectionId: popup.cvMinuteSectionId,
      });
      if (res.cvMinuteSection) {
        dispatch(
          updateCvMinuteReducer({ cvMinuteSection: res.cvMinuteSection }),
        );
        handleClosePopup();
      }
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`z-50 fixed bg-white rounded-[0.5em] shadow-xl cursor-move border-[0.0625em] border-gray-200 w-[20em]`}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="p-[0.625em] border-b-[0.0625em] border-gray-200 flex items-center justify-end bg-[#F3EAFD] rounded-t-[0.5em]">
        <button
          onClick={handleClosePopup}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X className="w-[1em] h-[1em]" />
        </button>
      </div>

      <div
        className={`flex flex-col gap-[1em] p-[0.75em] max-h-[calc(100vh-8rem)] ${
          popup.hidden
            ? 'overflow-y-auto overflow-x-hidden'
            : 'overflow-y-visible'
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
                            {field.icon && field.size && (
                              <div className="relative">
                                {showIcons && (
                                  <SelectIcon
                                    icon={field.icon}
                                    size={field.size}
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
                                    name={field.icon}
                                    size={field.size}
                                  />
                                </i>
                              </div>
                            )}
                            {field.type === 'textarea' ? (
                              <Textarea
                                {...formField}
                                autoComplete="off"
                                className="flex-1 h-[3em] px-[0.75em] py-[0.25em] rounded-[0.325em] !text-[0.875em] !placeholder:text-[1em]"
                                placeholder={field.placeholder}
                                required
                              />
                            ) : field.type === 'text' ? (
                              <TextEditor />
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
              label={`Enregistrer ${
                popup.fields.length > 1 ? 'les' : 'la'
              } modification${popup.fields.length > 1 ? 's' : ''}`}
              type="submit"
              isLoading={isLoading}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
