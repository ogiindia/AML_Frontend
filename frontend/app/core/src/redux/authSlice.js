import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authToken: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    addAuth: (state, action) => {
      state.authToken = action.payload;
    },
    reset: () => initialState,
  },
});

export const { addAuth, reset } = authSlice.actions;

export default authSlice.reducer;
