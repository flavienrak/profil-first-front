'use client';

import React from 'react';
import TextEditor from '@/components/utils/TextEditor';

import { addDays, subDays, startOfWeek, isSameDay, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { LucideIcon } from '@/components/utils/LucideIcon';
import { IconInterface } from '@/interfaces/icon.interface';
import { Calendar } from '@/components/ui/calendar';
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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { contactAnonymService } from '@/services/role/recruiter/cvtheque.service';
import { toast } from 'sonner';
import { addCvThequeContactReducer } from '@/redux/slices/role/recruiter/cvtheque.slice';

const interviewType: {
  value: string;
  icon: IconInterface;
  label: string;
  content: string;
}[] = [
  {
    value: 'phone',
    icon: 'phone',
    label: 'RDV téléphonique',
    content: 'une échange téléphonique',
  },
  {
    value: 'visio',
    icon: 'video',
    label: 'Entretien visio',
    content: 'un entretien visio',
  },
];

const contactSchema = z.object({
  type: z.enum(['phone', 'visio']),
  date: z.date(),
  hour: z.preprocess((val) => {
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed === '') return undefined;
      const num = Number(trimmed);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }, z.number().min(0).optional()),
  minute: z.preprocess((val) => {
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed === '') return undefined;
      const num = Number(trimmed);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }, z.number().min(0).optional()),
  message: z.string().trim().min(8, 'Message requis'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactModal({ onClose }: { onClose: () => void }) {
  const { user } = useSelector((state: RootState) => state.user);
  const { cvAnonym, cvThequeCritere } = useSelector(
    (state: RootState) => state.cvTheque,
  );
  const dispatch = useDispatch();

  const [showCalendar, setShowCalendar] = React.useState(false);
  const [textareaUpdated, setTextareaUpdated] = React.useState(false);
  const [dates, setDates] = React.useState<Date[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = React.useState(
    startOfWeek(new Date(), {
      weekStartsOn: 0,
      locale: fr,
    }),
  );
  const [isConfirm, setIsConfirm] = React.useState<ContactFormValues | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: 'phone',
      date: new Date(),
      hour: 8,
      minute: 0,
      message: '',
    },
  });

  const type = form.watch('type');
  const date = form.watch('date');
  const hour = form.watch('hour');
  const minute = form.watch('minute');

  React.useEffect(() => {
    const weekStart = startOfWeek(date, {
      weekStartsOn: 0,
      locale: fr,
    });
    setCurrentWeekStart(weekStart);

    if (!textareaUpdated) {
      form.setValue(
        'message',
        `<p> 
        Bonjour, 
        <br/>
        <br/>
        Votre profil a retenu notre attention.
        Seriez-vous disponible pour <b>${
          interviewType.find((item) => item.value === type)?.content
        } ce ${format(date, 'eeee d MMMM', {
          locale: fr,
        })} à ${hour}h${
          Number(minute) > 0 ? String(minute).padStart(2, '0') : '00'
        } ?</b>
        <br/>
        <br/>
        N'hésitez pas à me proposer un autre créneau si vous n'êtes pas disponible.
        <br/>
        <br/>
        Bien cordialement,
        <br/>
        <br/>
        ${user?.name}
        <br/>
        [Entreprise]
        </p>
        `,
      );
    }
  }, [textareaUpdated, type, date, hour, minute]);

  React.useEffect(() => {
    const weekDates = Array.from({ length: 7 }).map((_, i) =>
      addDays(currentWeekStart, i),
    );
    setDates(weekDates);
  }, [currentWeekStart]);

  const handlePreviousWeek = () => {
    setCurrentWeekStart((prev) => subDays(prev, 7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };

  const onSubmit = (data: ContactFormValues) => {
    const parseRes = contactSchema.safeParse(data);

    if (parseRes.success) {
      setIsConfirm(parseRes.data);
    }
  };

  const handleContact = async () => {
    if (
      cvThequeCritere &&
      cvAnonym &&
      isConfirm &&
      typeof isConfirm.hour === 'number' &&
      typeof isConfirm.minute === 'number'
    ) {
      setIsLoading(true);
      const res = await contactAnonymService({
        id: cvThequeCritere.id,
        cvAnonymId: cvAnonym.id,
        type: isConfirm.type,
        date: isConfirm.date,
        hour: isConfirm.hour,
        minute: isConfirm.minute,
        message: isConfirm.message,
      });

      if (res.cvThequeContact) {
        dispatch(
          addCvThequeContactReducer({ cvThequeContact: res.cvThequeContact }),
        );
        toast.success('Message envoyé avec succès !');
        onClose();
      }
      setIsLoading(false);
    }
  };

  if (cvAnonym)
    return (
      <div className="w-[40rem] rounded-xl ps-4 pe-2 py-2">
        <div className="relative h-full w-full">
          <div className="absolute top-0 left-0 z-10 w-full h-14 bg-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-gray-900">Contacter</span>
              <span className="bg-gradient-to-r from-[var(--r-primary-color)] to-[#22D3EE] bg-clip-text text-transparent">
                {cvAnonym.name}
              </span>
            </h2>
          </div>

          <div className="max-h-[80vh] h-full pt-14 pe-4 overflow-y-auto [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
            {isConfirm ? (
              <div className="flex flex-col gap-6">
                <TextEditor
                  readOnly
                  content={isConfirm.message}
                  className="readOnlyEditor"
                />

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsConfirm(null)}
                    className="w-40 py-3 text-[var(--r-primary-color)] border border-[var(--r-primary-color)] rounded-lg cursor-pointer hover:opacity-80 select-none"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={handleContact}
                    className={`w-40 flex justify-center items-center gap-2 py-3 bg-[var(--r-primary-color)] text-white rounded-lg select-none ${
                      isLoading
                        ? 'opacity-80 pointer-events-none'
                        : 'hover:opacity-80 cursor-pointer'
                    }`}
                  >
                    {isLoading && (
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
                    <span>Confirmer</span>
                  </button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="h-full w-full"
                >
                  <div className="flex flex-col gap-8">
                    <FormField
                      name="type"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex flex-col gap-2">
                              <p className="font-medium">
                                Type d'entretien proposé
                              </p>

                              <div className="flex gap-4 bg-[#00bcd4]/5 p-2 rounded-xl">
                                {interviewType.map((item) => (
                                  <p
                                    key={item.value}
                                    onClick={() => field.onChange(item.value)}
                                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${
                                      field.value === item.value
                                        ? 'bg-[var(--r-primary-color)] text-white'
                                        : 'bg-white text-gray-700 border border-[#00bcd4]/20 hover:text-[var(--r-primary-color)] cursor-pointer'
                                    }`}
                                  >
                                    <LucideIcon name={item.icon} size={22} />
                                    <span>{item.label}</span>
                                  </p>
                                ))}
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="date"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex flex-col gap-2">
                              <div className="relative flex items-center gap-4">
                                <p className="font-medium">Jour</p>
                                <Popover
                                  open={showCalendar}
                                  onOpenChange={(value) =>
                                    setShowCalendar(value)
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <p
                                      className={`flex items-center gap-2 text-[var(--r-primary-color)] px-3 py-1 rounded-lg select-none cursor-pointer ${
                                        showCalendar
                                          ? 'bg-[var(--r-primary-color)]/5'
                                          : 'hover:bg-[var(--r-primary-color)]/5'
                                      }`}
                                    >
                                      <LucideIcon name={'calendar'} />
                                      <span>Calendrier</span>
                                    </p>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    align="start"
                                    className="z-[100] p-0 w-max"
                                  >
                                    <Calendar
                                      mode="single"
                                      locale={fr}
                                      selected={field.value}
                                      onSelect={(value) => {
                                        if (value) {
                                          field.onChange(value);
                                          setShowCalendar(false);
                                        }
                                      }}
                                      classNames={{
                                        caption_label:
                                          'capitalize font-medium text-[var(--r-primary-color)]',
                                        nav_button:
                                          'size-7 flex justify-center items-center rounded-md bg-transparent p-0 opacity-50 hover:opacity-100 hover:text-[var(--r-primary-color)] hover:bg-[var(--r-primary-color)]/10hover:text-[var(--r-primary-color)] hover:bg-[var(--r-primary-color)]/10',
                                        nav_button_previous:
                                          'absolute cursor-pointer left-1 border-none',
                                        nav_button_next:
                                          'absolute cursor-pointer right-1 border-none',
                                        head: 'capitalize',
                                        head_row: 'flex gap-1',
                                        row: 'flex gap-1 mt-2',
                                        day: 'size-8 p-0 text-sm font-normal aria-selected:opacity-100 rounded-md cursor-pointer hover:text-[var(--r-primary-color)] hover:bg-[var(--r-primary-color)]/10',
                                        day_selected:
                                          '!bg-[var(--r-primary-color)] text-white hover:text-white',
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div className="flex items-center gap-2">
                                <p
                                  onClick={handlePreviousWeek}
                                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-[var(--r-primary-color)]/10 hover:text-[var(--r-primary-color)] transition-colors select-none cursor-pointer"
                                >
                                  ←
                                </p>
                                <div className="flex-1 flex flex-wrap justify-center gap-2">
                                  {dates.map((item) => (
                                    <div
                                      key={`contact-date-${item}`}
                                      onClick={() => field.onChange(item)}
                                      className={`w-28 py-2 rounded-md text-center transition-colors ${
                                        isSameDay(field.value, item)
                                          ? 'bg-[var(--r-primary-color)] text-white'
                                          : 'bg-white hover:text-[var(--r-primary-color)] hover:bg-[var(--r-primary-color)]/10 cursor-pointer'
                                      }`}
                                    >
                                      <p className="text-sm font-medium capitalize">
                                        {format(item, 'EEEE', { locale: fr })}
                                      </p>
                                      <p className="text-sm capitalize opacity-80">
                                        {format(item, 'd MMMM', { locale: fr })}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <p
                                  onClick={handleNextWeek}
                                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-[var(--r-primary-color)]/10 hover:text-[var(--r-primary-color)] transition-colors select-none cursor-pointer"
                                >
                                  →
                                </p>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-6 items-center">
                      <p className="font-medium">Heure</p>

                      <FormField
                        name="hour"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-4 justify-center">
                                <Input
                                  {...field}
                                  type="number"
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    if (
                                      value &&
                                      !isNaN(Number(value)) &&
                                      0 <= Number(value) &&
                                      Number(value) <= 23
                                    ) {
                                      field.onChange(Number(value));
                                    } else if (value === '') {
                                      field.onChange(value);
                                    }
                                  }}
                                  min="0"
                                  max="23"
                                  className="w-20 h-12 text-center !text-xl border rounded-lg"
                                />
                                <span className="text-4xl font-bold text-[var(--r-primary-color)]">
                                  H
                                </span>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="minute"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-4 justify-center">
                                <Input
                                  {...field}
                                  type="number"
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    if (
                                      !isNaN(Number(value)) &&
                                      0 <= Number(value) &&
                                      Number(value) <= 59
                                    ) {
                                      field.onChange(Number(value));
                                    } else if (value === '') {
                                      field.onChange(value);
                                    }
                                  }}
                                  min="0"
                                  max="59"
                                  className="w-20 h-12 text-center !text-xl border rounded-lg"
                                />
                                <span className="text-xl font-semibold text-[var(--r-primary-color)]">
                                  minutes
                                </span>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      name="message"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TextEditor
                              content={field.value}
                              onChange={(value) => {
                                if (!textareaUpdated) {
                                  setTextareaUpdated(true);
                                }
                                field.onChange(value);
                              }}
                              className="border rounded-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-xs">
                            {form.formState.errors.message?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="w-40 py-3 bg-[var(--r-primary-color)] text-white rounded-lg cursor-pointer hover:opacity-80 select-none"
                      >
                        Envoyer
                      </button>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    );
}
