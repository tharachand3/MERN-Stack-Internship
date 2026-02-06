import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    authModelOpen: false,
    authMode: "login", // login | signup | forgotPassword
  },
  reducers: {
    openAuthModel: (state, action) => {
      state.authModelOpen = true;
      state.authMode = action.payload || "login";
    },

    closeAuthModel: (state) => {
      state.authModelOpen = false;
      state.authMode = "login";
    },

    switchAuthModel: (state, action) => {
      state.authMode = action.payload;
    },
  },
});

export const { openAuthModel, closeAuthModel, switchAuthModel } =
  uiSlice.actions;

export default uiSlice.reducer;
