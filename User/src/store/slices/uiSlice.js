import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showBackToTop: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowBackToTop: (state, action) => {
      state.showBackToTop = action.payload;
    },
  },
});

export const { setShowBackToTop } = uiSlice.actions;
export default uiSlice.reducer; 