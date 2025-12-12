// store/middleware/utmMiddleware.ts
import { Middleware } from "@reduxjs/toolkit";
import { setUtmParams } from "../utm";
import { saveUtmToStorage } from "@/shared/lib/utmStorage";

export const utmMiddleware: Middleware = (store) => (next) => (action) => {
  if (setUtmParams.match(action)) {
    saveUtmToStorage(action.payload);
  }
  
  return next(action);
};