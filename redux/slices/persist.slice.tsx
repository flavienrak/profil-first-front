import { createSlice } from '@reduxjs/toolkit';

type Mode = 'light' | 'dark';

const initialState: {
  mode: Mode;
  showMenu: boolean;
  showFooter: boolean;
  showCritere: boolean;
  showFilter: boolean;
  fontSize: number;
} = {
  mode: 'light',
  showMenu: false,
  showFooter: true,
  showCritere: true,
  showFilter: true,
  fontSize: 16,
};

const persistSlice = createSlice({
  name: 'persist',
  initialState,
  reducers: {
    updatePersistReducer: (state, action) => {
      const data: {
        mode?: Mode;
        showMenu?: boolean;
        showFooter?: boolean;
        showCritere?: boolean;
        showFilter?: boolean;
        fontSize?: number;
      } = action.payload;

      if (data.mode) {
        state.mode = data.mode;
      }
      if (typeof data.showMenu === 'boolean') {
        state.showMenu = data.showMenu;
      }
      if (typeof data.showFooter === 'boolean') {
        state.showFooter = data.showFooter;
      }
      if (typeof data.showCritere === 'boolean') {
        state.showCritere = data.showCritere;
      }
      if (typeof data.showFilter === 'boolean') {
        state.showFilter = data.showFilter;
      }
      if (data.fontSize) {
        state.fontSize = data.fontSize;
      }
    },
  },
});

export const { updatePersistReducer } = persistSlice.actions;
export default persistSlice.reducer;
