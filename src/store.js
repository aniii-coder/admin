import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./services/api/baseApi";
import toastReducer from "./services/slices/toastSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    toast: toastReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});