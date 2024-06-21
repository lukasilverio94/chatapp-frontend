// src/store/authStore.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  loading: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload; // Assuming action.payload is an object with user details
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;
