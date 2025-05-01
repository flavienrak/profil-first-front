import { createSlice } from '@reduxjs/toolkit';
import { CvThequeCritereInterface } from '@/interfaces/role/recruiter/cvtheque/critere.interface';

const initialState: { cvCritere: CvThequeCritereInterface | null } = {
  cvCritere: null,
};

const cvThequeSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCvThequeReducer: (state, action) => {
      const { cvCritere }: { cvCritere?: CvThequeCritereInterface } =
        action.payload;

      if (cvCritere) {
        state.cvCritere = cvCritere;
      }
    },
  },
});

export const { setCvThequeReducer } = cvThequeSlice.actions;

export default cvThequeSlice.reducer;
