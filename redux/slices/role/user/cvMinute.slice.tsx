import { createSlice } from '@reduxjs/toolkit';
import { CvMinuteInterface } from '@/interfaces/role/user/cv-minute/cvMinute.interface';
import { CvMinuteSectionInterface } from '@/interfaces/role/user/cv-minute/cvMinuteSection.interface';
import { EvaluationInterface } from '@/interfaces/evaluation.interface';
import { FileInterface } from '@/interfaces/file.interface';

const initialState: {
  cvMinute: CvMinuteInterface | null;
  cvMinutes: CvMinuteInterface[];
} = {
  cvMinute: null,
  cvMinutes: [],
};

const cvMinuteSlice = createSlice({
  name: 'cvMinute',
  initialState,
  reducers: {
    setCvMinuteReducer: (state, action) => {
      const data: {
        cvMinute: CvMinuteInterface;
        cvMinutes: CvMinuteInterface[];
      } = action.payload;

      if (data.cvMinute) {
        state.cvMinute = data.cvMinute;
      }
      if (data.cvMinutes) {
        state.cvMinutes = data.cvMinutes;
      }
    },
    updateCvMinuteReducer: (state, action) => {
      const data: { cvMinute: CvMinuteInterface } = action.payload;

      if (state.cvMinute) {
        state.cvMinute = {
          ...state.cvMinute,
          ...data.cvMinute,
        };
      }
    },
    updateCvMinuteSectionReducer: (state, action) => {
      const data: { cvMinuteSection: CvMinuteSectionInterface } =
        action.payload;

      if (state.cvMinute) {
        const index = state.cvMinute.cvMinuteSections.findIndex(
          (c) => c.id === data.cvMinuteSection.id,
        );

        if (index !== -1) {
          state.cvMinute.cvMinuteSections[index] = data.cvMinuteSection;
        } else {
          state.cvMinute.cvMinuteSections.unshift(data.cvMinuteSection);
        }
      }
    },
    updateCvMinuteProfileReducer: (state, action) => {
      const data: { file: FileInterface } = action.payload;

      if (state.cvMinute) {
        state.cvMinute = {
          ...state.cvMinute,
          cvMinuteSections: state.cvMinute.cvMinuteSections.map((c) =>
            c.id === data.file.cvMinuteSectionId
              ? { ...c, files: [...c.files, data.file] }
              : c,
          ),
        };
      }
    },
    updateOneCvMinuteReducer: (state, action) => {
      const data: { cvMinute: CvMinuteInterface } = action.payload;
      state.cvMinutes = state.cvMinutes.map((c) =>
        c.id === data.cvMinute.id ? { ...c, ...data.cvMinute } : c,
      );
    },
    updateCvMinuteAdvicesReducer: (state, action) => {
      const data: { cvMinute: CvMinuteInterface } = action.payload;

      if (state.cvMinute && state.cvMinute.id === data.cvMinute.id) {
        state.cvMinute = {
          ...state.cvMinute,
          advices: data.cvMinute.advices,
          updatedAt: data.cvMinute.updatedAt,
        };
      }
    },
    updateCvMinuteScoreReducer: (state, action) => {
      const data: { evaluation: EvaluationInterface } = action.payload;

      if (state.cvMinute && state.cvMinute.id === data.evaluation.cvMinuteId) {
        state.cvMinute = {
          ...state.cvMinute,
          evaluation: data.evaluation,
        };
      }
    },
    updateCvMinuteSectionAdvicesReducer: (state, action) => {
      const data: {
        cvMinuteSection: CvMinuteSectionInterface;
      } = action.payload;

      if (state.cvMinute) {
        state.cvMinute.cvMinuteSections = state.cvMinute.cvMinuteSections.map(
          (c) => {
            if (c.id === data.cvMinuteSection.id) {
              return { ...c, advices: data.cvMinuteSection.advices };
            }
            return c;
          },
        );
      }
    },
    updateCvMinuteSectionOrderReducer: (state, action) => {
      const data: {
        cvMinuteSection: CvMinuteSectionInterface;
        targetCvMinuteSection: CvMinuteSectionInterface;
      } = action.payload;

      if (state.cvMinute?.cvMinuteSections) {
        state.cvMinute.cvMinuteSections = state.cvMinute.cvMinuteSections.map(
          (c) => {
            if (c.id === data.cvMinuteSection.id) {
              return { ...c, order: data.cvMinuteSection.order };
            } else if (c.id === data.targetCvMinuteSection.id) {
              return {
                ...c,
                order: data.targetCvMinuteSection.order,
              };
            }
            return c;
          },
        );
      }
    },
    deleteCvMinuteSectionReducer: (state, action) => {
      const data: {
        cvMinuteSection: CvMinuteInterface;
      } = action.payload;

      if (state.cvMinute?.cvMinuteSections) {
        state.cvMinute.cvMinuteSections =
          state.cvMinute.cvMinuteSections.filter(
            (c) => c.id !== data.cvMinuteSection.id,
          );
      }
    },
    deleteCvMinuteReducer: (state, action) => {
      const data: { cvMinute: CvMinuteInterface } = action.payload;

      state.cvMinutes = state.cvMinutes.filter(
        (c) => c.id !== data.cvMinute.id,
      );
    },
  },
});

export const {
  setCvMinuteReducer,
  updateCvMinuteReducer,
  updateOneCvMinuteReducer,
  updateCvMinuteProfileReducer,
  updateCvMinuteSectionReducer,
  updateCvMinuteAdvicesReducer,
  updateCvMinuteScoreReducer,
  updateCvMinuteSectionAdvicesReducer,
  updateCvMinuteSectionOrderReducer,
  deleteCvMinuteSectionReducer,
  deleteCvMinuteReducer,
} = cvMinuteSlice.actions;

export default cvMinuteSlice.reducer;
