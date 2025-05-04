import { createSlice } from '@reduxjs/toolkit';
import { CvThequeCritereInterface } from '@/interfaces/role/recruiter/cvtheque/cvtheque-critere.interface';
import { SectionInterface } from '@/interfaces/role/user/cv-minute/section.interface';
import { CvMinuteInterface } from '@/interfaces/role/user/cv-minute/cvMinute.interface';

const initialState: {
  cvThequeCritere: CvThequeCritereInterface | null;
  cvAnonym: CvMinuteInterface | null;
  sections: SectionInterface[];
  history: CvThequeCritereInterface[];
} = {
  cvThequeCritere: null,
  cvAnonym: null,
  sections: [],
  history: [],
};

const cvThequeSlice = createSlice({
  name: 'cvTheque',
  initialState,
  reducers: {
    setCvThequeHistoryReducer: (state, action) => {
      const { history }: { history: CvThequeCritereInterface[] } =
        action.payload;
      state.history = history;
    },
    setCvThequeCritereReducer: (state, action) => {
      const { cvThequeCritere }: { cvThequeCritere: CvThequeCritereInterface } =
        action.payload;

      state.cvThequeCritere = cvThequeCritere;
      state.cvAnonym = null;
      state.sections = [];
    },
    setCvAnonymReducer: (state, action) => {
      const {
        cvAnonym,
        sections,
      }: { cvAnonym: CvMinuteInterface; sections: SectionInterface[] } =
        action.payload;

      state.cvAnonym = cvAnonym;
      state.sections = sections;
    },
    resetCvAnonymReducer: (state) => {
      state.cvAnonym = null;
      state.sections = [];
    },
    resetCvThequeReducer: () => {
      return initialState;
    },
  },
});

export const {
  setCvThequeHistoryReducer,
  setCvThequeCritereReducer,
  setCvAnonymReducer,
  resetCvAnonymReducer,
  resetCvThequeReducer,
} = cvThequeSlice.actions;

export default cvThequeSlice.reducer;
