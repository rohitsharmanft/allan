import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logged_in : false,
  email: "",
  fullname: "",
  contact : "",
  image: "",
  membership : "",
  
  
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action) {
      const { fullname, image, email , contact } = action.payload;
      state.fullname = fullname;
      state.image = image;
      state.email = email;
      state.contact = contact;
      state.logged_in = true;


    },
    updateField(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },
    clearProfile(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setProfile, updateField, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
