import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  count: 0,
  cvMinute: {},
};

const cvMinuteSlice = createSlice({
  name: 'cvMinute',
  initialState,
  reducers: {
    setCvMinuteReducer: (state, action) => {
      const { cvMinute, count } = action.payload;
      if (count) {
        state.count = count;
      }

      if (cvMinute) {
        state.cvMinute = cvMinute;
      }
    },
  },
});

export const { setCvMinuteReducer } = cvMinuteSlice.actions;

export default cvMinuteSlice.reducer;
