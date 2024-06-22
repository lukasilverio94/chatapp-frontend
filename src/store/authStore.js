import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  loading: false,
  user: null,
  token: null, // Add token to the initial state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user; // Assuming action.payload.user contains user details
      state.token = action.payload.token; // Store the token
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null; // Clear the token on logout
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, setLoading } = authSlice.actions;

// Selector to get the token
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
