'use client';

import React from 'react';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import EditPopup from './EditPopup';

import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  Brush,
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
import {
  deleteCvMinuteSectionService,
  deleteSectionInfoService,
  updateCvMinuteProfileService,
  updateCvMinuteSectionOrderService,
  updateSectionInfoOrderService,
} from '@/services/cvMinute.service';
import {
  updateSectionInfoOrderReducer,
  updateCvMinuteReducer,
  updateCvMinuteSectionOrderReducer,
  deleteSectionInfoReducer,
  deleteCvMinuteSectionReducer,
} from '@/redux/slices/cvMinute.slice';
import { DynamicIcon } from 'lucide-react/dynamic';

export interface FieldInterface {
  key: string;
  label: string;
  placeholder: string;
  description?: string;
  example?: string;
  value: string | number;
  icon?: IconInterface;
  iconSize?: number;
  type: 'input' | 'textarea' | 'text' | 'color';
  initialValue: string | number;
  requiredError: string;
  trim?: boolean;
}

export interface PopupInterface {
  align?: 'left' | 'right';
  hidden?: boolean;
  title?: string;
  conseil?: string;
  openly?: boolean;
  suggestionTitle?: string;
  suggestion?: string;
  deleteLabel?: string;
  compare?: boolean;
  fields: FieldInterface[];
  sectionOrder?: number;
  sectionInfoId?: number;
  sectionInfoOrder?: number;
  cvMinuteSectionId?: number;
  deleteLoading?: boolean;
  onDelete?: () => void;

  updateBg?: boolean;
  newSection?: boolean;
  updateExperience?: boolean;
  updateContactSection?: boolean;
  updateCvMinuteSection?: boolean;
}

type SectionType = 'contact' | 'cvMinuteSection' | 'experience';

const backendUri = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function CvPreview() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { fontSize } = useSelector((state: RootState) => state.persistInfos);
  const { cvMinute, files, sections, cvMinuteSections } = useSelector(
    (state: RootState) => state.cvMinute,
  );

  const getCvMinuteSection = (value: string) => {
    const section = sections.find((s) => s.name === value);
    return cvMinuteSections.find((c) => c.sectionId === section?.id);
  };

  const profile = getCvMinuteSection('profile');
  const name = getCvMinuteSection('name');
  const firstname = getCvMinuteSection('firstname');
  const title = getCvMinuteSection('title');
  const presentation = getCvMinuteSection('presentation');
  const contacts = getCvMinuteSection('contacts');
  const experiences = getCvMinuteSection('experiences');

  const profileImg = files.filter((f) => f.usage === 'cv-profile');
  const editableSections = sections.filter((s) => s.editable);

  const [sectionType, setSectionType] = React.useState<SectionType | null>(
    null,
  );
  const [draggingItem, setDraggingItem] = React.useState<number | null>(null);

  const [popup, setPopup] = React.useState<PopupInterface | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
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
        x = rect.left - 325 * (fontSize / 16); // Si dépassement, repositionner à gauche
      }
    } else {
      x = rect.left - 325 * (fontSize / 16); // Position à gauche
      if (x < 0) {
        x = rect.right + 10; // Si dépassement, repositionner à droite
      }
    }

    setCurrentPosition({
      x: position?.x ?? x,
      y: position?.y ?? rect.top * (fontSize / 16),
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

  const handleOpenPopup = (data: PopupInterface) => {
    setIsOpen(true);
    setPopup(data);
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

  const handleDragStart = ({
    dragId,
    type,
  }: {
    dragId: number;
    type: SectionType;
  }) => {
    setSectionType(type);
    setDraggingItem(dragId);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDropSectionInfo = async ({
    event,
    dropId,
    type,
    cvMinuteSectionId,
  }: {
    event: React.DragEvent<HTMLDivElement>;
    dropId: number;
    type: SectionType;
    cvMinuteSectionId: number;
  }) => {
    event.preventDefault();

    if (
      cvMinute &&
      draggingItem &&
      (sectionType === 'contact' || sectionType === 'experience') &&
      sectionType === type
    ) {
      const res = await updateSectionInfoOrderService({
        id: cvMinute.id,
        sectionInfoId: draggingItem,
        targetSectionInfoId: dropId,
      });

      if (res.section) {
        dispatch(
          updateSectionInfoOrderReducer({
            section: res.section,
            targetSection: res.targetSection,
            cvMinuteSectionId,
          }),
        );
      }
      setDraggingItem(null);
    }
  };

  const handleDropCvMinuteSection = async ({
    event,
    dropId,
  }: {
    event: React.DragEvent<HTMLDivElement>;
    dropId: number;
  }) => {
    event.preventDefault();

    if (cvMinute && draggingItem) {
      const res = await updateCvMinuteSectionOrderService({
        id: cvMinute.id,
        cvMinuteSectionId: draggingItem,
        targetCvMinuteSectionId: dropId,
      });

      if (res.cvMinuteSection) {
        dispatch(
          updateCvMinuteSectionOrderReducer({
            cvMinuteSection: res.cvMinuteSection,
            targetCvMinuteSection: res.targetCvMinuteSection,
          }),
        );
      }
      setDraggingItem(null);
    }
  };

  const handleChangeProfile = async ({
    event,
    sectionInfoId,
    cvMinuteSectionId,
  }: {
    event: React.ChangeEvent<HTMLInputElement>;
    sectionInfoId?: number;
    cvMinuteSectionId: number;
  }) => {
    if (cvMinute && event.target.files && event.target.files.length > 0) {
      const formData = new FormData();
      if (sectionInfoId) {
        formData.append('sectionInfoId', sectionInfoId.toString());
      }
      formData.append('cvMinuteSectionId', cvMinuteSectionId.toString());
      formData.append('file', event.target.files[0]);

      const res = await updateCvMinuteProfileService(cvMinute.id, formData);

      if (res.cvMinuteSection) {
        dispatch(
          updateCvMinuteReducer({
            cvMinuteSection: res.cvMinuteSection,
            file: res.file,
          }),
        );
      }
    }
  };

  const handleDeleteSectionInfo = async (
    sectionInfoId: number,
    cvMinuteSectionId: number,
  ) => {
    if (cvMinute) {
      setDeleteLoading(true);
      const res = await deleteSectionInfoService(cvMinute.id, sectionInfoId);

      if (res.section) {
        dispatch(
          deleteSectionInfoReducer({ section: res.section, cvMinuteSectionId }),
        );
        handleClosePopup();
      }
      setDeleteLoading(false);
    }
  };

  const handleDeleteCvMinuteSection = async (cvMinuteSectionId: number) => {
    if (cvMinute) {
      setDeleteLoading(true);
      const res = await deleteCvMinuteSectionService(
        cvMinute.id,
        cvMinuteSectionId,
      );

      if (res.cvMinuteSection) {
        dispatch(
          deleteCvMinuteSectionReducer({
            cvMinuteSection: res.cvMinuteSection,
          }),
        );
        handleClosePopup();
      }
      setDeleteLoading(false);
    }
  };

  if (cvMinute)
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
                <div className="flex items-center gap-[1em] p-[0.25em] rounded-[0.5em] bg-white shadow">
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
                    className="h-full px-[1em] flex justify-center items-center bg-gray-200 text-black text-[0.875em] rounded-[0.35em] select-none hover:opacity-90 cursor-pointer"
                  >
                    Reset
                  </p>
                </div>
              </div>

              <div className="relative flex bg-white w-[50em] min-h-[70em] rounded-[0.75em] shadow-md">
                <div className="absolute -left-[3.5em] top-0 flex flex-col gap-[0.5em]">
                  <TooltipProvider>
                    <Tooltip delayDuration={700}>
                      <TooltipTrigger asChild>
                        <i
                          onClick={(event) => {
                            const data: PopupInterface = {
                              title: 'Ajouter une rubrique',
                              openly: true,
                              conseil:
                                contacts?.advices && contacts.advices.length > 0
                                  ? contacts.advices[0].content
                                  : '',
                              suggestionTitle: 'Idées de rubrique',
                              suggestion: '',
                              newSection: true,
                              sectionOrder:
                                editableSections.length > 0
                                  ? editableSections.length + 1
                                  : 1,
                              fields: [
                                {
                                  label: 'Nom de la rubrique',
                                  type: 'input',
                                  key: 'title',
                                  placeholder: 'Nom...',
                                  requiredError: 'Nom de la rubrique requise',
                                  value: '',
                                  initialValue: '',
                                },
                                {
                                  label: 'Description',
                                  type: 'textarea',
                                  key: 'content',
                                  placeholder: 'Description...',
                                  requiredError:
                                    'Description de la rubrique requise',
                                  value: '',
                                  initialValue: '',
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
                          className="h-[2.5em] w-[2.5em] flex justify-center items-center shadow rounded-full bg-gray-200 text-black hover:opacity-90 cursor-pointer"
                        >
                          <Plus className="h-[1.5em]" />
                        </i>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="text-black text-[0.75em] shadow bg-gray-200 px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
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
                              cvMinuteSectionId: contacts?.id,
                              updateContactSection: true,
                              sectionInfoOrder:
                                contacts?.sectionInfos &&
                                contacts.sectionInfos.length > 0
                                  ? contacts.sectionInfos.length + 1
                                  : 1,
                              fields: [
                                {
                                  label: 'Contacts / Liens / Adresse',
                                  type: 'input',
                                  icon: 'globe',
                                  iconSize: 16,
                                  key: 'content',
                                  requiredError: '',
                                  placeholder: 'https://...',
                                  value: '',
                                  initialValue: '',
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
                          className="h-[2.5em] w-[2.5em] flex justify-center items-center shadow rounded-full text-black bg-gray-200 hover:opacity-90 cursor-pointer"
                        >
                          <UserPlus className="h-[1.5em]" />
                        </i>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="text-black text-[0.75em] shadow bg-gray-200 px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
                      >
                        <p>Adresse & Contacts</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip delayDuration={700}>
                      <TooltipTrigger asChild>
                        <i
                          onClick={(event) => {
                            const data: PopupInterface = {
                              title: 'Choisir les couleurs de fond',
                              hidden: false,
                              updateBg: true,
                              fields: [
                                {
                                  label: 'Primaire',
                                  type: 'color',
                                  key: 'primaryBg',
                                  requiredError: '',
                                  placeholder: '',
                                  value: cvMinute.primaryBg,
                                  initialValue: cvMinute.primaryBg,
                                },
                                {
                                  label: 'Secondaire',
                                  type: 'color',
                                  key: 'secondaryBg',
                                  requiredError: '',
                                  placeholder: '',
                                  value: cvMinute.secondaryBg,
                                  initialValue: cvMinute.secondaryBg,
                                },
                                {
                                  label: 'Tertiaire',
                                  type: 'color',
                                  key: 'tertiaryBg',
                                  requiredError: '',
                                  placeholder: '',
                                  value: cvMinute.tertiaryBg,
                                  initialValue: cvMinute.tertiaryBg,
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
                          className="h-[2.5em] w-[2.5em] flex justify-center items-center shadow rounded-full text-black bg-gray-200 hover:opacity-90 cursor-pointer"
                        >
                          <Brush className="h-[1.5em]" />
                        </i>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="text-black text-[0.75em] shadow bg-gray-200 px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
                      >
                        <p>Couleurs de fond</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div
                  className="w-1/3 text-white p-[0.75em] rounded-l-[0.75em]"
                  style={{ background: cvMinute.primaryBg }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-full flex flex-col gap-[0.75em]">
                      {profile && (
                        <div className="flex justify-center">
                          <label
                            htmlFor="cv-profile"
                            className="w-[10em] h-[10em] rounded-full bg-white flex items-center justify-center select-none"
                          >
                            {user && profileImg.length > 0 ? (
                              <Image
                                src={`${backendUri}/uploads/files/user-${user.id}/${profileImg[0].name}`}
                                alt="Profil"
                                height={160}
                                width={160}
                                className="object-cover h-full w-full rounded-full"
                              />
                            ) : (
                              <span className="text-gray-400">
                                Votre photo ici
                              </span>
                            )}
                            <input
                              onChange={(event) =>
                                handleChangeProfile({
                                  event,
                                  sectionInfoId: profile.sectionInfos[0]?.id,
                                  cvMinuteSectionId: profile.id,
                                })
                              }
                              id="cv-profile"
                              type="file"
                              accept=".png,.jpg,.jpeg,.webp,.svg,.heif,.heic"
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}

                      <div>
                        {firstname && (
                          <h2
                            onClick={(event) => {
                              const data: PopupInterface = {
                                sectionInfoId: firstname.sectionInfos[0]?.id,
                                cvMinuteSectionId: firstname.id,
                                updateCvMinuteSection: true,
                                fields: [
                                  {
                                    label: 'Votre prénom',
                                    type: 'input',
                                    key: 'content',
                                    requiredError: 'Prénom requis',
                                    placeholder:
                                      firstname?.sectionInfos[0]?.content ??
                                      'Prénom',
                                    value:
                                      firstname?.sectionInfos[0]?.content ?? '',
                                    initialValue:
                                      firstname?.sectionInfos[0]?.content ?? '',
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
                            {firstname?.sectionInfos[0]?.content ?? 'Prénom'}
                          </h2>
                        )}
                        {name && (
                          <h1
                            onClick={(event) => {
                              const data: PopupInterface = {
                                sectionInfoId: name.sectionInfos[0]?.id,
                                cvMinuteSectionId: name.id,
                                updateCvMinuteSection: true,
                                fields: [
                                  {
                                    label: 'Votre nom',
                                    type: 'input',
                                    key: 'content',
                                    requiredError: 'Nom requis',
                                    placeholder:
                                      name?.sectionInfos[0]?.content ?? 'Nom',
                                    value: name?.sectionInfos[0]?.content ?? '',
                                    initialValue:
                                      name?.sectionInfos[0]?.content ?? '',
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
                            {name?.sectionInfos[0]?.content ?? 'NOM'}
                          </h1>
                        )}
                      </div>
                    </div>

                    {contacts?.sectionInfos &&
                      contacts.sectionInfos.length > 0 && (
                        <div className="relative w-full flex flex-col text-[0.875em] px-[0.25em]">
                          {contacts.sectionInfos.map((c) => (
                            <div
                              key={c.id}
                              draggable
                              onDragStart={() =>
                                handleDragStart({
                                  dragId: c.id,
                                  type: 'contact',
                                })
                              }
                              onDragOver={handleDragOver}
                              onDrop={(event) =>
                                handleDropSectionInfo({
                                  event,
                                  dropId: c.id,
                                  type: 'contact',
                                  cvMinuteSectionId: contacts.id,
                                })
                              }
                              onClick={(event) => {
                                const data: PopupInterface = {
                                  title:
                                    'Modifier ou supprimer contact, lien, adresse...',
                                  hidden: false,
                                  deleteLabel: 'Supprimer',
                                  onDelete: () =>
                                    handleDeleteSectionInfo(c.id, contacts.id),
                                  deleteLoading,
                                  sectionInfoId: c.id,
                                  cvMinuteSectionId: contacts?.id,
                                  updateContactSection: true,
                                  sectionInfoOrder: c.order,
                                  fields: [
                                    {
                                      label: 'Contact / Lien / Adresse',
                                      type: 'input',
                                      icon: c.icon,
                                      iconSize: c.iconSize,
                                      key: 'content',
                                      requiredError: '',
                                      placeholder: 'https://...',
                                      value: c.content,
                                      initialValue: c.content,
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
                              className="flex items-center gap-[0.375em] p-[0.25em] group relative hover:bg-gray-100/25"
                              style={{ order: c.order }}
                            >
                              {c.icon && c.iconSize && (
                                <DynamicIcon
                                  name={c.icon}
                                  size={c.iconSize * (fontSize / 16)}
                                />
                              )}
                              <p className="flex-1">{c.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                    {editableSections.length > 0 && (
                      <div className="w-full flex flex-col">
                        {editableSections.map((s) => {
                          const cvMinuteSection = getCvMinuteSection(s.name);
                          if (cvMinuteSection)
                            return (
                              <div
                                key={s.id}
                                draggable
                                onDragStart={() =>
                                  handleDragStart({
                                    dragId: cvMinuteSection.id,
                                    type: 'cvMinuteSection',
                                  })
                                }
                                onDragOver={handleDragOver}
                                onDrop={(event) =>
                                  handleDropCvMinuteSection({
                                    event,
                                    dropId: cvMinuteSection.id,
                                  })
                                }
                                onClick={(event) => {
                                  const data: PopupInterface = {
                                    title: 'Modifier ou supprimer la rubrique',
                                    conseil: 'Nos conseils',
                                    suggestionTitle: 'Idées de rubrique',
                                    suggestion: '',
                                    deleteLabel: 'Supprimer la rubrique',
                                    onDelete: () =>
                                      handleDeleteCvMinuteSection(s.id),
                                    updateCvMinuteSection: true,
                                    cvMinuteSectionId: cvMinuteSection.id,
                                    sectionInfoId:
                                      cvMinuteSection?.sectionInfos[0]?.id,
                                    fields: [
                                      {
                                        label: 'Nom de la rubrique',
                                        type: 'input',
                                        key: 'sectionTitle',
                                        requiredError:
                                          'Nom de la rubrique requis',
                                        placeholder:
                                          cvMinuteSection.sectionTitle ??
                                          'Nom...',
                                        value:
                                          cvMinuteSection.sectionTitle ?? '',
                                        initialValue:
                                          cvMinuteSection.sectionTitle ?? '',
                                      },
                                      {
                                        label: 'Description',
                                        type: 'textarea',
                                        key: 'content',
                                        requiredError:
                                          'Description de la rubrique requise',
                                        placeholder:
                                          cvMinuteSection?.sectionInfos[0]
                                            ?.content ?? 'Description...',
                                        value:
                                          cvMinuteSection?.sectionInfos[0]
                                            ?.content ?? '',
                                        initialValue:
                                          cvMinuteSection?.sectionInfos[0]
                                            ?.content ?? '',
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
                                style={{ order: cvMinuteSection.sectionOrder }}
                                className="relative w-full mt-[1em] hover:bg-gray-100/25 p-[0.25em] transition-[order] duration-500"
                              >
                                <h3
                                  className="uppercase bg-[#1A5F6B] py-[0.25em] px-[0.75em] font-semibold mb-[0.5em] text-[0.875em] select-none"
                                  style={{ background: cvMinute.secondaryBg }}
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
                                      Aucun diplôme ajouté
                                    </p>
                                  )}
                                </div>

                                <div className="absolute -left-[4em] top-0 flex flex-col gap-[0.5em]">
                                  <TooltipProvider>
                                    <Tooltip delayDuration={700}>
                                      <TooltipTrigger asChild>
                                        <i className="text-gray-300 hover:text-gray-400 transition-colors duration-150 cursor-pointer">
                                          <Zap
                                            size={
                                              (fontSize + 16) * (fontSize / 16)
                                            }
                                          />
                                        </i>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="left"
                                        className="text-black text-[0.75em] shadow bg-gray-200 px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
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
                    )}
                  </div>
                </div>

                <div className="w-2/3 flex flex-col gap-[0.75em] p-[1em]">
                  {title && (
                    <div
                      onClick={(event) => {
                        const data: PopupInterface = {
                          align: 'right',
                          title: 'Titre du CV',
                          conseil: 'Nos conseils',
                          suggestionTitle: 'Idées de titre du CV',
                          suggestion: '',
                          deleteLabel: 'Supprimer le titre',
                          sectionInfoId: title.sectionInfos[0]?.id,
                          cvMinuteSectionId: title.id,
                          updateCvMinuteSection: true,
                          compare: false,
                          fields: [
                            {
                              label: 'Ajouter le titre du CV',
                              requiredError: 'Titre du CV requis',
                              type: 'input',
                              key: 'content',
                              trim: false,
                              description:
                                'Si vous souhaitez un CV sans titre, mettez un espace',
                              placeholder:
                                title?.sectionInfos[0]?.content ?? 'Titre...',
                              value: title?.sectionInfos[0]?.content ?? '',
                              initialValue:
                                title?.sectionInfos[0]?.content ?? '',
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
                      <h1 className="text-[2em] font-bold text-gray-900">
                        {title?.sectionInfos[0]?.content ?? 'Titre du CV'}
                      </h1>
                    </div>
                  )}

                  {presentation && (
                    <div
                      onClick={(event) => {
                        const data: PopupInterface = {
                          align: 'right',
                          title: 'Ajouter une presentation',
                          conseil: '',
                          openly: true,
                          suggestionTitle: 'Idées de présentation',
                          suggestion: '',
                          sectionInfoId: presentation.sectionInfos[0]?.id,
                          cvMinuteSectionId: presentation.id,
                          updateCvMinuteSection: true,
                          fields: [
                            {
                              label: 'Présentation',
                              type: 'textarea',
                              key: 'content',
                              requiredError: 'Présentation requise',
                              placeholder:
                                presentation?.sectionInfos[0]?.content ??
                                'Présentation...',
                              value:
                                presentation?.sectionInfos[0]?.content ?? '',
                              initialValue:
                                presentation?.sectionInfos[0]?.content ?? '',
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
                      className="flex justify-between text-gray-700 hover:bg-gray-100 p-[0.5em] rounded text-[0.875em] whitespace-pre-line"
                    >
                      <p>
                        {presentation?.sectionInfos[0]?.content ??
                          'Résumé du profil professionnel'}
                      </p>
                    </div>
                  )}

                  {experiences && (
                    <div className="flex flex-col gap-[0.5em]">
                      <div
                        onClick={(event) => {
                          const data: PopupInterface = {
                            align: 'right',
                            title: 'Ajouter une expérience',
                            cvMinuteSectionId: experiences.id,
                            updateExperience: true,
                            sectionInfoOrder:
                              experiences.sectionInfos &&
                              experiences.sectionInfos.length > 0
                                ? experiences.sectionInfos.length + 1
                                : 1,
                            fields: [
                              {
                                label: 'Titre du poste',
                                type: 'input',
                                key: 'title',
                                requiredError: 'Titre du poste requis',
                                placeholder: 'Titre...',
                                value: '',
                                initialValue: '',
                              },
                              {
                                label: "Nom de l'entreprise",
                                type: 'input',
                                key: 'company',
                                requiredError: "Nom de l'entreprise requis",
                                placeholder: 'Entreprise...',
                                value: '',
                                initialValue: '',
                              },
                              {
                                label: 'Mois début - Mois fin',
                                example: 'Ex : 03-2023 05-2025',
                                type: 'input',
                                key: 'date',
                                requiredError: 'Mois requis',
                                placeholder: 'Mois...',
                                value: '',
                                initialValue: '',
                              },
                              {
                                label: 'Type de contrat',
                                example: 'Ex : CDI, CDD, Intérim...',
                                type: 'input',
                                key: 'contrat',
                                requiredError: 'Type de contrat requis',
                                placeholder: 'Contrat...',
                                value: '',
                                initialValue: '',
                              },
                              {
                                label: 'Description',
                                type: 'text',
                                key: 'content',
                                requiredError: 'Description requise',
                                placeholder: 'Description...',
                                value: '',
                                initialValue: '',
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
                        <h2
                          className="w-full uppercase text-[1.125em] font-semibold border-b-[0.125em]"
                          style={{
                            color: cvMinute.primaryBg,
                            borderColor: cvMinute.primaryBg,
                          }}
                        >
                          Expériences professionnelles
                        </h2>

                        <div className="absolute -right-[4em] top-[0.125em]">
                          <TooltipProvider>
                            <Tooltip delayDuration={700}>
                              <TooltipTrigger asChild>
                                <i className="text-gray-300 hover:text-gray-400 transition-colors duration-150 cursor-pointer">
                                  <Triangle
                                    size={(fontSize + 16) * (fontSize / 16)}
                                    fill={'currentColor'}
                                  />
                                </i>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                className="text-black text-[0.75em] shadow bg-gray-200 px-[0.5em] py-[0.25em] ms-[0.25em] rounded-[0.25em]"
                              >
                                <p>Ajouter expérience</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      {experiences?.sectionInfos &&
                      experiences.sectionInfos.length > 0 ? (
                        <div className="flex flex-col gap-[0.375em]">
                          {experiences.sectionInfos.map((item) => (
                            <div
                              key={item.id}
                              draggable
                              onDragStart={() =>
                                handleDragStart({
                                  dragId: item.id,
                                  type: 'experience',
                                })
                              }
                              onDragOver={handleDragOver}
                              onDrop={(event) =>
                                handleDropSectionInfo({
                                  event,
                                  dropId: item.id,
                                  type: 'experience',
                                  cvMinuteSectionId: experiences.id,
                                })
                              }
                              onClick={(event) => {
                                const data: PopupInterface = {
                                  align: 'right',
                                  title: "Modifier ou supprimer l'expérience",
                                  deleteLabel: "Supprimer l'expérience",
                                  onDelete: () =>
                                    handleDeleteSectionInfo(
                                      item.id,
                                      experiences.id,
                                    ),
                                  sectionInfoId: item.id,
                                  cvMinuteSectionId: experiences.id,
                                  updateExperience: true,
                                  fields: [
                                    {
                                      label: 'Titre du poste',
                                      type: 'input',
                                      key: 'title',
                                      requiredError: 'Titre du poste requis',
                                      placeholder: item.title ?? 'Titre...',
                                      value: item.title ?? '',
                                      initialValue: item.title ?? '',
                                    },
                                    {
                                      label: "Nom de l'entreprise",
                                      type: 'input',
                                      key: 'company',
                                      requiredError:
                                        "Nom de l'entreprise requis",
                                      placeholder:
                                        item.company ?? 'Entreprise...',
                                      value: item.company ?? '',
                                      initialValue: item.company ?? '',
                                    },
                                    {
                                      label: 'Mois début - Mois fin',
                                      example: 'Ex : 03-2023 05-2025',
                                      type: 'input',
                                      key: 'date',
                                      requiredError: 'Mois requis',
                                      placeholder: item.date ?? 'Mois...',
                                      value: item.date ?? '',
                                      initialValue: item.date ?? '',
                                    },
                                    {
                                      label: 'Type de contrat',
                                      example: 'Ex : CDI, CDD, Intérim...',
                                      type: 'input',
                                      key: 'contrat',
                                      requiredError: 'Type de contrat requis',
                                      placeholder: item.contrat ?? 'Contrat...',
                                      value: item.contrat ?? '',
                                      initialValue: item.contrat ?? '',
                                    },
                                    {
                                      label: 'Description',
                                      type: 'text',
                                      key: 'content',
                                      requiredError: 'Description requise',
                                      placeholder:
                                        item.content ?? 'Description...',
                                      value: item.content ?? '',
                                      initialValue: item.content ?? '',
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
                              className="flex flex-col gap-[0.25em] p-[0.25em] hover:bg-gray-100"
                              style={{ order: item.order }}
                            >
                              <div className="flex items-end gap-[0.5em] font-semibold">
                                <p
                                  className="text-nowrap text-[0.875em] word-spacing"
                                  style={{ color: cvMinute.primaryBg }}
                                >
                                  {item.date} :
                                </p>
                                <h3>{item.title}</h3>
                              </div>
                              <p
                                className="text-[0.75em] tracking-[0.025em] p-[0.25em]"
                                style={{ background: cvMinute.tertiaryBg }}
                              >
                                {item.company} - <span>({item.contrat})</span>
                              </p>
                              <div
                                className="text-[0.75em]"
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(item.content),
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-[0.875em] p-[0.25em]">
                          Aucune expérience ajoutée
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isOpen &&
              popup &&
              (((popup.updateCvMinuteSection ||
                popup.updateExperience ||
                popup.updateContactSection) &&
                popup.cvMinuteSectionId) ||
                popup.updateBg ||
                popup.newSection) && (
                <EditPopup
                  popup={popup}
                  cvMinuteId={cvMinute.id}
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
