"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";

import { useAuthStore } from "@/entities/user";

import { configureAuth } from "@/shared/api/client";
import { queryClient } from "@/shared/api/client";

export function Providers({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    configureAuth(() => {
      return user?.contragent_phone || null;
    });
  }, [isAuthenticated, user]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
