'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Popup from '@/components/utils/Popup';
import Guide from '@/components/utils/role/user/Guide';
import EditPopup from './EditPopup';
import PdfTempldate from './PdfTempldate';
import PrimaryButton from '@/components/utils/role/user/button/PrimaryButton';
import TextEditor from '@/components/utils/TextEditor';

import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  Brush,
  CaptionsOff,
  Download,
  Goal,
  Plus,
  Rocket,
  SquareCheck,
  Triangle,
  TriangleAlert,
  UserPlus,
  Wallet,
  Zap,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { IconInterface } from '@/interfaces/icon.interface';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { updatePersistReducer } from '@/redux/slices/persist.slice';
import {
  deleteCvMinuteSectionService,
  updateCvMinuteProfileService,
  generateCvMinuteSectionAdvicesService,
  updateCvMinuteScoreService,
  updateCvMinuteSectionOrderService,
  updateCvMinuteSectionScoreService,
  optimizeCvMinuteService,
  generateNewCvMinuteSectionsService,
} from '@/services/role/user/cvMinute.service';
import {
  updateCvMinuteSectionReducer,
  updateCvMinuteSectionOrderReducer,
  deleteCvMinuteSectionReducer,
  updateCvMinuteScoreReducer,
  updateCvMinuteAdvicesReducer,
  updateCvMinuteSectionAdvicesReducer,
  setCvMinuteReducer,
  updateCvMinuteProfileReducer,
} from '@/redux/slices/role/user/cvMinute.slice';
import { videoUri } from '@/providers/User.provider';
import { StepInterface } from '@/interfaces/step.interface';
import { pdf } from '@react-pdf/renderer';
import { LucideIcon } from '@/components/utils/LucideIcon';
import { handleVideo } from '@/lib/function';

export interface FieldInterface {
  key: string;
  label: string;
  placeholder: string;
  description?: string;
  example?: string;
  value: string | number;
  icon?: IconInterface | null;
  iconSize?: number | null;
  type: 'input' | 'textarea' | 'text' | 'color';
  initialValue: string | number;
  requiredError: string;
  trim?: boolean;
  show?: boolean;
}

export interface PopupInterface {
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
  cvMinuteSectionId?: number;
  deleteLoading?: boolean;
  withScore?: boolean;
  onClick?: () => Promise<void>;
  onGenerate?: () => Promise<void>;
  onShowGuide?: () => void;
  onShowVideo?: () => void;

  updateBg?: boolean;
  updateName?: boolean;
  updateFirstname?: boolean;
  updateContact?: boolean;
  updateEditableSection?: boolean;
  updateTitle?: boolean;
  updatePresentation?: boolean;
  updateExperience?: boolean;

  newContact?: boolean;
  newEditableSection?: boolean;
  newExperience?: boolean;
}

const backendUri = process.env.NEXT_PUBLIC_API_URL;

const steps: StepInterface[] = [
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

const optimizeOptions = [
  {
    bold: 'Expériences reformulées ',
    label: 'pour mettre en avant vos résultats concrets.',
  },
  {
    bold: 'Mots clés stratégiques ajoutés ',
    label: 'pour coller aux attentes des recruteurs.',
  },
  {
    bold: 'Compétences optimisées ',
    label: 'pour renforcer votre attractivité sur le marché.',
  },
];

type CvMinuteSectionType = 'contact' | 'editableSection' | 'experience';

export default function CvPreview() {
  const cvRef = React.useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);
  const { fontSize } = useSelector((state: RootState) => state.persistInfos);
  const { cvMinute } = useSelector((state: RootState) => state.cvMinute);

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

  const [draggingItem, setDraggingItem] = React.useState<{
    id: number;
    type: CvMinuteSectionType;
    dragIndex: number;
  } | null>(null);

  const [popup, setPopup] = React.useState<PopupInterface | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempData, setTempData] = React.useState<PopupInterface | null>(null);
  const [currentPosition, setCurrentPosition] = React.useState({ x: 0, y: 0 });
  const [showGuide, setShowGuide] = React.useState(false);
  const [showVideo, setShowVideo] = React.useState(false);
  const [review, setReview] = React.useState(false);
  const [redirectLoading, setRedirectLoading] = React.useState(false);
  const [showMatching, setShowMatching] = React.useState(false);
  const [showOptimize, setShowOptimize] = React.useState(false);

  const [currentGuideStep, setCurrentGuideStep] = React.useState(0);
  const [loadingGlobal, setLoadingGlobal] = React.useState(false);
  const [loadingOptimize, setLoadingOptimize] = React.useState(false);

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
    let x = 0;
    let y = 0;
    const elementWidth = 400;

    if (align === 'right') {
      x = rect.right + 20; // Position à droite
      if (x + elementWidth + 25 > window.innerWidth) {
        x = rect.left - elementWidth; // Si dépassement, repositionner à gauche
      }
      y = rect.top;
    } else if (align === 'center') {
      x = window.innerWidth / 2 - elementWidth / 2;
    } else {
      x = rect.left - elementWidth; // Position à gauche
      if (x < 0) {
        x = rect.right + 10; // Si dépassement, repositionner à droite
      }
      y = rect.top;
    }

    setCurrentPosition({
      x: position?.x ?? x,
      y: position?.y ?? y,
    });
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

  const handleDragStart = (data: {
    dragId: number;
    dragIndex: number;
    type: CvMinuteSectionType;
  }) => {
    setDraggingItem({
      id: data.dragId,
      type: data.type,
      dragIndex: data.dragIndex,
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // CVMINUTE SECTION ORDER
  const handleDropCvMinuteSection = async (data: {
    event: React.DragEvent<HTMLDivElement>;
    type: CvMinuteSectionType;
    dropId: number;
    dropIndex: number;
  }) => {
    data.event.preventDefault();

    if (cvMinute && draggingItem && draggingItem.type === data.type) {
      const res = await updateCvMinuteSectionOrderService({
        id: cvMinute.id,
        cvMinuteSectionId: draggingItem.id,
        dragIndex: draggingItem.dragIndex,
        targetCvMinuteSectionId: data.dropId,
        dropIndex: data.dropIndex,
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

  // UPDATE CVMINUTE PROFILE
  const handleChangeProfile = async (data: {
    event: React.ChangeEvent<HTMLInputElement>;
    cvMinuteSectionId: number;
  }) => {
    if (
      cvMinute &&
      data.event.target.files &&
      data.event.target.files.length > 0
    ) {
      const formData = new FormData();

      formData.append('cvMinuteSectionId', data.cvMinuteSectionId.toString());
      formData.append('file', data.event.target.files[0]);

      const res = await updateCvMinuteProfileService(cvMinute.id, formData);

      if (res.file) {
        dispatch(updateCvMinuteProfileReducer({ file: res.file }));
      }
    }
  };

  const handleDeleteCvMinuteSection = async (cvMinuteSectionId: number) => {
    if (cvMinute) {
      const res = await deleteCvMinuteSectionService({
        id: cvMinute.id,
        cvMinuteSectionId,
      });

      if (res.cvMinuteSection) {
        dispatch(
          deleteCvMinuteSectionReducer({
            cvMinuteSection: res.cvMinuteSection,
          }),
        );
        handleClosePopup();
      }
    }

    return;
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

  const handleOptimizeCvMinute = async () => {
    if (cvMinute) {
      setLoadingOptimize(true);
      const res = await optimizeCvMinuteService(cvMinute.id);

      if (res.cvMinute) {
        dispatch(setCvMinuteReducer({ cvMinute: res.cvMinute }));
      }
      setLoadingOptimize(false);
      setShowOptimize(false);
    }
  };

  const handleGenerateNewCvMinuteSections = async () => {
    if (cvMinute) {
      const res = await generateNewCvMinuteSectionsService(cvMinute.id);

      if (res.cvMinute) {
        dispatch(updateCvMinuteAdvicesReducer({ cvMinute: res.cvMinute }));
      }
    }

    return;
  };

  const handleGenerateCvMinuteSectionAdvices = async (
    cvMinuteSectionId: number,
  ) => {
    if (cvMinute) {
      const res = await generateCvMinuteSectionAdvicesService({
        id: cvMinute.id,
        cvMinuteSectionId: cvMinuteSectionId,
      });

      if (res.cvMinuteSection) {
        dispatch(
          updateCvMinuteSectionAdvicesReducer({
            cvMinuteSection: res.cvMinuteSection,
          }),
        );
      }
    }

    return;
  };

  const handleRecalculateGlobalMatching = async () => {
    if (cvMinute) {
      setLoadingGlobal(true);
      const res = await updateCvMinuteScoreService(cvMinute.id);

      if (res.evaluation) {
        dispatch(updateCvMinuteScoreReducer({ evaluation: res.evaluation }));
      }
      setLoadingGlobal(false);
    }

    return;
  };

  const handleRecalculateExperienceMatching = async (value: number) => {
    if (cvMinute) {
      const res = await updateCvMinuteSectionScoreService({
        id: cvMinute.id,
        cvMinuteSectionId: value,
      });

      if (res.cvMinuteSection) {
        dispatch(
          updateCvMinuteSectionReducer({
            cvMinuteSection: res.cvMinuteSection,
          }),
        );
      }
    }

    return;
  };

  const handleDownload = async () => {
    if (cvMinute) {
      const blob = await pdf(
        <PdfTempldate
          image={
            profile && profile.files.length > 0
              ? `${backendUri}/uploads/files/user-${user?.id}/${
                  profile.files[profile.files.length - 1].name
                }`
              : undefined
          }
          name={name?.content}
          firstname={firstname?.content}
          contacts={contacts}
          editableSections={editableSections}
          title={title?.content}
          presentation={presentation?.content}
          experiences={experiences}
          primaryBg={cvMinute.primaryBg}
          secondaryBg={cvMinute.secondaryBg}
          tertiaryBg={cvMinute.tertiaryBg}
        />,
      ).toBlob();

      saveAs(blob, `${name?.content ?? user?.name ?? 'cv'}.pdf`);
    }
  };

  if (cvMinute)
    return (
      <div className="flex justify-center flex-col">
        <div className="w-full px-8 h-20 border-b border-gray-200 bg-white flex items-center">
          <div className="w-full flex justify-center items-center gap-5">
            <button
              onClick={(event) => {
                const data: PopupInterface = {
                  title: 'Guide de rédaction',
                  type: 'guide',
                  static: true,
                  fields: [],
                };

                handleGetPosition(event, 'left', { y: 80, x: 255 });
                if (isOpen) {
                  handleClosePopup();
                  setTempData(data);
                } else {
                  handleOpenPopup(data);
                }
              }}
              className="step-1 flex justify-center items-center gap-2 h-12 px-6 font-semibold rounded-sm text-sm bg-[#e5e7eb] hover:opacity-80 cursor-pointer select-none"
            >
              Guide de rédaction du CV
            </button>
            <button
              onClick={() => setReview(true)}
              className="step-2 flex justify-center items-center gap-2 h-12 px-6 font-semibold rounded-sm text-sm bg-[#e5e7eb] hover:opacity-80 cursor-pointer select-none"
            >
              Relire l’offre
            </button>
            <button
              onClick={() => setShowMatching(true)}
              className="step-3 flex justify-center items-center gap-2 h-12 px-6 font-semibold rounded-sm text-sm bg-[#e5e7eb] hover:opacity-80 cursor-pointer select-none"
            >
              Matching score
            </button>
            <button
              onClick={() => setShowOptimize(true)}
              className="step-4 flex justify-center items-center gap-2 h-12 px-6 font-semibold rounded-sm text-sm bg-[#e5e7eb] hover:opacity-80 cursor-pointer select-none"
            >
              Optimiser en un clic
            </button>
            <Link
              href="/cv-offres"
              onClick={() => setRedirectLoading(true)}
              className={`step-5 flex justify-center items-center gap-2 h-12 px-6 rounded-sm text-sm font-semibold bg-[#e5e7eb] select-none ${
                redirectLoading
                  ? 'opacity-80 pointer-events-none'
                  : 'hover:opacity-80'
              }`}
            >
              {redirectLoading && (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-5 h-5 animate-spin"
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
              <span>Enregistrer le CV et l’offre</span>
            </Link>
            <button
              onClick={handleDownload}
              className="step-6 flex justify-center items-center gap-2 h-12 py-3 ps-4 pe-6 font-semibold rounded-sm text-sm text-white bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] hover:opacity-80 cursor-pointer select-none"
            >
              <Download size={20} />
              <span>Télécharger le CV</span>
            </button>
          </div>
        </div>

        <div className="relative h-[calc(100vh-5rem)] w-full overflow-y-auto">
          <div
            className="w-full flex justify-center p-10"
            style={{ fontSize: `${fontSize}px` }}
          >
            <div className="w-full flex flex-col items-center gap-6">
              <div className="w-full max-w-[50rem] flex justify-between bg-white shadow p-1 rounded-md">
                <button
                  onClick={(event) => {
                    const data: PopupInterface = {
                      title: 'Déscriptions',
                      type: 'desc',
                      static: true,
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
                  className="h-full px-4 text-sm bg-[#e5e7eb] rounded-sm cursor-pointer transition-opacity duration-150 hover:opacity-80"
                >
                  Comment ça marche ?
                </button>

                <div className="flex items-center gap-3">
                  <i
                    onClick={increaseFontSize}
                    className="h-8 w-8 flex justify-center items-center hover:bg-[#f3f4f6] cursor-pointer rounded-sm"
                  >
                    <ZoomIn size={22} />
                  </i>
                  <i
                    onClick={decreaseFontSize}
                    className="h-8 w-8 flex justify-center items-center hover:bg-[#f3f4f6] cursor-pointer rounded-sm"
                  >
                    <ZoomOut size={22} />
                  </i>
                  <i
                    onClick={resetFontSize}
                    className="h-8 w-8 flex justify-center items-center hover:bg-[#f3f4f6] cursor-pointer rounded-sm"
                  >
                    <CaptionsOff size={22} />
                  </i>
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
                              large: true,
                              openly: true,
                              conseil: cvMinute.advices.find(
                                (a) => a.type === 'cvMinuteAdvice',
                              )?.content,
                              suggestionTitle: 'Idées de rubrique',
                              suggestionKey: 'title',
                              onGenerate: async () =>
                                await handleGenerateNewCvMinuteSections(),
                              newEditableSection: true,
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
                          className="step-11 h-[2.5em] w-[2.5em] flex justify-center items-center shadow rounded-full bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] text-white hover:opacity-80 cursor-pointer"
                        >
                          <Plus className="h-[1.5em]" />
                        </i>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="text-white text-[0.75em] shadow bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
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
                              newContact: true,
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
                          className="step-12 h-[2.5em] w-[2.5em] flex justify-center items-center shadow rounded-full text-white bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] hover:opacity-80 cursor-pointer"
                        >
                          <UserPlus className="h-[1.5em]" />
                        </i>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="text-white text-[0.75em] shadow bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
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
                          className="step-13 h-[2.5em] w-[2.5em] flex justify-center items-center shadow rounded-full text-white bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] hover:opacity-80 cursor-pointer"
                        >
                          <Brush className="h-[1.5em]" />
                        </i>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="text-white text-[0.75em] shadow bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
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
                  <div className="h-full flex flex-col items-center">
                    <div className="w-full flex flex-col gap-[0.75em]">
                      {profile && (
                        <div className="flex justify-center">
                          <label
                            htmlFor="cvMinute-profile"
                            className="step-10 w-[10em] h-[10em] rounded-full bg-white flex items-center justify-center select-none"
                          >
                            {user && profile && profile.files.length > 0 ? (
                              <Image
                                src={`${backendUri}/uploads/files/user-${
                                  user.id
                                }/${
                                  profile.files[profile.files.length - 1].name
                                }`}
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
                                  cvMinuteSectionId: profile.id,
                                })
                              }
                              id="cvMinute-profile"
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
                                cvMinuteSectionId: firstname.id,
                                updateFirstname: true,
                                fields: [
                                  {
                                    label: 'Prénom(s)',
                                    type: 'input',
                                    key: 'content',
                                    requiredError: 'Prénom requis',
                                    placeholder:
                                      firstname.content ?? 'Votre prénom',
                                    value: firstname.content ?? '',
                                    initialValue: firstname.content ?? '',
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
                            {firstname.content ?? 'Prénom(s)'}
                          </h2>
                        )}

                        {name && (
                          <h1
                            onClick={(event) => {
                              const data: PopupInterface = {
                                cvMinuteSectionId: name.id,
                                updateName: true,
                                fields: [
                                  {
                                    label: 'NOM',
                                    type: 'input',
                                    key: 'content',
                                    requiredError: 'Nom requis',
                                    placeholder: name.content ?? 'Votre nom',
                                    value: name.content ?? '',
                                    initialValue: name.content ?? '',
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
                            {name.content ?? 'NOM'}
                          </h1>
                        )}
                      </div>
                    </div>

                    {contacts && contacts.length > 0 && (
                      <div className="relative w-full flex flex-col justify-between text-[0.875em] px-[0.25em]">
                        {contacts.map((c, index) => (
                          <div
                            key={`contact-${c.id}`}
                            draggable
                            onDragStart={() =>
                              handleDragStart({
                                type: 'contact',
                                dragId: c.id,
                                dragIndex: index + 1,
                              })
                            }
                            onDragOver={handleDragOver}
                            onDrop={(event) =>
                              handleDropCvMinuteSection({
                                event,
                                type: 'contact',
                                dropId: c.id,
                                dropIndex: index + 1,
                              })
                            }
                            onClick={(event) => {
                              const data: PopupInterface = {
                                title:
                                  'Modifier ou supprimer contact, lien, adresse...',
                                hidden: false,
                                actionLabel: 'Supprimer',
                                onClick: async () =>
                                  await handleDeleteCvMinuteSection(c.id),
                                cvMinuteSectionId: c.id,
                                updateContact: true,
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

                              handleGetPosition(event, 'left', {
                                y: 80,
                                x: 80,
                              });
                              if (isOpen) {
                                handleClosePopup();
                                setTempData(data);
                              } else {
                                handleOpenPopup(data);
                              }
                            }}
                            className="flex-1 flex items-center gap-[0.375em] p-[0.25em] group relative hover:bg-[#f3f4f6]/25"
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
                        {editableSections.map((s, index) => {
                          const cvMinuteSection = getCvMinuteSection(s.name);
                          if (cvMinuteSection)
                            return (
                              <div
                                key={`editableSection-${s.id}`}
                                draggable
                                onDragStart={() =>
                                  handleDragStart({
                                    type: 'editableSection',
                                    dragId: cvMinuteSection.id,
                                    dragIndex: index + 1,
                                  })
                                }
                                onDragOver={handleDragOver}
                                onDrop={(event) =>
                                  handleDropCvMinuteSection({
                                    event,
                                    type: 'editableSection',
                                    dropId: cvMinuteSection.id,
                                    dropIndex: index + 1,
                                  })
                                }
                                onClick={(event) => {
                                  const data: PopupInterface = {
                                    title: 'Modifier ou supprimer la rubrique',
                                    conseil: cvMinuteSection.advices.find(
                                      (a) => a.type === 'cvMinuteSectionAdvice',
                                    )?.content,
                                    suggestionTitle: 'Idées de rubrique',
                                    actionLabel: 'Supprimer la rubrique',
                                    onClick: async () =>
                                      await handleDeleteCvMinuteSection(s.id),
                                    cvMinuteSectionId: cvMinuteSection.id,
                                    updateEditableSection: true,
                                    fields: [
                                      {
                                        label: 'Nom de la rubrique',
                                        type: 'input',
                                        key: 'name',
                                        requiredError:
                                          'Nom de la rubrique requis',
                                        placeholder:
                                          cvMinuteSection.name ?? 'Nom...',
                                        value: cvMinuteSection.name ?? '',
                                        initialValue:
                                          cvMinuteSection.name ?? '',
                                      },
                                      {
                                        label: 'Description',
                                        type: 'textarea',
                                        key: 'content',
                                        requiredError:
                                          'Description de la rubrique requise',
                                        placeholder:
                                          cvMinuteSection?.content ??
                                          'Description...',
                                        value: cvMinuteSection?.content ?? '',
                                        initialValue:
                                          cvMinuteSection?.content ?? '',
                                      },
                                    ],
                                  };

                                  handleGetPosition(event, 'left', {
                                    y: 80,
                                    x: 80,
                                  });
                                  if (isOpen) {
                                    handleClosePopup();
                                    setTempData(data);
                                  } else {
                                    handleOpenPopup(data);
                                  }
                                }}
                                className="relative flex-1 w-full mt-[1em] hover:bg-[#f3f4f6]/25 p-[0.25em]"
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

                                <div className="absolute -left-[4em] top-0 flex flex-col gap-[0.5em]">
                                  <TooltipProvider>
                                    <Tooltip delayDuration={700}>
                                      <TooltipTrigger asChild>
                                        <i className="text-[var(--u-primary-color)] opacity-80 hover:opacity-100 transition-opacity duration-150 cursor-pointer">
                                          <Zap
                                            size={
                                              (fontSize + 16) * (fontSize / 16)
                                            }
                                          />
                                        </i>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="left"
                                        className="text-white text-[0.75em] shadow bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] px-[0.5em] py-[0.25em] me-[0.25em] rounded-[0.25em]"
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
                          section: 'title',
                          title: 'Titre du CV',
                          large: true,
                          openly: true,
                          conseil: title.advices.find(
                            (a) => a.type === 'cvMinuteSectionAdvice',
                          )?.content,
                          onGenerate: async () => {
                            await handleGenerateCvMinuteSectionAdvices(
                              title.id,
                            );
                          },
                          suggestionTitle: 'Idées de titre du CV',
                          suggestionKey: 'content',
                          cvMinuteSectionId: title.id,
                          updateTitle: true,
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
                              placeholder: title.content ?? 'Titre...',
                              value: title.content ?? '',
                              initialValue: title.content ?? '',
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
                      className="step-7 flex justify-between items-center hover:bg-[#f3f4f6] px-[0.25em] py-[0.25em]"
                    >
                      <h1 className="text-[1.75em] leading-[1.125em] font-bold text-[#101828]">
                        {title.content ?? 'Titre du CV'}
                      </h1>
                    </div>
                  )}

                  {presentation && (
                    <div
                      onClick={(event) => {
                        const data: PopupInterface = {
                          align: 'right',
                          section: 'presentation',
                          title: 'Ajouter une presentation',
                          conseil: presentation.advices.find(
                            (a) => a.type === 'cvMinuteSectionAdvice',
                          )?.content,
                          onGenerate: async () => {
                            await handleGenerateCvMinuteSectionAdvices(
                              presentation.id,
                            );
                          },
                          large: true,
                          openly: true,
                          suggestionTitle: 'Idées de présentation',
                          suggestionKey: 'content',
                          cvMinuteSectionId: presentation.id,
                          updatePresentation: true,
                          fields: [
                            {
                              label: 'Présentation',
                              type: 'textarea',
                              key: 'content',
                              requiredError: 'Présentation requise',
                              placeholder:
                                presentation.content ?? 'Présentation...',
                              value: presentation.content ?? '',
                              initialValue: presentation.content ?? '',
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
                      className="step-8 flex justify-between text-[#364153] hover:bg-[#f3f4f6] p-[0.5em] text-[0.875em] whitespace-pre-line"
                    >
                      <p>
                        {presentation.content ??
                          'Résumé du profil professionnel'}
                      </p>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col gap-[0.5em]">
                    <div
                      onClick={(event) => {
                        const data: PopupInterface = {
                          align: 'right',
                          title: 'Ajouter une expérience',
                          newExperience: true,
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
                              <i className="text-[var(--u-primary-color)] opacity-80 hover:opacity-100 transition-opacity duration-150 cursor-pointer">
                                <Triangle
                                  size={(fontSize + 16) * (fontSize / 16)}
                                  fill={'currentColor'}
                                />
                              </i>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              className="text-white text-[0.75em] shadow bg-gradient-to-r from-[var(--u-primary-color)] to-[#8B5CF6] px-[0.5em] py-[0.25em] ms-[0.25em] rounded-[0.25em]"
                            >
                              <p>Ajouter expérience</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {experiences && experiences.length > 0 ? (
                      <div className="flex-1 flex flex-col justify-between gap-[0.375em]">
                        {experiences.map((item, index) => (
                          <div
                            key={`experience-${item.id}`}
                            draggable
                            onDragStart={() =>
                              handleDragStart({
                                dragId: item.id,
                                type: 'experience',
                                dragIndex: index + 1,
                              })
                            }
                            onDragOver={handleDragOver}
                            onDrop={(event) =>
                              handleDropCvMinuteSection({
                                event,
                                dropId: item.id,
                                type: 'experience',
                                dropIndex: index + 1,
                              })
                            }
                            onClick={(event) => {
                              const data: PopupInterface = {
                                align: 'right',
                                section: 'experiences',
                                title: "Optimiser l'expérience",
                                actionLabel: 'Recalculer le score de  matching',
                                large: true,
                                openly: true,
                                withScore: true,
                                suggestionTitle: 'Idées de redactions',
                                suggestionKey: 'content',
                                onClick: async () =>
                                  await handleRecalculateExperienceMatching(
                                    item.id,
                                  ),
                                onGenerate: async () =>
                                  await handleGenerateCvMinuteSectionAdvices(
                                    item.id,
                                  ),
                                cvMinuteSectionId: item.id,
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
                                    show: false,
                                  },
                                  {
                                    label: "Nom de l'entreprise",
                                    type: 'input',
                                    key: 'company',
                                    requiredError: "Nom de l'entreprise requis",
                                    placeholder:
                                      item.company ?? 'Entreprise...',
                                    value: item.company ?? '',
                                    initialValue: item.company ?? '',
                                    show: false,
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
                                    show: false,
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
                                    show: false,
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

                              handleGetPosition(event, 'right', {
                                y: 80,
                                x: 255,
                              });
                              if (isOpen) {
                                handleClosePopup();
                                setTempData(data);
                              } else {
                                handleOpenPopup(data);
                              }
                            }}
                            className="flex-1 flex flex-col gap-[0.5em] p-[0.25em] hover:bg-[#f3f4f6]"
                          >
                            <div
                              onClick={(event) => {
                                event.stopPropagation();

                                const data: PopupInterface = {
                                  align: 'right',
                                  title: "Modifier ou supprimer l'expérience",
                                  actionLabel: "Supprimer l'expérience",
                                  onClick: async () =>
                                    await handleDeleteCvMinuteSection(item.id),
                                  cvMinuteSectionId: item.id,
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
                                      show: false,
                                      requiredError: 'Description requise',
                                      placeholder:
                                        item.content ?? 'Description...',
                                      value: item.content ?? '',
                                      initialValue: item.content ?? '',
                                    },
                                  ],
                                };

                                handleGetPosition(event, 'center', { y: 80 });
                                if (isOpen) {
                                  handleClosePopup();
                                  setTempData(data);
                                } else {
                                  handleOpenPopup(data);
                                }
                              }}
                              className="flex flex-col gap-[0.25em] hover:bg-[#f3f4f6]"
                            >
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

                            {item.evaluation && (
                              <div className="absolute -right-[13em] w-[12em] flex flex-col gap-[0.5em]">
                                <div className="flex items-center justify-between">
                                  <span className="text-[0.875em] font-medium text-[#4a5565] truncate">
                                    {item.title}
                                  </span>
                                  <span className="text-[0.875em] font-semibold text-primary">
                                    {item.evaluation.actualScore ??
                                      item.evaluation.initialScore}
                                    %
                                  </span>
                                </div>
                                <div className="relative h-[0.5em] bg-[#e5e7eb] rounded-full overflow-hidden">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ffccd3] to-[#8B5CF6] rounded-full transition-all duration-300"
                                    style={{
                                      width: `${
                                        item.evaluation.actualScore ??
                                        item.evaluation.initialScore
                                      }%`,
                                    }}
                                  />
                                </div>
                                <button className="w-full text-[0.75em] font-semibold hover:text-[var(--u-primary-color)] cursor-pointer">
                                  Optimiser cette expérience
                                </button>
                              </div>
                            )}
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

            {isOpen &&
              popup &&
              (popup.updateBg ||
                popup.updateName ||
                popup.updateFirstname ||
                popup.updateContact ||
                popup.updateEditableSection ||
                popup.updateTitle ||
                popup.updatePresentation ||
                popup.updateExperience ||
                popup.newExperience ||
                popup.newEditableSection ||
                popup.newContact ||
                popup.static) && (
                <div className="fixed top-0 left-0 z-50 w-full h-full bg-black/20">
                  <EditPopup
                    popup={popup}
                    cvMinuteId={cvMinute.id}
                    currentPosition={currentPosition}
                    setCurrentPosition={setCurrentPosition}
                    handleClosePopup={handleClosePopup}
                  />
                </div>
              )}

            {showVideo && (
              <Popup full onClose={() => setShowVideo(false)}>
                <div className="p-4 h-[32rem] w-[60rem]">
                  {videoUri ? (
                    <iframe
                      src={handleVideo(videoUri)}
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
              <Popup large onClose={() => setReview(false)}>
                <div
                  className="max-h-[80vh] p-5 overflow-y-auto [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
                  style={{ fontSize: '1rem' }}
                >
                  <p className="whitespace-pre-line">{cvMinute.position}</p>
                </div>
              </Popup>
            )}

            {showOptimize && (
              <Popup large onClose={() => setShowOptimize(false)}>
                <div
                  className="max-h-[80vh] p-5 overflow-y-auto [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
                  style={{ fontSize: '1rem' }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-[0.5em]">
                      <i className="text-red-400">
                        <Goal />
                      </i>
                      <h6 className="font-semibold">
                        Voici ce que la Master Optimisation va améliorer sur
                        votre CV
                      </h6>
                    </div>
                    <div className="flex flex-col gap-1 py-2">
                      {optimizeOptions.map((item) => (
                        <div key={item.bold} className="flex gap-[0.5em]">
                          <i className="text-green-500">
                            <SquareCheck
                              fill={'currentColor'}
                              stroke={'white'}
                            />
                          </i>

                          <p className="text-sm">
                            <span className="font-semibold">{item.bold}</span>{' '}
                            {item.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-[0.5em]">
                      <i className="text-yellow-400">
                        <Wallet fill={'currentColor'} stroke={'white'} />
                      </i>
                      <p className="font-semibold">
                        Coût estimé : <span>20 Crédits</span>
                      </p>
                    </div>
                    <div className="flex gap-[0.5em]">
                      <i className="text-yellow-400">
                        <TriangleAlert fill={'currentColor'} stroke={'white'} />
                      </i>
                      <p>
                        <span className="font-semibold">Important : </span>
                        Chaque modification doit être assumée en entretien.{' '}
                        <br />
                        Prenez le temps de
                        <span className="font-semibold">
                          {' '}
                          relire et valider{' '}
                        </span>
                        votre CV après optimisation
                      </p>
                    </div>
                    <div className="flex items-center gap-[0.5em]">
                      <i className="text-red-400">
                        <Rocket />
                      </i>
                      <p className="font-semibold">
                        Souhaitez-vous appliquer ces améliorations ?
                      </p>
                    </div>
                    <div className="flex gap-6">
                      <button
                        onClick={() => setShowOptimize(false)}
                        className="w-full p-3 rounded-md border border-gray-500 select-none transition-opacity duration-150 cursor-pointer hover:opacity-80"
                      >
                        Revenir sur mon CV
                      </button>
                      <PrimaryButton
                        label="Appliquer"
                        isLoading={loadingOptimize}
                        onClick={handleOptimizeCvMinute}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </Popup>
            )}

            {showMatching && (
              <Popup large onClose={() => setShowMatching(false)}>
                <div
                  style={{ fontSize: '1rem' }}
                  className="max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:w-[0.325em] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
                >
                  <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                    <h3 className="text-xl font-bold mb-6">
                      Score de Matching
                    </h3>

                    {cvMinute.evaluation && (
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
                                  2 *
                                  Math.PI *
                                  30 *
                                  (1 - cvMinute.evaluation.initialScore / 100)
                                }`}
                                transform="rotate(90 40 40)"
                              />
                            </svg>
                            <span className="absolute text-lg font-bold">
                              {cvMinute.evaluation.initialScore}%
                            </span>
                          </div>
                        </div>

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
                                  2 *
                                  Math.PI *
                                  30 *
                                  (1 -
                                    (cvMinute.evaluation.actualScore
                                      ? cvMinute.evaluation.actualScore
                                      : cvMinute.evaluation.initialScore) /
                                      100)
                                }`}
                                transform="rotate(90 40 40)"
                              />
                            </svg>
                            <span className="absolute text-lg font-bold">
                              {cvMinute.evaluation.actualScore
                                ? cvMinute.evaluation.actualScore
                                : cvMinute.evaluation.initialScore}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <h4 className="text-base font-semibold mb-2">
                        L'analyse de Coach Victorien :
                      </h4>
                      <p className="text-sm underline underline-offset-2 text-gray-600">
                        Recommendations :
                      </p>
                      <p className="text-sm text-gray-500 mt-2 italic">
                        Rappel : Le score de matching est purement indicatif.
                        C'est à vous de jauger la pertinence de votre CV selon
                        vos objectifs.
                      </p>
                      <p className="text-sm text-gray-500 mt-2 italic">
                        {cvMinute.evaluation?.content}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowMatching(false)}
                        className="w-full p-3 rounded-md border border-gray-500 select-none transition-opacity duration-150 cursor-pointer hover:opacity-80"
                      >
                        Fermer
                      </button>
                      <PrimaryButton
                        label={'Recalculer'}
                        onClick={handleRecalculateGlobalMatching}
                        isLoading={loadingGlobal}
                        className="rounded-md"
                      />
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
            onClose={() => setShowGuide(false)}
          />
        )}
      </div>
    );
}
