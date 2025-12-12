import { configureStore } from "@reduxjs/toolkit";
import utmReducer from "./utm";
import { utmMiddleware } from "./middleware/utmMiddleware";

export const store = configureStore({
  reducer: {
    utm: utmReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(utmMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;