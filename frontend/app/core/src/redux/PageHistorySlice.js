import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const PageHistorySlice = createSlice({
  name: 'pageHistory',
  initialState: initialState,
  reducers: {
    addPage: (state, action) => {
      if (state.indexOf(action.payload) === -1) state.push(action.payload);
    },
    reset: () => initialState,
    removeLastPage: (state) => {
      return state.filter((_, i) => i !== state.length - 1);
    },
    removePage(state, action) {
      return state.filter((ele) => {
        return ele !== action.payload;
      });
    },
  },
});

export const { addPage, reset, removePage, removeLastPage } =
  PageHistorySlice.actions;

export default PageHistorySlice.reducer;
