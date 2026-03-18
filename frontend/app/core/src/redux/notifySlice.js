import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = [];

const notifySlice = createSlice({
  name: 'notity',
  initialState: initialState,
  reducers: {
    addNotification: (state, action) => {
      state.push({
        id: nanoid(),
        type: action.payload.type,
        title: action.payload.title,
        desc: action.payload.desc,
      });
    },
    reset: () => initialState,
    removeNotification(state, action) {
      return state.filter((ele) => {
        return ele.id !== action.payload;
      });
    },
  },
});

export const { addNotification, reset, removeNotification } =
  notifySlice.actions;

export default notifySlice.reducer;
