import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode library

const initialState = {
  isLoggedIn: false,
  loading: false,
  user: null,
  token: null, // Corrected from access_token to token to match the state structure in the login reducer
  currentUserId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token; // Corrected from access_token to token to match the payload structure
      state.currentUserId = action.payload.user.id;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null; // Clear the token on logout
      state.currentUserId = null;
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

export const selectUserId = (state) => {
  if (state.auth.token) {
    const decoded = jwtDecode(state.auth.token);
    return decoded.user_id; // Assuming the payload has a user_id field
  }
  return null;
};

export const selectCurrentUserId = (state) => state.auth.currentUserId;

export default authSlice.reducer;
