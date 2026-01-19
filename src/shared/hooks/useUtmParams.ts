// shared/hooks/useUtmParams.ts
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUtmParams } from "@/store/utm";
import { RootState } from "@/store/store";
import { UtmParams } from "@/shared/types/utm";
import { loadUtmFromStorage, hasAnyUtmParams } from "@/shared/lib/utmStorage";

export const useUtmParams = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const utmState = useSelector((state: RootState) => state.utm);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlUtmParams: UtmParams = {
      utm_source: searchParams?.get("utm_source") || undefined,
      utm_medium: searchParams?.get("utm_medium") || undefined,
      utm_campaign: searchParams?.get("utm_campaign") || undefined,
      utm_term: searchParams?.get("utm_term") || undefined,
      utm_content: searchParams?.get("utm_content") || undefined,
      utm_name: searchParams?.get("utm_name") || undefined,
      utm_phone: searchParams?.get("utm_phone") || undefined,
      utm_email: searchParams?.get("utm_email") || undefined,
      utm_leadid: searchParams?.get("utm_leadid") || undefined,
      utm_yclientid: searchParams?.get("utm_yclientid") || undefined,
      utm_gaclientid: searchParams?.get("utm_gaclientid") || undefined,
      ref_user: searchParams?.get("ref_user") || undefined,
    };
    
    if (hasAnyUtmParams(urlUtmParams)) {
      dispatch(setUtmParams(urlUtmParams));
    } else {
      const storedUtm = loadUtmFromStorage();
      if (storedUtm && hasAnyUtmParams(storedUtm)) {
        dispatch(setUtmParams(storedUtm));
      }
    }
  }, [searchParams, dispatch]);

  return {
    utmParams: utmState,
    hasUtmParams: hasAnyUtmParams(utmState),
  };
};