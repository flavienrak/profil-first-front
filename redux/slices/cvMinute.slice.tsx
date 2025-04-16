import { CvMinuteInterface } from '@/interfaces/cvMinute.interface';
import { CvMinuteSectionInterface } from '@/interfaces/cvMinuteSection.interface';
import { EvaluationInterface } from '@/interfaces/evaluation.interface';
import { FileInterface } from '@/interfaces/file.interface';
import { SectionInterface } from '@/interfaces/section.interface';
import { SectionInfoInterface } from '@/interfaces/sectionInfo.interface';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  cvMinute: CvMinuteInterface | null;
  files: FileInterface[];
  sections: SectionInterface[];
  cvMinuteSections: CvMinuteSectionInterface[];
} = {
  cvMinute: null,
  files: [],
  sections: [],
  cvMinuteSections: [],
};

const cvMinuteSlice = createSlice({
  name: 'cvMinute',
  initialState,
  reducers: {
    setCvMinuteReducer: (state, action) => {
      const {
        cvMinute,
        files,
        sections,
        cvMinuteSections,
      }: {
        cvMinute: CvMinuteInterface;
        files: FileInterface[];
        sections: SectionInterface[];
        cvMinuteSections: CvMinuteSectionInterface[];
      } = action.payload;

      if (cvMinute) {
        state.cvMinute = cvMinute;
      }
      if (files) {
        state.files = files;
      }
      if (sections) {
        state.sections = sections;
      }
      if (cvMinuteSections) {
        state.cvMinuteSections = cvMinuteSections;
      }
    },
    updateCvMinuteReducer: (state, action) => {
      const {
        file,
        section,
        cvMinute,
        cvMinuteSection,
      }: {
        file?: FileInterface;
        section?: SectionInterface;
        cvMinute?: CvMinuteInterface;
        cvMinuteSection?: CvMinuteSectionInterface;
      } = action.payload;

      if (cvMinute && state.cvMinute) {
        state.cvMinute = {
          ...state.cvMinute,
          primaryBg: cvMinute.primaryBg,
          secondaryBg: cvMinute.secondaryBg,
          tertiaryBg: cvMinute.tertiaryBg,
        };
      }

      if (section) {
        const index = state.sections.findIndex((c) => c.id === section.id);

        if (index !== -1) {
          state.sections[index] = section;
        } else {
          state.sections.push(section);
        }
      }

      if (cvMinuteSection) {
        const index = state.cvMinuteSections.findIndex(
          (c) => c.id === cvMinuteSection.id,
        );

        if (index !== -1) {
          state.cvMinuteSections[index] = cvMinuteSection;
        } else {
          state.cvMinuteSections.push(cvMinuteSection);
        }
      }

      if (file) {
        const index = state.files.findIndex((f) => f.id === file.id);

        if (index !== -1) {
          state.files[index] = file;
        } else {
          state.files.push(file);
        }
      }
    },
    updateCvMinuteSectionPropositionReducer: (state, action) => {
      const { cvMinute }: { cvMinute: CvMinuteInterface } = action.payload;

      if (state.cvMinute && state.cvMinute.id === cvMinute.id) {
        state.cvMinute = {
          ...state.cvMinute,
          advices: cvMinute.advices,
        };
      }
    },
    updateCvMinuteScoreReducer: (state, action) => {
      const {
        evaluation,
        cvMinuteId,
      }: {
        evaluation: EvaluationInterface;
        cvMinuteId: number;
      } = action.payload;

      if (state.cvMinute && state.cvMinute.id === cvMinuteId) {
        state.cvMinute = {
          ...state.cvMinute,
          evaluation,
        };
      }
    },
    updateSectionInfoOrderReducer: (state, action) => {
      const {
        section,
        targetSection,
        cvMinuteSectionId,
      }: {
        section: SectionInfoInterface;
        targetSection: SectionInfoInterface;
        cvMinuteSectionId: number;
      } = action.payload;

      state.cvMinuteSections.forEach((c) => {
        if (c.id === cvMinuteSectionId) {
          c.sectionInfos = c.sectionInfos.map((s) => {
            if (s.id === section.id) {
              return { ...s, order: section.order };
            } else if (s.id === targetSection.id) {
              return { ...s, order: targetSection.order };
            }
            return s;
          });
        }
      });
    },
    updateSectionInfoAdviceReducer: (state, action) => {
      const {
        sectionInfo,
        cvMinuteSectionId,
      }: {
        sectionInfo: SectionInfoInterface;
        cvMinuteSectionId: number;
      } = action.payload;

      state.cvMinuteSections.forEach((c) => {
        if (c.id === cvMinuteSectionId) {
          c.sectionInfos = c.sectionInfos.map((s) => {
            if (s.id === sectionInfo.id) {
              return { ...s, advices: sectionInfo.advices };
            }
            return s;
          });
        }
      });
    },
    updateSectionInfoScoreReducer: (state, action) => {
      const {
        evaluation,
        sectionInfoId,
        cvMinuteSectionId,
      }: {
        evaluation: EvaluationInterface;
        sectionInfoId: number;
        cvMinuteSectionId: number;
      } = action.payload;

      state.cvMinuteSections.forEach((c) => {
        if (c.id === cvMinuteSectionId) {
          c.sectionInfos = c.sectionInfos.map((s) => {
            if (s.id === sectionInfoId) {
              return { ...s, evaluation: evaluation };
            }
            return s;
          });
        }
      });
    },
    updateCvMinuteSectionOrderReducer: (state, action) => {
      const {
        cvMinuteSection,
        targetCvMinuteSection,
      }: {
        cvMinuteSection: CvMinuteSectionInterface;
        targetCvMinuteSection: CvMinuteSectionInterface;
      } = action.payload;

      state.cvMinuteSections = state.cvMinuteSections.map((c) => {
        if (c.id === cvMinuteSection.id) {
          return { ...c, sectionOrder: cvMinuteSection.sectionOrder };
        } else if (c.id === targetCvMinuteSection.id) {
          return { ...c, sectionOrder: targetCvMinuteSection.sectionOrder };
        }
        return c;
      });
    },
    deleteSectionInfoReducer: (state, action) => {
      const {
        section,
        cvMinuteSectionId,
      }: {
        section: SectionInfoInterface;
        cvMinuteSectionId: number;
      } = action.payload;

      state.cvMinuteSections.forEach((c) => {
        if (c.id === cvMinuteSectionId) {
          c.sectionInfos = c.sectionInfos.filter((s) => s.id !== section.id);
        }
      });
    },
    deleteCvMinuteSectionReducer: (state, action) => {
      const {
        cvMinuteSection,
      }: {
        cvMinuteSection: CvMinuteInterface;
      } = action.payload;

      state.cvMinuteSections = state.cvMinuteSections.filter(
        (c) => c.id !== cvMinuteSection.id,
      );
    },
  },
});

export const {
  setCvMinuteReducer,
  updateCvMinuteReducer,
  updateCvMinuteSectionPropositionReducer,
  updateCvMinuteScoreReducer,
  updateSectionInfoOrderReducer,
  updateSectionInfoAdviceReducer,
  updateSectionInfoScoreReducer,
  updateCvMinuteSectionOrderReducer,
  deleteSectionInfoReducer,
  deleteCvMinuteSectionReducer,
} = cvMinuteSlice.actions;

export default cvMinuteSlice.reducer;
