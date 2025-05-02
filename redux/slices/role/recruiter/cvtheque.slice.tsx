import { createSlice } from '@reduxjs/toolkit';
import { CvThequeCritereInterface } from '@/interfaces/role/recruiter/cvtheque/cvtheque-critere.interface';

const initialState: { cvThequeCritere: CvThequeCritereInterface | null } = {
  cvThequeCritere: null,
};

const cvThequeSlice = createSlice({
  name: 'cvTheque',
  initialState,
  reducers: {
    setCvThequeCritereReducer: (state, action) => {
      const { cvThequeCritere }: { cvThequeCritere: CvThequeCritereInterface } =
        action.payload;
      state.cvThequeCritere = cvThequeCritere;
    },
  },
});

export const { setCvThequeCritereReducer } = cvThequeSlice.actions;

export default cvThequeSlice.reducer;
