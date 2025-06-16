import { createSlice } from "@reduxjs/toolkit";

const initialState = (() => {
  const saved = localStorage.getItem("userState");
  if (saved) return JSON.parse(saved);
  return {
    status: false,
    userData: null,
  };
})();

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      const user = action.payload.userData;
      state.userData = {
        ...user,
        id: user._id ? user._id : user.id,
      };
      // Persist to localStorage
      localStorage.setItem("userState", JSON.stringify({
        status: true,
        userData: state.userData,
      }));
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
      localStorage.removeItem("userState");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
