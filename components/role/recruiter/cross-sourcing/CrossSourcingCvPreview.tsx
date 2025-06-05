'use client';

import React from 'react';
import Image from 'next/image';
import TextEditor from '@/components/utils/TextEditor';
import LucideIcon from '@/components/utils/LucideIcon';

import { updatePersistReducer } from '@/redux/slices/persist.slice';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { backendUri } from '@/providers/User.provider';
import { CvMinuteInterface } from '@/interfaces/role/user/cv-minute/cvMinute.interface';

export default function CrossSourcingCvPreview({
  cvMinute,
}: {
  cvMinute: CvMinuteInterface;
}) {
  const { fontSize, showFilter } = useSelector(
    (state: RootState) => state.persistInfos,
  );

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (showFilter && fontSize > 8) {
      dispatch(updatePersistReducer({ fontSize: 8 }));
    } else if (!showFilter && fontSize < 14) {
      dispatch(updatePersistReducer({ fontSize: 14 }));
    }
  }, [showFilter]);

  const getCvMinuteSection = (value: string) => {
    return cvMinute?.cvMinuteSections.find((c) => c.name === value);
  };

  const profile = getCvMinuteSection('profile');
  const name = getCvMinuteSection('name');
  const firstname = getCvMinuteSection('firstname');
  const title = getCvMinuteSection('title');
  const presentation = getCvMinuteSection('presentation');

  const contacts = cvMinute?.cvMinuteSections
    .filter((c) => c.name === 'contacts')
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  const experiences = cvMinute?.cvMinuteSections
    .filter((c) => c.name === 'experiences')
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  const editableSections = cvMinute?.cvMinuteSections
    .filter((s) => s.editable)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  if (cvMinute)
    return (
      <div
        className="w-full flex flex-col items-center gap-6"
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="relative flex bg-white w-[50em] min-h-[70em] rounded-[0.75em] shadow-md">
          <div
            className="w-1/3 text-white p-[0.75em] rounded-l-[0.75em]"
            style={{ background: cvMinute.primaryBg }}
          >
            <div className="h-full flex flex-col items-center">
              <div className="w-full flex flex-col gap-[0.75em]">
                {profile && (
                  <div className="flex justify-center">
                    <label
                      htmlFor="cvMinute-profile"
                      className="step-10 w-[10em] h-[10em] rounded-full bg-white flex items-center justify-center select-none"
                    >
                      {profile && profile.files.length > 0 ? (
                        <Image
                          src={`${backendUri}/uploads/files/user-${
                            cvMinute.userId
                          }/${profile.files[profile.files.length - 1].name}`}
                          alt="Profil"
                          height={160}
                          width={160}
                          className="object-cover h-full w-full rounded-full"
                        />
                      ) : (
                        <span className="text-[#99a1af]">Aucune photo</span>
                      )}
                    </label>
                  </div>
                )}

                <div>
                  {firstname && (
                    <h2 className="w-full text-[1em] text-center font-medium">
                      {firstname.content ?? 'Prénom(s)'}
                    </h2>
                  )}

                  {name && (
                    <h1 className="w-full text-[1.125em] text-center font-bold mb-3">
                      {name.content ?? 'NOM'}
                    </h1>
                  )}
                </div>
              </div>

              {contacts && contacts.length > 0 && (
                <div className="relative w-full flex flex-col justify-between text-[0.875em] px-[0.25em]">
                  {contacts.map((c) => (
                    <div
                      key={`contact-${c.id}`}
                      className="flex-1 flex items-center gap-[0.375em] p-[0.25em] group relative"
                    >
                      {c.icon && c.iconSize && (
                        <LucideIcon
                          name={c.icon}
                          size={c.iconSize * (fontSize / 16)}
                        />
                      )}
                      <p className="flex-1 max-w-[calc(100%-2em)] break-words">
                        {c.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {editableSections && editableSections.length > 0 && (
                <div className="flex-1 w-full flex flex-col">
                  {editableSections.map((s) => {
                    const cvMinuteSection = getCvMinuteSection(s.name);
                    if (cvMinuteSection)
                      return (
                        <div
                          key={`editableSection-${s.id}`}
                          className="relative flex-1 w-full mt-[1em] p-[0.25em]"
                        >
                          <h3
                            className="uppercase bg-[#1A5F6B] py-[0.25em] px-[0.5em] font-semibold mb-[0.5em] text-[0.875em] select-none"
                            style={{ background: cvMinute.secondaryBg }}
                          >
                            {cvMinuteSection.name}
                          </h3>
                          <div className="pl-[0.5em] text-[0.875em]">
                            {cvMinuteSection.content.trim().length > 0 ? (
                              <p className="whitespace-pre-line">
                                {cvMinuteSection.content}
                              </p>
                            ) : (
                              <p className="text-[0.875em] italic">
                                Aucune donnée ajoutée
                              </p>
                            )}
                          </div>
                        </div>
                      );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="w-2/3 flex flex-col gap-[0.75em] p-[1em]">
            {title && (
              <div className="step-7 flex justify-between items-center px-[0.25em] py-[0.25em]">
                <h1 className="text-[1.75em] leading-[1.125em] font-bold text-[#101828]">
                  {title.content}
                </h1>
              </div>
            )}

            {presentation && (
              <div className="step-8 flex justify-between text-[#364153] p-[0.5em] text-[0.875em] whitespace-pre-line">
                <p>{presentation.content}</p>
              </div>
            )}

            <div className="flex-1 flex flex-col gap-[0.5em]">
              <div className="relative p-[0.25em]">
                <h2
                  className="step-9 w-full uppercase text-[1.125em] font-semibold border-b-[0.125em]"
                  style={{
                    color: cvMinute.primaryBg,
                    borderColor: cvMinute.primaryBg,
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
                      className="flex-1 flex flex-col gap-[0.5em] p-[0.25em] text-[#101828]"
                    >
                      <div>
                        <div className="flex items-end gap-[0.5em] font-semibold">
                          <h3>
                            <span
                              className="text-nowrap word-spacing"
                              style={{ color: cvMinute.primaryBg }}
                            >
                              {item.date} :{' '}
                            </span>
                            {item.title}
                          </h3>
                        </div>
                        <p
                          className="text-[0.875em] tracking-[0.025em] p-[0.25em]"
                          style={{ background: cvMinute.tertiaryBg }}
                        >
                          {item.company} - <span>({item.contrat})</span>
                        </p>
                      </div>

                      <TextEditor
                        readOnly
                        content={item.content}
                        className="readOnlyEditor"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#6a7282] italic text-[0.875em] p-[0.25em]">
                  Aucune expérience ajoutée
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}
