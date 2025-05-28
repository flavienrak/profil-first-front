import { createSlice } from '@reduxjs/toolkit';
import { CvThequeCritereInterface } from '@/interfaces/role/recruiter/cvtheque/cvtheque-critere.interface';
import { CvMinuteInterface } from '@/interfaces/role/user/cv-minute/cvMinute.interface';
import { CvThequeContactInterface } from '@/interfaces/role/recruiter/cvtheque/cvtheque-contact.interface';

const initialState: {
  cvThequeCritere: CvThequeCritereInterface | null;
  cvAnonym: CvMinuteInterface | null;
  history: CvThequeCritereInterface[];
} = {
  cvThequeCritere: null,
  cvAnonym: null,
  history: [],
};

const cvThequeSlice = createSlice({
  name: 'cvTheque',
  initialState,
  reducers: {
    setCvThequeHistoryReducer: (state, action) => {
      const data: { history: CvThequeCritereInterface[] } = action.payload;
      state.history = data.history;
    },
    setCvThequeCritereReducer: (state, action) => {
      const data: { cvThequeCritere: CvThequeCritereInterface } =
        action.payload;

      state.cvThequeCritere = data.cvThequeCritere;
      state.cvAnonym = null;
    },
    setCvAnonymReducer: (state, action) => {
      const data: { cvAnonym: CvMinuteInterface } = action.payload;

      state.cvAnonym = data.cvAnonym;

      if (state.cvThequeCritere) {
        state.cvThequeCritere = {
          ...state.cvThequeCritere,
          cvMinutes: state.cvThequeCritere.cvMinutes?.map((c) =>
            c.id === data.cvAnonym.id ? data.cvAnonym : c,
          ),
        };
      }
    },
    saveCvThequeCritereReducer: (state, action) => {
      const data: { cvThequeCritere: CvThequeCritereInterface } =
        action.payload;

      const existCvThequeCritere = state.history.find(
        (c) => c.id === data.cvThequeCritere.id,
      );

      if (existCvThequeCritere) {
        const newCvThequeCritere = {
          ...existCvThequeCritere,
          ...data.cvThequeCritere,
        };

        state.history = [
          newCvThequeCritere,
          ...state.history.filter(
            (item) => item.id !== data.cvThequeCritere.id,
          ),
        ];
      }

      state.cvThequeCritere = {
        ...state.cvThequeCritere,
        ...data.cvThequeCritere,
      };
    },
    addCvThequeContactReducer: (state, action) => {
      const { cvThequeContact }: { cvThequeContact: CvThequeContactInterface } =
        action.payload;

      if (state.cvAnonym) {
        state.cvAnonym = {
          ...state.cvAnonym,
          cvThequeContacts: [
            ...(state.cvAnonym.cvThequeContacts || []),
            cvThequeContact,
          ],
        };
      }
    },
    resetCvAnonymReducer: (state) => {
      state.cvAnonym = null;
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
  saveCvThequeCritereReducer,
  addCvThequeContactReducer,
  resetCvAnonymReducer,
  resetCvThequeReducer,
} = cvThequeSlice.actions;

export default cvThequeSlice.reducer;
