import { configureStore, createSlice } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const countryNameInitialState = {
  name: "",
};

const countryName = createSlice({
  name: "toast",
  initialState: countryNameInitialState,
  reducers: {
    setCountryName(state, action) {
      state.name = action.payload.countryName;
    },
  },
});

const store = configureStore({
  reducer: {
    countryName: countryName.reducer,
  },
});

setupListeners(store.dispatch);

export const countryNameAction = countryName.actions;

export default store;
