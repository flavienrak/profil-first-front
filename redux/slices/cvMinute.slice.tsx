import { CvMinuteInterface } from '@/interfaces/cv-minute/cvMinute.interface';
import { CvMinuteSectionInterface } from '@/interfaces/cv-minute/cvMinuteSection.interface';
import { EvaluationInterface } from '@/interfaces/cv-minute/evaluation.interface';
import { FileInterface } from '@/interfaces/file.interface';
import { SectionInterface } from '@/interfaces/cv-minute/section.interface';
import { SectionInfoInterface } from '@/interfaces/cv-minute/sectionInfo.interface';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  cvMinute: CvMinuteInterface | null;
  cvMinutes: CvMinuteInterface[];
  files: FileInterface[];
  sections: SectionInterface[];
  cvMinuteSections: CvMinuteSectionInterface[];
} = {
  cvMinute: null,
  cvMinutes: [],
  files: [],
  sections: [],
  cvMinuteSections: [],
};

const cvMinuteSlice = createSlice({
  name: 'cvMinute',
  initialState,
  reducers: {
    setCvMinuteReducer: (state, action) => {
      const data: {
        cvMinute: CvMinuteInterface;
        cvMinutes: CvMinuteInterface[];
        files: FileInterface[];
        sections: SectionInterface[];
        cvMinuteSections: CvMinuteSectionInterface[];
      } = action.payload;

      if (data.cvMinute) {
        state.cvMinute = data.cvMinute;
      }
      if (data.cvMinutes) {
        state.cvMinutes = data.cvMinutes;
      }
      if (data.files) {
        state.files = data.files;
      }
      if (data.sections) {
        state.sections = data.sections;
      }
      if (data.cvMinuteSections) {
        state.cvMinuteSections = data.cvMinuteSections;
      }
    },
    updateCvMinuteReducer: (state, action) => {
      const data: {
        file?: FileInterface;
        section?: SectionInterface;
        cvMinute?: CvMinuteInterface;
        cvMinuteSection?: CvMinuteSectionInterface;
      } = action.payload;

      if (data.cvMinute && state.cvMinute) {
        state.cvMinute = {
          ...state.cvMinute,
          ...data.cvMinute,
        };
      }

      if (data.section) {
        const index = state.sections.findIndex(
          (c) => c.id === data.section?.id,
        );

        if (index !== -1) {
          state.sections[index] = data.section;
        } else {
          state.sections.push(data.section);
        }
      }

      if (data.cvMinuteSection) {
        const index = state.cvMinuteSections.findIndex(
          (c) => c.id === data.cvMinuteSection?.id,
        );

        if (index !== -1) {
          state.cvMinuteSections[index] = data.cvMinuteSection;
        } else {
          state.cvMinuteSections.push(data.cvMinuteSection);
        }
      }

      if (data.file) {
        const index = state.files.findIndex((f) => f.id === data.file?.id);

        if (index !== -1) {
          state.files[index] = data.file;
        } else {
          state.files.push(data.file);
        }
      }
    },
    updateOneCvMinuteReducer: (state, action) => {
      const data: { cvMinute: CvMinuteInterface } = action.payload;
      state.cvMinutes = state.cvMinutes.map((c) =>
        c.id === data.cvMinute.id ? { ...c, ...data.cvMinute } : c,
      );
    },
    updateCvMinuteSectionPropositionReducer: (state, action) => {
      const data: { cvMinute: CvMinuteInterface } = action.payload;

      if (state.cvMinute && state.cvMinute.id === data.cvMinute.id) {
        state.cvMinute = {
          ...state.cvMinute,
          advices: data.cvMinute.advices,
        };
      }
    },
    updateCvMinuteScoreReducer: (state, action) => {
      const data: {
        evaluation: EvaluationInterface;
        cvMinuteId: number;
      } = action.payload;

      if (state.cvMinute && state.cvMinute.id === data.cvMinuteId) {
        state.cvMinute = {
          ...state.cvMinute,
          evaluation: data.evaluation,
        };
      }
    },
    updateSectionInfoOrderReducer: (state, action) => {
      const data: {
        section: SectionInfoInterface;
        targetSection: SectionInfoInterface;
        cvMinuteSectionId: number;
      } = action.payload;

      state.cvMinuteSections.forEach((c) => {
        if (c.id === data.cvMinuteSectionId) {
          c.sectionInfos = c.sectionInfos.map((s) => {
            if (s.id === data.section.id) {
              return { ...s, order: data.section.order };
            } else if (s.id === data.targetSection.id) {
              return { ...s, order: data.targetSection.order };
            }
            return s;
          });
        }
      });
    },
    updateSectionInfoPropositionReducer: (state, action) => {
      const data: {
        sectionInfo: SectionInfoInterface;
        cvMinuteSectionId: number;
      } = action.payload;

      state.cvMinuteSections.forEach((c) => {
        if (c.id === data.cvMinuteSectionId) {
          c.sectionInfos = c.sectionInfos.map((s) => {
            if (s.id === data.sectionInfo.id) {
              return { ...s, advices: data.sectionInfo.advices };
            }
            return s;
          });
        }
      });
    },
    updateSectionInfoScoreReducer: (state, action) => {
      const data: {
        evaluation: EvaluationInterface;
        sectionInfoId: number;
        cvMinuteSectionId: number;
      } = action.payload;

      state.cvMinuteSections.forEach((c) => {
        if (c.id === data.cvMinuteSectionId) {
          c.sectionInfos = c.sectionInfos.map((s) => {
            if (s.id === data.sectionInfoId) {
              return { ...s, evaluation: data.evaluation };
            }
            return s;
          });
        }
      });
    },
    updateCvMinuteSectionOrderReducer: (state, action) => {
      const data: {
        cvMinuteSection: CvMinuteSectionInterface;
        targetCvMinuteSection: CvMinuteSectionInterface;
      } = action.payload;

      state.cvMinuteSections = state.cvMinuteSections.map((c) => {
        if (c.id === data.cvMinuteSection.id) {
          return { ...c, sectionOrder: data.cvMinuteSection.sectionOrder };
        } else if (c.id === data.targetCvMinuteSection.id) {
          return {
            ...c,
            sectionOrder: data.targetCvMinuteSection.sectionOrder,
          };
        }
        return c;
      });
    },
    deleteSectionInfoReducer: (state, action) => {
      const data: {
        section: SectionInfoInterface;
        cvMinuteSectionId: number;
      } = action.payload;

      state.cvMinuteSections.forEach((c) => {
        if (c.id === data.cvMinuteSectionId) {
          c.sectionInfos = c.sectionInfos.filter(
            (s) => s.id !== data.section.id,
          );
        }
      });
    },
    deleteCvMinuteSectionReducer: (state, action) => {
      const data: {
        cvMinuteSection: CvMinuteInterface;
      } = action.payload;

      state.cvMinuteSections = state.cvMinuteSections.filter(
        (c) => c.id !== data.cvMinuteSection.id,
      );
    },
  },
});

export const {
  setCvMinuteReducer,
  updateCvMinuteReducer,
  updateOneCvMinuteReducer,
  updateCvMinuteSectionPropositionReducer,
  updateCvMinuteScoreReducer,
  updateSectionInfoOrderReducer,
  updateSectionInfoPropositionReducer,
  updateSectionInfoScoreReducer,
  updateCvMinuteSectionOrderReducer,
  deleteSectionInfoReducer,
  deleteCvMinuteSectionReducer,
} = cvMinuteSlice.actions;

export default cvMinuteSlice.reducer;
