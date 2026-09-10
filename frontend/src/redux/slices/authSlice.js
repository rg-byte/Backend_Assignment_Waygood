import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    login: (state, action)=> {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      accessToken = null;
    },
    setAccessToken: (state, action) => {
      accessToken = action.payload;
    },
  },
});

export const { setUserData, login, logout,setAccessToken } = authSlice.actions;
export default authSlice.reducer;
