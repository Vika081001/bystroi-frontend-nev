// shared/hooks/useContragentPhone.ts
"use client";

import { useAuthStore } from "@/entities/user";

export const useContragentPhone = () => {
  const { user } = useAuthStore();
  return user?.contragent_phone || "";
};