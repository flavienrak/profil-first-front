import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light',
};

const persistSlice = createSlice({
  name: 'persistInfos',
  initialState,
  reducers: {
    updatePersistInfos: (state, action) => {
      const { mode } = action.payload;
      if (mode) {
        state.mode = mode;
      }
    },
  },
});

export const { updatePersistInfos } = persistSlice.actions;
export default persistSlice.reducer;
