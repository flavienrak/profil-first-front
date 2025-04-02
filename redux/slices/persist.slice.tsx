import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light',
};

const persistSlice = createSlice({
  name: 'persist',
  initialState,
  reducers: {
    updatePersistReducer: (state, action) => {
      const { mode } = action.payload;
      if (mode) {
        state.mode = mode;
      }
    },
  },
});

export const { updatePersistReducer } = persistSlice.actions;
export default persistSlice.reducer;
