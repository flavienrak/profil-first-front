import { createSlice } from '@reduxjs/toolkit';
import { UserInterface } from '@/interfaces/user.interface';

const initialState: { user: UserInterface | null; cvMinuteCount: number } = {
  user: null,
  cvMinuteCount: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserReducer: (state, action) => {
      const {
        user,
        cvMinuteCount,
      }: { user: UserInterface; cvMinuteCount?: number } = action.payload;
      state.user = user;

      if (cvMinuteCount) {
        state.cvMinuteCount = cvMinuteCount;
      }
    },
    updateUserReducer: (state, action) => {
      const {
        user,
        cvMinuteCount,
      }: { user?: UserInterface; cvMinuteCount?: number } = action.payload;

      if (user) {
        state.user = { ...state.user, ...user };
      }

      if (cvMinuteCount) {
        state.cvMinuteCount = cvMinuteCount;
      }
    },
  },
});

export const { setUserReducer, updateUserReducer } = userSlice.actions;

export default userSlice.reducer;
