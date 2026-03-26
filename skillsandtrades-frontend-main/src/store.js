import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./utils/slices/profileSlice"
import authReducer from "./utils/slices/authSlice";
export const store = configureStore({
  reducer: {
    profile: profileReducer,
    auth: authReducer,
  },
});
