import React from 'react';
import Image from 'next/image';
import DOMPurify from 'dompurify';

import { CvMinuteInterface } from '@/interfaces/role/user/cv-minute/cvMinute.interface';
import { SectionInterface } from '@/interfaces/role/user/cv-minute/section.interface';

export default function CvAnonymPreview({
  cvAnonym,
  sections,
}: {
  cvAnonym: CvMinuteInterface;
  sections: SectionInterface[];
}) {
  const getCvMinuteSection = (value: string) => {
    const section = sections.find((s) => s.name === value);
    return cvAnonym?.cvMinuteSections?.find((c) => c.sectionId === section?.id);
  };

  const title = getCvMinuteSection('title');
  const presentation = getCvMinuteSection('presentation');
  const experiences = getCvMinuteSection('experiences');

  const editableSections = sections.filter((s) => s.editable);

  const getParagraphCount = (html: string) => {
    const matches = html.match(/<p\b[^>]*>/g);
    return matches ? matches.length : 0;
  };

  const getSpacing = (length: number) => {
    if (length > 5) return 'leading-[2em]';
    if (length > 3) return 'leading-[2.5em]';
    return 'leading-[3em]';
  };

  if (cvAnonym)
    return (
      <div className="relative flex bg-white w-[50em] min-h-[70em] rounded-[0.75em] shadow-md">
        <div
          className="w-1/3 text-white p-[0.75em] rounded-l-[0.75em]"
          style={{ background: cvAnonym.primaryBg }}
        >
          <div className="h-full flex flex-col items-center">
            <div className="w-full flex flex-col gap-[0.75em]">
              <div className="flex justify-center">
                <label className="step-10 w-[10em] h-[10em] rounded-full bg-white flex items-center justify-center select-none">
                  <Image
                    src="/avatar.png"
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

            {editableSections.length > 0 && (
              <div className="flex-1 w-full flex flex-col">
                {editableSections.map((s) => {
                  const cvMinuteSection = getCvMinuteSection(s.name);
                  if (cvMinuteSection)
                    return (
                      <div
                        key={`editableSection-${s.id}`}
                        style={{ order: cvMinuteSection.sectionOrder }}
                        className="relative flex-1 w-full mt-[1em] p-[0.25em] transition-[order] duration-500"
                      >
                        <h3
                          className="uppercase bg-[#1A5F6B] py-[0.25em] px-[0.5em] font-semibold mb-[0.5em] text-[0.875em] select-none"
                          style={{ background: cvAnonym.secondaryBg }}
                        >
                          {cvMinuteSection?.sectionTitle}
                        </h3>
                        <div className="pl-[0.5em] text-[0.875em]">
                          {cvMinuteSection?.sectionInfos &&
                          cvMinuteSection?.sectionInfos.length > 0 ? (
                            <p className="whitespace-pre-line">
                              {cvMinuteSection.sectionInfos[0].content}
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
            <div>
              <h1 className="text-[1.75em] leading-[1.125em] font-bold text-[#101828]">
                {title?.sectionInfos?.[0]?.content ?? 'Titre du CV'}
              </h1>
            </div>
          )}

          {presentation && (
            <div>
              <p>
                {presentation?.sectionInfos?.[0]?.content ??
                  'Résumé du profil professionnel'}
              </p>
            </div>
          )}

          {experiences && (
            <div className="flex-1 flex flex-col gap-[0.5em]">
              <div>
                <h2
                  className="step-9 w-full uppercase text-[1.125em] font-semibold border-b-[0.125em]"
                  style={{
                    color: cvAnonym.primaryBg,
                    borderColor: cvAnonym.primaryBg,
                  }}
                >
                  Expériences professionnelles
                </h2>
              </div>

              {experiences?.sectionInfos &&
              experiences.sectionInfos.length > 0 ? (
                <div className="flex-1 flex flex-col justify-between gap-[0.375em]">
                  {experiences.sectionInfos.map((item) => (
                    <div
                      key={`experience-${item.id}`}
                      className="flex-1 flex flex-col gap-[0.5em] p-[0.25em]"
                      style={{ order: item.order }}
                    >
                      <div>
                        <div className="flex items-end gap-[0.5em] font-semibold">
                          <p
                            className="text-nowrap text-[0.875em] word-spacing"
                            style={{ color: cvAnonym.primaryBg }}
                          >
                            {item.date} :
                          </p>
                          <h3>{item.title}</h3>
                        </div>
                        <p
                          className="text-[0.75em] tracking-[0.025em] p-[0.25em]"
                          style={{ background: cvAnonym.tertiaryBg }}
                        >
                          {item.company} - <span>({item.contrat})</span>
                        </p>
                      </div>
                      <div
                        className={`text-[0.75em] ${getSpacing(
                          experiences.sectionInfos
                            ? (experiences.sectionInfos.length /
                                getParagraphCount(item.content)) *
                                experiences.sectionInfos.length
                            : 6,
                        )}`}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(item.content),
                        }}
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
          )}
        </div>
      </div>
    );
}
