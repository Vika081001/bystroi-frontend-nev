// store/utm/index.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UtmParams } from "@/shared/types/utm";

const initialState: UtmParams = {
  utm_source: undefined,
  utm_medium: undefined,
  utm_campaign: undefined,
  utm_term: undefined,
  utm_content: undefined,
  utm_name: undefined,
  utm_phone: undefined,
  utm_email: undefined,
  utm_leadid: undefined,
  utm_yclientid: undefined,
  utm_gaclientid: undefined,
  ref_user: undefined,
};

const utmSlice = createSlice({
  name: "utm",
  initialState,
  reducers: {
    setUtmParams: (state, action: PayloadAction<UtmParams>) => {
      const payload = action.payload;
      
      if (payload.utm_source !== undefined) state.utm_source = payload.utm_source;
      if (payload.utm_medium !== undefined) state.utm_medium = payload.utm_medium;
      if (payload.utm_campaign !== undefined) state.utm_campaign = payload.utm_campaign;
      if (payload.utm_term !== undefined) state.utm_term = payload.utm_term;
      if (payload.utm_content !== undefined) state.utm_content = payload.utm_content;
      if (payload.utm_name !== undefined) state.utm_name = payload.utm_name;
      if (payload.utm_phone !== undefined) state.utm_phone = payload.utm_phone;
      if (payload.utm_email !== undefined) state.utm_email = payload.utm_email;
      if (payload.utm_leadid !== undefined) state.utm_leadid = payload.utm_leadid;
      if (payload.utm_yclientid !== undefined) state.utm_yclientid = payload.utm_yclientid;
      if (payload.utm_gaclientid !== undefined) state.utm_gaclientid = payload.utm_gaclientid;
      if (payload.ref_user !== undefined) state.ref_user = payload.ref_user;
    },
    
    clearUtmParams: () => {
      return initialState;
    },
  },
});

export const { setUtmParams, clearUtmParams } = utmSlice.actions;
export default utmSlice.reducer;