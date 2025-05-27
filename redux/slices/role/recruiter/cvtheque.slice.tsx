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
      const { history }: { history: CvThequeCritereInterface[] } =
        action.payload;
      state.history = history;
    },
    setCvThequeCritereReducer: (state, action) => {
      const { cvThequeCritere }: { cvThequeCritere: CvThequeCritereInterface } =
        action.payload;

      state.cvThequeCritere = cvThequeCritere;
      state.cvAnonym = null;
    },
    setCvAnonymReducer: (state, action) => {
      const { cvAnonym }: { cvAnonym: CvMinuteInterface } = action.payload;

      state.cvAnonym = cvAnonym;

      if (state.cvThequeCritere) {
        state.cvThequeCritere = {
          ...state.cvThequeCritere,
          cvMinutes: state.cvThequeCritere.cvMinutes?.map((c) =>
            c.id === cvAnonym.id ? cvAnonym : c,
          ),
        };
      }
    },
    saveCvThequeCritereReducer: (state, action) => {
      const { cvThequeCritere }: { cvThequeCritere: CvThequeCritereInterface } =
        action.payload;

      const existCvThequeCritere = state.history.find(
        (c) => c.id === cvThequeCritere.id,
      );

      if (existCvThequeCritere) {
        const newCvThequeCritere = {
          ...existCvThequeCritere,
          ...cvThequeCritere,
        };

        state.history = [
          newCvThequeCritere,
          ...state.history.filter((item) => item.id !== cvThequeCritere.id),
        ];
      }

      state.cvThequeCritere = { ...state.cvThequeCritere, ...cvThequeCritere };
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
