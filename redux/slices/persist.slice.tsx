import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  mode: 'light' | 'dark';
  showMenu: boolean;
  showFooter: boolean;
  fontSize: number;
} = {
  mode: 'light',
  showMenu: false,
  showFooter: true,
  fontSize: 16,
};

const persistSlice = createSlice({
  name: 'persist',
  initialState,
  reducers: {
    updatePersistReducer: (state, action) => {
      const { mode, showMenu, showFooter, fontSize } = action.payload;
      if (mode) {
        state.mode = mode;
      }
      if (showMenu !== undefined) {
        state.showMenu = showMenu;
      }
      if (showFooter !== undefined) {
        state.showFooter = showFooter;
      }
      if (fontSize) {
        state.fontSize = fontSize;
      }
    },
  },
});

export const { updatePersistReducer } = persistSlice.actions;
export default persistSlice.reducer;
