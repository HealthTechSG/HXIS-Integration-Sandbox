import { createSlice } from '@reduxjs/toolkit';

import { GlobalState } from './types';

const initialState: GlobalState = {
  authToken: undefined,
  counter: 0,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    increment: (state) => {
      state.counter += 1;
    },
  },
});

export const { increment } = globalSlice.actions;

export default globalSlice.reducer;
