import { createSlice } from '@reduxjs/toolkit';
import { UserInterface } from '@/interfaces/user.interface';
import { CvMinuteInterface } from '@/interfaces/role/candidat/cv-minute/cvMinute.interface';

const initialState: {
  users: UserInterface[];
  actualUser: UserInterface | null;
  cvMinutes: CvMinuteInterface[];
  actualCvMinute: CvMinuteInterface | null;
} = {
  users: [],
  actualUser: null,
  cvMinutes: [],
  actualCvMinute: null,
};

const crossSourcingSlice = createSlice({
  name: 'crossSourcing',
  initialState,
  reducers: {
    setUsersReducer: (state, action) => {
      const data: { users: UserInterface[] } = action.payload;

      state.users = data.users;

      state.cvMinutes = [];
      state.actualUser = null;
      state.actualCvMinute = null;
    },
    setUserCvMinutesReducer: (state, action) => {
      const data: { cvMinutes: CvMinuteInterface[] } = action.payload;

      state.cvMinutes = data.cvMinutes;
      state.actualCvMinute = null;
    },
    setUserCvMinuteReducer: (state, action) => {
      const data: { cvMinute: CvMinuteInterface } = action.payload;

      state.actualCvMinute = data.cvMinute;
    },
    resetUserseducer: () => {
      return initialState;
    },
  },
});

export const {
  setUsersReducer,
  setUserCvMinutesReducer,
  setUserCvMinuteReducer,
  resetUserseducer,
} = crossSourcingSlice.actions;

export default crossSourcingSlice.reducer;
