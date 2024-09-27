"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { CurrentDraftProvider } from "@/context/current-draft-context";
import { queryClient } from "../lib/react-query/client";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <CurrentDraftProvider>{children}</CurrentDraftProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};
