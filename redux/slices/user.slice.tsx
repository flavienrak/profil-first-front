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
      const { user, cvMinuteCount } = action.payload;
      state.user = user;
      state.cvMinuteCount = cvMinuteCount;
    },
    updateUserReducer: (state, action) => {
      const { user } = action.payload;
      state.user = { ...state.user, ...user };
    },
  },
});

export const { setUserReducer, updateUserReducer } = userSlice.actions;

export default userSlice.reducer;
