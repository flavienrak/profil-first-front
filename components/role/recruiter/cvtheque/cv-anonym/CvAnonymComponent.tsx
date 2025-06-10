'use client';

import React from 'react';
import Image from 'next/image';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { getCvAnonymService } from '@/services/role/recruiter/cvtheque.service';
import { setCvAnonymReducer } from '@/redux/slices/role/recruiter/cvtheque.slice';
import { useParams, useRouter } from 'next/navigation';
import { updatePersistReducer } from '@/redux/slices/persist.slice';
import TextEditor from '@/components/utils/TextEditor';

export default function CvAnonymComponent() {
  const { fontSize, showCritere } = useSelector(
    (state: RootState) => state.persistInfos,
  );
  const { cvThequeCritere, cvAnonym } = useSelector(
    (state: RootState) => state.cvTheque,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  React.useEffect(() => {
    let isMounted = true;

    if (params.id && params.cvAnonymId) {
      if (isNaN(Number(params.id)) || !cvThequeCritere) {
        router.push('/cvtheque');
      } else if (isNaN(Number(params.cvAnonymId))) {
        router.push(`/cvtheque/${params.id}`);
      } else {
        (async () => {
          const res = await getCvAnonymService(
            cvThequeCritere.id,
            Number(params.cvAnonymId),
          );

          if (isMounted) {
            if (res.cvAnonym) {
              dispatch(
                setCvAnonymReducer({
                  cvAnonym: res.cvAnonym,
                  sections: res.sections,
                }),
              );
            } else {
              router.push(`/cvtheque/${params.id}`);
            }
          }
        })();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [params.id, params.cvAnonymId]);

  React.useEffect(() => {
    if (showCritere && fontSize > 11) {
      dispatch(updatePersistReducer({ fontSize: 11 }));
    } else if (!showCritere && fontSize < 16) {
      dispatch(updatePersistReducer({ fontSize: 16 }));
    }
  }, [showCritere]);

  const getCvMinuteSection = (value: string) => {
    return cvAnonym?.cvMinuteSections.find((c) => c.name === value);
  };

  const title = getCvMinuteSection('title');
  const presentation = getCvMinuteSection('presentation');

  const experiences = cvAnonym?.cvMinuteSections.filter(
    (c) => c.name === 'experiences',
  );
  const editableSections = cvAnonym?.cvMinuteSections.filter((s) => s.editable);

  const getParagraphCount = (html: string) => {
    const matches = html.match(/<p\b[^>]*>/g);
    return matches ? matches.length : 1;
  };

  const getTextStyle = (weight: number) => {
    // Clamp le résultat entre 0.65em et 1em
    const fontSize = Math.max(0.65, Math.min(1, 1 - weight * 0.005));

    return `text-[${fontSize.toFixed(3)}em]`;
  };

  if (cvAnonym)
    return (
      <div
        className="h-full w-full flex justify-center items-center"
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="flex bg-white w-[50em] min-h-[70em] rounded-[0.75em] shadow-md">
          <div className="w-1/3 text-white p-[0.75em] rounded-l-[0.75em] bg-gradient-to-r from-[var(--u-secondary-color)] to-[var(--r-primary-color)]">
            <div className="h-full flex flex-col items-center">
              <div className="w-full flex flex-col gap-[0.75em]">
                <div className="flex justify-center">
                  <label className="step-10 w-[10em] h-[10em] rounded-full flex items-center justify-center select-none">
                    <Image
                      src="/profil.png"
                      alt="Profil"
                      height={160}
                      width={160}
                      className="object-cover h-full w-full rounded-full"
                    />
                  </label>
                </div>

                <h2 className="text-xl text-center font-semibold">
                  {cvAnonym.name}
                </h2>
              </div>

              {editableSections && editableSections.length > 0 && (
                <div className="flex-1 w-full flex flex-col">
                  {editableSections.map((s) => (
                    <div
                      key={`editableSection-${s.id}`}
                      className="relative flex-1 w-full mt-[1em] p-[0.25em]"
                    >
                      <h3 className="uppercase bg-[var(--u-secondary-color)] py-[0.25em] px-[0.5em] font-semibold mb-[0.5em] text-[1.125em] select-none">
                        {s.name}
                      </h3>
                      <div className="pl-[0.5em] text-[1em]">
                        {s.content.trim().length > 0 ? (
                          <p className="whitespace-pre-line">{s.content}</p>
                        ) : (
                          <p className="text-[0.875em] italic">
                            Aucune donnée ajoutée
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-2/3 flex flex-col gap-[1em] p-[1em]">
            {title && (
              <h1 className="text-[1.75em] leading-[1.25em] font-bold text-[#101828]">
                {title.content ?? 'Titre du CV'}
              </h1>
            )}

            {presentation && (
              <p className="text-[1.15em]">
                {presentation.content ?? 'Résumé du profil professionnel'}
              </p>
            )}

            {experiences && (
              <div className="flex-1 flex flex-col gap-[0.5em]">
                <div>
                  <h2
                    className="step-9 w-full uppercase text-[1.25em] font-semibold border-b-[0.125em]"
                    style={{
                      color: cvAnonym.primaryBg,
                      borderColor: cvAnonym.primaryBg,
                    }}
                  >
                    Expériences professionnelles
                  </h2>
                </div>

                {experiences && experiences.length > 0 ? (
                  <div className="flex-1 flex flex-col justify-between gap-[0.375em]">
                    {experiences.map((item) => (
                      <div
                        key={`experience-${item.id}`}
                        className="flex-1 flex flex-col p-[0.25em]"
                      >
                        <div className="flex flex-col gap-[0.5em]">
                          <div className="flex items-center gap-[0.5em]">
                            <h3 className="text-[1.15em] leading-[1.3em] font-semibold">
                              <span
                                className="text-nowrap word-spacing"
                                style={{ color: cvAnonym.primaryBg }}
                              >
                                {item.date} :{' '}
                              </span>
                              {item.title}
                            </h3>
                          </div>
                          <p
                            className={`tracking-[0.025em] leading-[1.5em] px-[0.25em] ${getTextStyle(
                              experiences
                                ? (experiences.length /
                                    getParagraphCount(item.content)) *
                                    experiences.length
                                : 6,
                            )}`}
                            style={{ background: cvAnonym.tertiaryBg }}
                          >
                            {item.company}
                          </p>
                        </div>
                        <TextEditor readOnly content={item.content} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--text-secondary-gray)] italic text-[0.875em] p-[0.25em]">
                    Aucune expérience ajoutée
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
}
