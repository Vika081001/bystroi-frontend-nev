// shared/hooks/useContragentPhone.ts
"use client";
// testphone +79995079869
import { useAuthStore } from "@/entities/user";

export const useContragentPhone = () => {
  const { user } = useAuthStore();
  return user?.contragent_phone || "";
};