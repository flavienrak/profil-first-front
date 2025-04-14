'use client';

import React from 'react';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import Popup from '../utils/Popup';
import Guide from '../utils/Guide';
import EditPopup from './EditPopup';
import PdfTempldate from './PdfTempldate';
import PrimaryButton from '../utils/PrimaryButton';

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
import { UidContext, videoUri } from '@/providers/UidProvider';
import { Step } from '@/interfaces/step.interface';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { LucideIcon } from '../utils/LucideIcon';
import { CvMinuteSectionInterface } from '@/interfaces/cvMinuteSection.interface';

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
  static?: boolean;
  title?: string;
  conseil?: string;
  openly?: boolean;
  details?: string;
  disponibility?: string;
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
  onShowGuide?: () => void;
  onShowVideo?: () => void;

  updateBg?: boolean;
  newSection?: boolean;
  updateExperience?: boolean;
  updateContactSection?: boolean;
  updateCvMinuteSection?: boolean;
}

type SectionType = 'contact' | 'cvMinuteSection' | 'experience';

const backendUri = process.env.NEXT_PUBLIC_BACKEND_URI;
const details = `Lorem ipsum dolor sit amet consectetur adipisicing elit. \n
Fugiat nulla, soluta illum placeat molestiae, optio quo quae minus animi rem fuga ducimus, \n
architecto totam exercitationem id quas ratione hic provident!\nLorem ipsum dolor sit amet consectetur adipisicing elit. \n\n`;
const disponibility = `Lorem ipsum dolor sit amet consectetur adipisicing elit. \n
Fugiat nulla, soluta illum placeat molestiae, optio quo quae minus animi rem fuga ducimus, \n
architecto totam exercitationem id quas ratione hic provident!\nLorem ipsum dolor sit amet consectetur adipisicing elit. \n\n`;

const steps: Step[] = [
  { class: 'step-1', description: 'Un coup de pouce pour refaire votre CV' },
  { class: 'step-2', description: "Consulter l'offre d'emploi" },
  { class: 'step-3', description: 'Consulter le Score matching CV - Offre' },
  { class: 'step-4', description: 'Refaire mon CV en un clic' },
  {
    class: 'step-5',
    description: `Stockez le CV et retrouvez le dans "CV et offres"`,
  },
  {
    class: 'step-6',
    description: "Téléchargez votre CV pour candidater sur d'autres sites",
  },
  {
    class: 'step-7',
    description: 'Cliquez pour ajouter ou modifier le titre de votre CV',
  },
  {
    class: 'step-8',
    description: 'Cliquez pour ajouter ou modifier votre profil',
  },
  {
    class: 'step-9',
    description: 'Cliquez pour ajouter une expérience',
  },
  {
    class: 'step-10',
    description: 'Cliquez pour ajouter ou modifier votre photo',
  },
  {
    class: 'step-11',
    description: 'Cliquez pour ajouter une rubrique',
  },
  {
    class: 'step-12',
    description: 'Cliquez pour ajouter un contact, lien ou adresse',
  },
  {
    class: 'step-13',
    description: 'Cliquez pour modifier les couleurs de fonds',
  },
];

export default function CvPreview() {
  const dispatch = useDispatch();
  const context = React.useContext(UidContext);
  const cvRef = React.useRef<HTMLDivElement | null>(null);

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
  const [showGuide, setShowGuide] = React.useState(false);
  const [showVideo, setShowVideo] = React.useState(false);
  const [review, setReview] = React.useState(false);
  const [showMatching, setShowMatching] = React.useState(false);

  const [currentGuideStep, setCurrentGuideStep] = React.useState(0);

  const [initialScore, setInitialScore] = React.useState(20);
  const [currentScore, setCurrentScore] = React.useState(40);

  const [recommandations, setRecommandations] =
    React.useState('Recommandations');

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

  const handleNextGuide = () => {
    if (currentGuideStep < steps.length - 1) {
      setCurrentGuideStep(currentGuideStep + 1);
    } else {
      setShowGuide(false);
    }
  };

  const handlePreviousGuide = () => {
    if (currentGuideStep > 0) {
      setCurrentGuideStep(currentGuideStep - 1);
    }
  };

  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  if (cvMinute && context)
    return (
      <div className="flex justify-center flex-col">
        <div className="w-full px-8 h-20 border-b border-gray-200 bg-white flex items-center">
          <div className="w-full flex justify-center items-center gap-5">
            <button className="step-1 flex justify-center items-center gap-2 h-12 px-6 rounded-[0.25em] text-[0.875em] font-semibold bg-[#e5e7eb] hover:opacity-90 cursor-pointer select-none">
              Guide de rédaction du CV
            </button>
            <button
              onClick={() => setReview(true)}
              className="step-2 flex justify-center items-center gap-2 h-12 px-6 rounded-[0.25em] text-[0.875em] font-semibold bg-[#e5e7eb] hover:opacity-90 cursor-pointer select-none"
            >
              Relire l’offre
            </button>
            <button
              onClick={() => setShowMatching(true)}
              className="step-3 flex justify-center items-center gap-2 h-12 px-6 rounded-[0.25em] text-[0.875em] font-semibold bg-[#e5e7eb] hover:opacity-90 cursor-pointer select-none"
            >
              Matching score
            </button>
            <button className="step-4 flex justify-center items-center gap-2 h-12 px-6 rounded-[0.25em] text-[0.875em] font-semibold bg-[#e5e7eb] hover:opacity-90 cursor-pointer select-none">
              Optimiser en un clic
            </button>
            <button className="step-5 flex justify-center items-center gap-2 h-12 px-6 rounded-[0.25em] text-[0.875em] font-semibold bg-[#e5e7eb] hover:opacity-90 cursor-pointer select-none">
              Enregistrer le CV et l’offre
            </button>
            <PDFDownloadLink
              fileName="cv.pdf"
              document={
                <PdfTempldate
                  image={`${backendUri}/uploads/files/user-${user?.id}/${profileImg[0].name}`}
                  name={name?.sectionInfos[0]?.content}
                  firstname={firstname?.sectionInfos[0]?.content}
                  contacts={contacts?.sectionInfos
                    ?.slice()
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))}
                  editableSections={editableSections
                    .map((s) => getCvMinuteSection(s.name))
                    .filter(
                      (section): section is CvMinuteSectionInterface =>
                        section !== undefined,
                    )
                    .sort(
                      (a, b) =>
                        (a.sectionOrder ?? Infinity) -
                        (b.sectionOrder ?? Infinity),
                    )}
                  title={title?.sectionInfos[0]?.content}
                  presentation={presentation?.sectionInfos[0]?.content}
                  experiences={experiences?.sectionInfos}
                  primaryBg={cvMinute.primaryBg}
                  secondaryBg={cvMinute.secondaryBg}
                  tertiaryBg={cvMinute.tertiaryBg}
                />
              }
              className="step-6 flex justify-center items-center gap-2 h-12 py-3 ps-4 pe-6 rounded-[0.25em] text-white bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] hover:opacity-90 cursor-pointer select-none"
            >
              <Download />
              <span className="text-[0.875em] font-semibold">
                Télécharger le CV
              </span>
            </PDFDownloadLink>
          </div>
        </div>

        <div className="relative h-[calc(100vh-5rem)] overflow-y-auto">
          <div
            className="flex justify-center p-[2.5em]"
            style={{ fontSize: `${fontSize}px` }}
          >
            <div className="flex flex-col gap-[1em]">
              <div className="flex justify-between bg-white shadow p-[0.25em] rounded-[0.5em]">
                <button
                  onClick={(event) => {
                    const data: PopupInterface = {
                      title: 'Déscriptions',
                      static: true,
                      details,
                      disponibility,
                      fields: [],
                      onShowGuide: () => setShowGuide(true),
                      onShowVideo: () => setShowVideo(true),
                    };

                    handleGetPosition(event, 'left', { y: 80 });
                    if (isOpen) {
                      handleClosePopup();
                      setTempData(data);
                    } else {
                      handleOpenPopup(data);
                    }
                  }}
                  className="h-full px-[1em] text-[0.875em] bg-[#e5e7eb] rounded-[0.25em] cursor-pointer transition-opacity duration-150 hover:opacity-80"
                >
                  Comment ça marche ?
                </button>

                <div className="flex items-center gap-[1em]">
                  <i
                    onClick={increaseFontSize}
                    className="h-[2em] w-[2em] flex justify-center items-center hover:bg-[#f3f4f6] cursor-pointer rounded-[0.25em]"
                  >
                    <ZoomIn className="h-[1.5em]" />
                  </i>
                  <i
                    onClick={decreaseFontSize}
                    className="h-[2em] w-[2em] flex justify-center items-center hover:bg-[#f3f4f6] cursor-pointer rounded-[0.25em]"
                  >
                    <ZoomOut className="h-[1.5em]" />
                  </i>
                  <p
                    onClick={resetFontSize}
                    className="h-full px-[1em] flex justify-center items-center bg-[#e5e7eb] text-[0.875em] rounded-[0.35em] select-none hover:opacity-90 cursor-pointer"
                  >
                    Réinitialiser
                  </p>
                </div>
              </div>

              <div
                ref={cvRef}
                className="relative flex bg-white w-[50em] min-h-[70em] rounded-[0.75em] shadow-md"
              >
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
                          className="step-11 h-[2.5em] w-[2.5em] flex justify-center items-center shadow rounded-full bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] text-white hover:opacity-80 cursor-pointer"
                        >
                          <Plus className="h-[1.5em]" />
                        </i>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="text-white text-[0.75em] shadow bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
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
                          className="step-12 h-[2.5em] w-[2.5em] flex justify-center items-center shadow rounded-full text-white bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] hover:opacity-80 cursor-pointer"
                        >
                          <UserPlus className="h-[1.5em]" />
                        </i>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="text-white text-[0.75em] shadow bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
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
                          className="step-13 h-[2.5em] w-[2.5em] flex justify-center items-center shadow rounded-full text-white bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] hover:opacity-80 cursor-pointer"
                        >
                          <Brush className="h-[1.5em]" />
                        </i>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="text-white text-[0.75em] shadow bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
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
                            className="step-10 w-[10em] h-[10em] rounded-full bg-white flex items-center justify-center select-none"
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
                              <span className="text-[#99a1af]">
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
                            className="w-full text-[1em] text-center font-medium hover:bg-[#f3f4f6]/25"
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
                            className="w-full text-[1.125em] text-center font-bold mb-3 hover:bg-[#f3f4f6]/25"
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
                              key={`contact-${c.id}`}
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
                              className="flex items-center gap-[0.375em] p-[0.25em] group relative hover:bg-[#f3f4f6]/25"
                              style={{ order: c.order }}
                            >
                              {c.icon && c.iconSize && (
                                <LucideIcon
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
                                key={`editableSection-${s.id}`}
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
                                className="relative w-full mt-[1em] hover:bg-[#f3f4f6]/25 p-[0.25em] transition-[order] duration-500"
                              >
                                <h3
                                  className="uppercase bg-[#1A5F6B] py-[0.25em] px-[0.5em] font-semibold mb-[0.5em] text-[0.875em] select-none"
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
                                        <i className="text-[var(--primary-color)] opacity-80 hover:opacity-100 transition-opacity duration-150 cursor-pointer">
                                          <Zap
                                            size={
                                              (fontSize + 16) * (fontSize / 16)
                                            }
                                          />
                                        </i>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="left"
                                        className="text-white text-[0.75em] shadow bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
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
                      className="step-7 flex justify-between items-center hover:bg-[#f3f4f6] px-[0.25em] py-[0.25em] rounded"
                    >
                      <h1 className="text-[2em] font-bold text-[#101828]">
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
                      className="step-8 flex justify-between text-[#364153] hover:bg-[#f3f4f6] p-[0.5em] rounded text-[0.875em] whitespace-pre-line"
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
                          className="step-9 w-full uppercase text-[1.125em] font-semibold border-b-[0.125em]"
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
                                <i className="text-[var(--primary-color)] opacity-80 hover:opacity-100 transition-opacity duration-150 cursor-pointer">
                                  <Triangle
                                    size={(fontSize + 16) * (fontSize / 16)}
                                    fill={'currentColor'}
                                  />
                                </i>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                className="text-white text-[0.75em] shadow bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] px-[0.5em] py-[0.25em] ms-[0.25em] rounded-[0.25em]"
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
                              key={`experience-${item.id}`}
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
                                  sectionInfoOrder: item.order,
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
                              className="flex flex-col gap-[0.25em] p-[0.25em] hover:bg-[#f3f4f6]"
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

                              <div className="absolute -right-[13em] w-[12em] flex flex-col gap-[0.5em]">
                                <div className="flex items-center justify-between">
                                  <span className="text-[0.875em] font-medium text-[#4a5565] truncate">
                                    {item.title}
                                  </span>
                                  <span className="text-[0.875em] font-semibold text-primary">
                                    85%
                                  </span>
                                </div>
                                <div className="relative h-[0.5em] bg-[#e5e7eb] rounded-full overflow-hidden">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ffccd3] to-[#8B5CF6] rounded-full transition-all duration-300"
                                    style={{ width: '85%' }}
                                  />
                                </div>
                                <button
                                  onClick={(
                                    event: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    event.stopPropagation();
                                  }}
                                  className="w-full text-[0.75em] font-semibold hover:text-[var(--primary-color)] cursor-pointer"
                                >
                                  Optimiser cette expérience
                                </button>
                              </div>
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
            </div>

            {isOpen &&
              popup &&
              (((popup.updateCvMinuteSection ||
                popup.updateExperience ||
                popup.updateContactSection) &&
                popup.cvMinuteSectionId) ||
                popup.updateBg ||
                popup.static ||
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

            {showVideo && (
              <Popup full onClose={() => setShowVideo(false)}>
                <div className="p-4 h-[32rem] w-[60rem]">
                  {videoUri ? (
                    <iframe
                      src={context.handleVideo(videoUri)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full rounded-lg shadow"
                    ></iframe>
                  ) : (
                    <p>Vidéo non trouvé</p>
                  )}
                </div>
              </Popup>
            )}

            {review && (
              <Popup onClose={() => setReview(false)}>
                <div className="max-h-[80vh] p-5 overflow-y-auto [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
                  <p className="whitespace-pre-line">{cvMinute.position}</p>
                </div>
              </Popup>
            )}

            {showMatching && (
              <Popup onClose={() => setShowMatching(false)}>
                <div className="max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
                  <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                    <h3 className="text-xl font-bold mb-6">
                      Score de Matching
                    </h3>

                    <div className="flex justify-around items-center mb-8">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Score initial
                        </p>
                        <div className="relative inline-flex items-center justify-center">
                          <svg className="w-20 h-20">
                            <circle
                              className="text-gray-200"
                              strokeWidth="5"
                              stroke="currentColor"
                              fill="transparent"
                              r="30"
                              cx="40"
                              cy="40"
                            />
                            <circle
                              className="text-blue-600"
                              strokeWidth="5"
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="30"
                              cx="40"
                              cy="40"
                              strokeDasharray={`${2 * Math.PI * 30}`}
                              strokeDashoffset={`${
                                2 * Math.PI * 30 * (1 - initialScore / 100)
                              }`}
                            />
                          </svg>
                          <span className="absolute text-xl font-bold">
                            {initialScore}%
                          </span>
                        </div>
                      </div>

                      {currentScore !== null && (
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">
                            Score actuel
                          </p>
                          <div className="relative inline-flex items-center justify-center">
                            <svg className="w-20 h-20">
                              <circle
                                className="text-gray-200"
                                strokeWidth="5"
                                stroke="currentColor"
                                fill="transparent"
                                r="30"
                                cx="40"
                                cy="40"
                              />
                              <circle
                                className="text-green-600"
                                strokeWidth="5"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="30"
                                cx="40"
                                cy="40"
                                strokeDasharray={`${2 * Math.PI * 30}`}
                                strokeDashoffset={`${
                                  2 * Math.PI * 30 * (1 - currentScore / 100)
                                }`}
                              />
                            </svg>
                            <span className="absolute text-xl font-bold">
                              {currentScore}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">
                        L'analyse de Coach Victorien :
                      </h4>
                      <p className="text-gray-600">{recommandations}</p>
                      <p className="text-sm text-gray-500 mt-2 italic">
                        Rappel : Le score de matching est purement indicatif.
                        C'est à vous de jauger la pertinence de votre CV selon
                        vos objectifs.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowMatching(false)}
                        className="w-full p-[0.5em] rounded-[0.325em] border border-gray-500 select-none"
                      >
                        Fermer
                      </button>
                      <PrimaryButton label={'Recalculer'} />
                    </div>
                  </div>
                </div>
              </Popup>
            )}
          </div>
        </div>

        {showGuide && (
          <Guide
            steps={steps}
            currentStep={currentGuideStep}
            onNext={handleNextGuide}
            onPrevious={handlePreviousGuide}
            onClose={handleCloseGuide}
          />
        )}
      </div>
    );
}
