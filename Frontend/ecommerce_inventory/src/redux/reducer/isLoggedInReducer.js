import { createSlice } from "@reduxjs/toolkit";

const isLoggedInReducer = createSlice({
  name: "isLoggedIn",
  initialState: {
    isLoggedIn: false,
    status: "idle",
    error: null,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = isLoggedInReducer.actions;
export default isLoggedInReducer.reducer;
