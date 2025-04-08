'use client';

import React from 'react';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import EditPopup from './EditPopup';

import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  Download,
  Plus,
  Triangle,
  UserPlus,
  Zap,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { IconInterface } from '@/interfaces/icon.interface';
import { Tooltip, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { updatePersistReducer } from '@/redux/slices/persist.slice';

export interface FieldInterface {
  label: string;
  placeholder: string;
  description?: string;
  example?: string;
  value: string | number;
  icon?: IconInterface;
  size?: number;
  type: 'input' | 'textarea' | 'text';
  initialValue: string | number;
  key: string;
}

interface PopupInterface {
  align?: 'left' | 'right';
  hidden?: boolean;
  title?: string;
  conseil?: string;
  suggestionTitle?: string;
  suggestion?: string;
  deleteLabel?: string;
  editable: boolean;
  fields: FieldInterface[];
  sectionId?: number;
  sectionInfoId?: number;
}

const backendUri = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function CvPreview() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { fontSize } = useSelector((state: RootState) => state.persistInfos);
  const { cvMinute, files, sections, cvMinuteSections } = useSelector(
    (state: RootState) => state.cvMinute,
  );

  const getSection = (value: string) => {
    return sections.find((s) => s.name === value);
  };

  const getCvMinuteSection = (value: string) => {
    const section = sections.find((s) => s.name === value);
    return cvMinuteSections.find((c) => c.sectionId === section?.id);
  };

  const profileSection = getSection('profile');
  const nameSection = getSection('name');
  const firstnameSection = getSection('firstname');
  const titleSection = getSection('title');
  const presentationSection = getSection('presentation');
  const contactsSection = getSection('contacts');
  const experiencesSection = getSection('experiences');

  const profile = getCvMinuteSection('profile');
  const name = getCvMinuteSection('name');
  const firstname = getCvMinuteSection('firstname');
  const title = getCvMinuteSection('title');
  const presentation = getCvMinuteSection('presentation');
  const contacts = getCvMinuteSection('contacts');
  const experiences = getCvMinuteSection('experiences');

  const editableSections = sections.filter((s) => s.editable);

  const [file, setFile] = React.useState<File | null>(null);
  const [fileSrc, setFileSrc] = React.useState('');

  const [popup, setPopup] = React.useState<PopupInterface | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempData, setTempData] = React.useState<PopupInterface | null>(null);
  const [currentPosition, setCurrentPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

  const increaseFontSize = () => {
    dispatch(updatePersistReducer({ fontSize: fontSize + 1 }));
  };
  const decreaseFontSize = () => {
    dispatch(updatePersistReducer({ fontSize: fontSize - 1 }));
  };
  const resetFontSize = () => {
    dispatch(updatePersistReducer({ fontSize: 16 }));
  };

  const handleGetPosition = (
    event: React.MouseEvent,
    align: string,
    position?: { x?: number; y?: number },
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    let x;

    if (align === 'right') {
      x = rect.right + 20; // Position à droite
      if (x + 350 > window.innerWidth) {
        x = rect.left - 320 * (fontSize / 16); // Si dépassement, repositionner à gauche
      }
    } else {
      x = rect.left - 320 * (fontSize / 16); // Position à gauche
      if (x < 0) {
        x = rect.right + 10; // Si dépassement, repositionner à droite
      }
    }

    setCurrentPosition({
      x: position?.x ? position.x : x,
      y: position?.y ? position.y : rect.top * (fontSize / 16),
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setCurrentPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleOpenPopup = ({
    align,
    hidden,
    title,
    conseil,
    suggestionTitle,
    suggestion,
    deleteLabel,
    editable,
    sectionId,
    sectionInfoId,
    fields,
  }: PopupInterface) => {
    setIsOpen(true);
    setPopup({
      align,
      hidden,
      title,
      conseil,
      suggestionTitle,
      suggestion,
      deleteLabel,
      fields,
      editable,
      sectionId,
      sectionInfoId,
    });
  };

  const handleClosePopup = () => {
    setPopup(null);
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (tempData) {
      handleOpenPopup(tempData);
      setTempData(null);
    }
  }, [tempData]);

  return (
    <div className="flex justify-center flex-col">
      <div className="w-full px-8 h-20 border-b bg-white flex items-center">
        <div className="w-full flex justify-center items-center gap-5">
          <button className="flex justify-center items-center gap-2 h-12 px-6 rounded-[0.25em] text-[0.875em] font-semibold bg-gray-200 hover:opacity-90 cursor-pointer select-none">
            Guide de rédaction du CV
          </button>
          <button className="flex justify-center items-center gap-2 h-12 px-6 rounded-[0.25em] text-[0.875em] font-semibold bg-gray-200 hover:opacity-90 cursor-pointer select-none">
            Relire l’offre
          </button>
          <button className="flex justify-center items-center gap-2 h-12 px-6 rounded-[0.25em] text-[0.875em] font-semibold bg-gray-200 hover:opacity-90 cursor-pointer select-none">
            Matching score
          </button>
          <button className="flex justify-center items-center gap-2 h-12 px-6 rounded-[0.25em] text-[0.875em] font-semibold bg-gray-200 hover:opacity-90 cursor-pointer select-none">
            Optimiser en un clic
          </button>
          <button className="flex justify-center items-center gap-2 h-12 px-6 rounded-[0.25em] text-[0.875em] font-semibold bg-gray-200 hover:opacity-90 cursor-pointer select-none">
            Enregistrer le CV et l’offre
          </button>
          <button className="flex justify-center items-center gap-2 h-12 py-3 ps-4 pe-6 rounded-[0.25em] text-white bg-[var(--primary-color)] hover:opacity-90 cursor-pointer select-none">
            <Download />
            <span className="text-[0.875em] font-semibold">
              Télécharger le CV
            </span>
          </button>
        </div>
      </div>

      <div className="relative h-[calc(100vh-5rem)] overflow-y-auto">
        <div
          className="flex justify-center p-[2.5em]"
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="flex flex-col gap-[0.5em]">
            <div className="flex justify-end">
              <div className="flex items-center gap-[1em] p-[0.25em] rounded-md bg-white shadow">
                <i
                  onClick={increaseFontSize}
                  className="h-[2em] w-[2em] flex justify-center items-center hover:bg-gray-100 cursor-pointer rounded-[0.25em]"
                >
                  <ZoomIn className="h-[1.5em]" />
                </i>
                <i
                  onClick={decreaseFontSize}
                  className="h-[2em] w-[2em] flex justify-center items-center hover:bg-gray-100 cursor-pointer rounded-[0.25em]"
                >
                  <ZoomOut className="h-[1.5em]" />
                </i>
                <p
                  onClick={resetFontSize}
                  className="h-full px-[1em] flex justify-center items-center text-white text-[0.875em] rounded-md bg-[#2A7F8B] select-none hover:opacity-90 cursor-pointer"
                >
                  Reset
                </p>
              </div>
            </div>

            <div className="relative flex bg-white w-[50em] min-h-[50em] rounded-[0.75em] shadow-md">
              <div className="absolute -left-[3.5em] top-0 flex flex-col gap-[0.5em]">
                <TooltipProvider>
                  <Tooltip delayDuration={700}>
                    <TooltipTrigger asChild>
                      <i
                        onClick={(event) => {
                          const data: PopupInterface = {
                            title: 'Ajouter une rubrique',
                            conseil: 'Nos conseils',
                            suggestionTitle: 'Idées de rubrique',
                            suggestion: ' ',
                            editable: false,
                            sectionId: contactsSection?.id,
                            sectionInfoId: contacts?.sectionInfos[0]?.id,
                            fields: [
                              {
                                label: 'Nom de la rubrique',
                                type: 'input',
                                key: 'title',
                                placeholder: contacts?.sectionInfos.length
                                  ? contacts?.sectionInfos[0].content
                                  : 'Nom...',
                                value: contacts?.sectionInfos.length
                                  ? contacts?.sectionInfos[0].content
                                  : '',
                                initialValue: contacts?.sectionInfos.length
                                  ? contacts?.sectionInfos[0].content
                                  : '',
                              },
                              {
                                label: 'Description',
                                type: 'textarea',
                                key: 'content',
                                placeholder: contacts?.sectionInfos.length
                                  ? contacts?.sectionInfos[0].content
                                  : 'Description...',
                                value: contacts?.sectionInfos.length
                                  ? contacts?.sectionInfos[0].content
                                  : '',
                                initialValue: contacts?.sectionInfos.length
                                  ? contacts?.sectionInfos[0].content
                                  : '',
                              },
                            ],
                          };

                          handleGetPosition(event, 'left', { y: 80 });
                          if (isOpen) {
                            handleClosePopup();
                            setTempData(data);
                          } else {
                            handleOpenPopup(data);
                          }
                        }}
                        className="h-[2.5em] w-[2.5em] flex justify-center items-center shadow rounded-full bg-[#2A7F8B] text-white hover:opacity-90 cursor-pointer"
                      >
                        <Plus className="h-[1.5em]" />
                      </i>
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="bg-[#2A7F8B] text-white text-xs shadow px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
                    >
                      <p>Ajouter rubrique</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip delayDuration={700}>
                    <TooltipTrigger asChild>
                      <i
                        onClick={(event) => {
                          const data: PopupInterface = {
                            title: 'Ajouter vos contacts, liens, adresse...',
                            hidden: false,
                            editable: false,
                            sectionId: contactsSection?.id,
                            sectionInfoId: contacts?.sectionInfos[0]?.id,
                            fields: [
                              {
                                label: 'Adresse / Contacts / Liens',
                                type: 'input',
                                icon: 'globe',
                                size: 24,
                                key: 'content',
                                placeholder: contacts?.sectionInfos.length
                                  ? contacts?.sectionInfos[0].content
                                  : 'https://...',
                                value: contacts?.sectionInfos.length
                                  ? contacts?.sectionInfos[0].content
                                  : '',
                                initialValue: contacts?.sectionInfos.length
                                  ? contacts?.sectionInfos[0].content
                                  : '',
                              },
                            ],
                          };

                          handleGetPosition(event, 'left');
                          if (isOpen) {
                            handleClosePopup();
                            setTempData(data);
                          } else {
                            handleOpenPopup(data);
                          }
                        }}
                        className="h-[2.5em] w-[2.5em] flex justify-center items-center shadow rounded-full bg-[#2A7F8B] text-white hover:opacity-90 cursor-pointer"
                      >
                        <UserPlus className="h-[1.5em]" />
                      </i>
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="bg-[#2A7F8B] text-white text-xs shadow px-2 py-1 me-1 rounded-[0.25em]"
                    >
                      <p>Adresse & Contacts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="w-1/3 bg-[#2A7F8B] text-white p-[0.75em] rounded-l-[0.75em]">
                <div className="flex flex-col items-center">
                  <div className="w-full flex flex-col gap-[0.75em]">
                    <div className="flex justify-center">
                      <label
                        htmlFor="cv-profile"
                        className="w-[10em] h-[10em] rounded-full bg-white flex items-center justify-center select-none"
                      >
                        {user &&
                        profile?.sectionInfos &&
                        profile.sectionInfos.length > 0 ? (
                          <Image
                            src={`${backendUri}/uploads/files/${
                              user.id
                            }/${profile.sectionInfos.join('')}`}
                            alt="Profil"
                            height={160}
                            width={160}
                            className="object-cover h-full w-full rounded-full"
                          />
                        ) : (
                          <span className="text-gray-400">Votre photo ici</span>
                        )}
                        <input
                          id="cv-profile"
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <h2
                        onClick={(event) => {
                          const data: PopupInterface = {
                            editable: false,
                            sectionId: firstnameSection?.id,
                            sectionInfoId: firstname?.sectionInfos[0]?.id,
                            fields: [
                              {
                                label: 'Votre prénom',
                                type: 'input',
                                key: 'content',
                                placeholder: firstname?.sectionInfos.length
                                  ? firstname?.sectionInfos[0].content
                                  : 'Prénom',
                                value: firstname?.sectionInfos.length
                                  ? firstname?.sectionInfos[0].content
                                  : '',
                                initialValue: firstname?.sectionInfos.length
                                  ? firstname?.sectionInfos[0].content
                                  : '',
                              },
                            ],
                          };

                          handleGetPosition(event, 'left');
                          if (isOpen) {
                            handleClosePopup();
                            setTempData(data);
                          } else {
                            handleOpenPopup(data);
                          }
                        }}
                        className="w-full text-[1em] text-center font-medium hover:bg-gray-100/25"
                      >
                        {firstname?.sectionInfos.length
                          ? firstname.sectionInfos[0].content
                          : 'Prénom'}
                      </h2>
                      <h1
                        onClick={(event) => {
                          const data: PopupInterface = {
                            editable: false,
                            sectionId: nameSection?.id,
                            sectionInfoId: name?.sectionInfos[0]?.id,
                            fields: [
                              {
                                label: 'Votre nom',
                                type: 'input',
                                key: 'content',
                                placeholder: name?.sectionInfos.length
                                  ? name?.sectionInfos[0].content
                                  : 'Nom',
                                value: name?.sectionInfos.length
                                  ? name?.sectionInfos[0].content
                                  : '',
                                initialValue: name?.sectionInfos.length
                                  ? name?.sectionInfos[0].content
                                  : '',
                              },
                            ],
                          };

                          handleGetPosition(event, 'left');
                          if (isOpen) {
                            handleClosePopup();
                            setTempData(data);
                          } else {
                            handleOpenPopup(data);
                          }
                        }}
                        className="w-full text-[1.125em] text-center font-bold mb-3 hover:bg-gray-100/25"
                      >
                        {name?.sectionInfos.length
                          ? name.sectionInfos[0].content
                          : 'NOM'}
                      </h1>
                    </div>
                  </div>

                  {contacts?.sectionInfos &&
                    contacts.sectionInfos.length > 0 && (
                      <div className="relative w-full text-[0.875em] p-[0.25em]">
                        {contacts.sectionInfos.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center gap-[0.375em] group relative"
                          >
                            {c.icon && (
                              <div
                                style={{
                                  height: c.iconSize,
                                  width: c.iconSize,
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(c.icon),
                                }}
                              />
                            )}
                            <p className="flex-1 cursor-pointer">{c.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                  {editableSections.length > 0 &&
                    editableSections.map((s) => {
                      const section = getCvMinuteSection(s.name);
                      return (
                        <div
                          key={s.id}
                          onClick={(event) => {
                            const data: PopupInterface = {
                              title: 'Modifier ou supprimer la rubrique',
                              conseil: 'Nos conseils',
                              suggestionTitle: 'Idées de rubrique',
                              suggestion: ' ',
                              deleteLabel: 'Supprimer la rubrique',
                              editable: true,
                              sectionId: firstnameSection?.id,
                              sectionInfoId: section?.sectionInfos[0]?.id,
                              fields: [
                                {
                                  label: 'Nom de la rubrique',
                                  type: 'input',
                                  key: 'title',
                                  placeholder: section?.sectionInfos.length
                                    ? section.sectionInfos[0].content
                                    : 'Nom...',
                                  value: section?.sectionInfos.length
                                    ? section.sectionInfos[0].content
                                    : '',
                                  initialValue: section?.sectionInfos.length
                                    ? section.sectionInfos[0].content
                                    : '',
                                },
                                {
                                  label: 'Description',
                                  type: 'textarea',
                                  key: 'content',
                                  placeholder: section?.sectionInfos.length
                                    ? section.sectionInfos[0].content
                                    : 'Description...',
                                  value: section?.sectionInfos.length
                                    ? section.sectionInfos[0].content
                                    : '',
                                  initialValue: section?.sectionInfos.length
                                    ? section.sectionInfos[0].content
                                    : '',
                                },
                              ],
                            };

                            handleGetPosition(event, 'left', { y: 80 });
                            if (isOpen) {
                              handleClosePopup();
                              setTempData(data);
                            } else {
                              handleOpenPopup(data);
                            }
                          }}
                          className="relative w-full mt-[1em] hover:bg-gray-100/25 p-[0.25em]"
                        >
                          <h3 className="uppercase bg-[#1A5F6B] py-[0.25em] px-[0.75em] font-semibold mb-[0.5em] text-[0.875em] select-none">
                            {section?.sectionTitle}
                          </h3>
                          <div className="pl-[0.5em] text-[0.875em]">
                            {section?.sectionInfos &&
                            section?.sectionInfos.length > 0 ? (
                              <p>{section.sectionInfos[0].content}</p>
                            ) : (
                              <p className="text-[0.875em] italic">
                                Aucun diplôme ajouté
                              </p>
                            )}
                          </div>

                          <div className="absolute -left-[4em] top-0 flex flex-col gap-[0.5em]">
                            <TooltipProvider>
                              <Tooltip delayDuration={700}>
                                <TooltipTrigger asChild>
                                  <i className="text-[#2A7F8B] hover:opacity-90 cursor-pointer">
                                    <Zap
                                      fill={'currentColor'}
                                      size={fontSize + 12}
                                    />
                                  </i>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="left"
                                  className="bg-[#2A7F8B] text-white text-[0.875em] shadow px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
                                >
                                  <p>Modifier</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="w-2/3 flex flex-col gap-[0.75em] p-[1em]">
                <div
                  onClick={(event) => {
                    const data: PopupInterface = {
                      align: 'right',
                      title: 'Titre du CV',
                      conseil: 'Nos conseils',
                      suggestionTitle: 'Idées de titre du CV',
                      suggestion: ' ',
                      deleteLabel: 'Supprimer le titre',
                      editable: true,
                      sectionId: titleSection?.id,
                      sectionInfoId: title?.sectionInfos[0]?.id,
                      fields: [
                        {
                          label: 'Ajouter le titre du CV',
                          type: 'input',
                          key: 'content',
                          description:
                            'Si vous souhaitez un CV sans titre, mettez un espace',
                          placeholder: title?.sectionInfos.length
                            ? title.sectionInfos[0].content
                            : 'Titre...',
                          value: title?.sectionInfos.length
                            ? title.sectionInfos[0].content
                            : '',
                          initialValue: title?.sectionInfos.length
                            ? title.sectionInfos[0].content
                            : '',
                        },
                      ],
                    };

                    handleGetPosition(event, 'right', { y: 80 });
                    if (isOpen) {
                      handleClosePopup();
                      setTempData(data);
                    } else {
                      handleOpenPopup(data);
                    }
                  }}
                  className="flex justify-between items-center hover:bg-gray-100 px-[0.5em] py-[0.25em] rounded"
                >
                  <h1 className="text-[1.25em] font-bold text-gray-800">
                    {title?.sectionInfos.length
                      ? title.sectionInfos.join(' ')
                      : 'Titre du CV'}
                  </h1>
                </div>

                <div
                  onClick={(event) => {
                    const data: PopupInterface = {
                      align: 'right',
                      title: 'Ajouter une presentation',
                      conseil: 'Nos conseils',
                      suggestionTitle: 'Idées de présentation',
                      suggestion: ' ',
                      editable: true,
                      sectionId: titleSection?.id,
                      sectionInfoId: title?.sectionInfos[0]?.id,
                      fields: [
                        {
                          label: 'Présentation',
                          type: 'textarea',
                          key: 'content',
                          description:
                            'Si vous souhaitez un CV sans titre, mettez un espace',
                          placeholder: title?.sectionInfos.length
                            ? title.sectionInfos[0].content
                            : 'Présentation...',
                          value: title?.sectionInfos.length
                            ? title.sectionInfos[0].content
                            : '',
                          initialValue: title?.sectionInfos.length
                            ? title.sectionInfos[0].content
                            : '',
                        },
                      ],
                    };

                    handleGetPosition(event, 'right', { y: 80 });
                    if (isOpen) {
                      handleClosePopup();
                      setTempData(data);
                    } else {
                      handleOpenPopup(data);
                    }
                  }}
                  className="flex justify-between text-gray-700 hover:bg-gray-100 p-[0.5em] rounded text-[0.875em]"
                >
                  <p>
                    {presentation?.sectionInfos.length
                      ? presentation.sectionInfos.join(' ')
                      : 'Résumé du profil professionnel'}
                  </p>
                </div>

                <div className="flex flex-col gap-[0.5em]">
                  <div
                    onClick={(event) => {
                      const data: PopupInterface = {
                        align: 'right',
                        title: "Informations de l'expérience",
                        editable: false,
                        sectionId: experiencesSection?.id,
                        sectionInfoId: experiences?.sectionInfos[0]?.id,
                        fields: [
                          {
                            label: 'Titre du poste',
                            type: 'input',
                            key: 'title',
                            placeholder: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : 'Titre...',
                            value: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : '',
                            initialValue: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : '',
                          },
                          {
                            label: "Nom de l'entreprise",
                            type: 'input',
                            key: 'company',
                            placeholder: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : 'Entreprise...',
                            value: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : '',
                            initialValue: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : '',
                          },
                          {
                            label: 'Mois début - Mois fin',
                            example: 'Ex : 03-2023 05-2025',
                            type: 'input',
                            key: 'date',
                            placeholder: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : 'Mois...',
                            value: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : '',
                            initialValue: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : '',
                          },
                          {
                            label: 'Type de contrat',
                            example: 'Ex : CDI, CDD, Intérim...',
                            type: 'input',
                            key: 'contrat',
                            placeholder: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : 'Contrat...',
                            value: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : '',
                            initialValue: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : '',
                          },
                          {
                            label: 'Description',
                            type: 'text',
                            key: 'content',
                            placeholder: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : 'Description...',
                            value: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : '',
                            initialValue: experiences?.sectionInfos.length
                              ? experiences?.sectionInfos[0].content
                              : '',
                          },
                        ],
                      };

                      handleGetPosition(event, 'right', { y: 80 });
                      if (isOpen) {
                        handleClosePopup();
                        setTempData(data);
                      } else {
                        handleOpenPopup(data);
                      }
                    }}
                    className="relative p-[0.25em]"
                  >
                    <h2 className="w-full uppercase text-[1.125em] font-semibold text-[#2A7F8B] border-b-[0.125em] border-[#2A7F8B]">
                      Expériences professionnelles
                    </h2>

                    <div className="absolute -right-[4em] top-[0.125em]">
                      <TooltipProvider>
                        <Tooltip delayDuration={700}>
                          <TooltipTrigger asChild>
                            <i className="text-[#2A7F8B] hover:opacity-90 cursor-pointer">
                              <Triangle
                                size={fontSize + 12}
                                fill={'currentColor'}
                              />
                            </i>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="bg-[#2A7F8B] text-white text-xs shadow px-[0.5em] py-[0.25em] ms-[0.25em] rounded-[0.25em]"
                          >
                            <p>Ajouter expériences</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {experiences?.sectionInfos &&
                  experiences.sectionInfos.length > 0 ? (
                    <div className="flex flex-col gap-[0.375em]">
                      <div className="flex flex-col gap-[0.25em] p-[0.25em] hover:bg-gray-100">
                        <div className="flex gap-[0.5em] font-semibold">
                          <p className="text-nowrap text-[0.875em] text-[#2A7F8B] word-spacing">
                            05-2022 06-2024 :
                          </p>
                          <h3>Ingénieur structure - stage</h3>
                        </div>
                        <p className="text-[0.875em] tracking-wide p-[0.25em] bg-blue-200">
                          Apro Tank - <span>(CDI)</span>
                        </p>
                        <div
                          className="text-[0.65em]"
                          dangerouslySetInnerHTML={{
                            __html:
                              DOMPurify.sanitize(`<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis eveniet, nam atque doloribus nostrum quaerat
                mollitia rem ab dolor perferendis facilis odit nulla explicabo,
                nisi tenetur unde! Nam, aliquam tempore.</p>`),
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-[0.875em] p-[0.25em]">
                      Aucune expérience ajoutée
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {cvMinute && isOpen && popup && popup.sectionId && (
            <EditPopup
              cvMinuteId={cvMinute.id}
              align={popup.align}
              hidden={popup.hidden}
              title={popup.title}
              conseil={popup.conseil}
              suggestionTitle={popup.suggestionTitle}
              suggestion={popup.suggestion}
              deleteLabel={popup.deleteLabel}
              sectionId={popup.sectionId}
              sectionInfoId={popup.sectionInfoId}
              editable={popup.editable}
              fields={popup.fields}
              currentPosition={currentPosition}
              handleClosePopup={handleClosePopup}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
            />
          )}
        </div>
      </div>
    </div>
  );
}
