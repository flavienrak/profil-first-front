import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserInfos: (state, action) => {
      const { user } = action.payload;
      state.user = user;
    },
    updateUserInfos: (state, action) => {
      const { user } = action.payload;
      state.user = { ...state.user, ...user };
    },
  },
});

export const { fetchUserInfos, updateUserInfos } = userSlice.actions;

export default userSlice.reducer;
