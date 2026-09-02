"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { makeQueryClient } from "@/lib/query-client";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeInit } from "@/components/theme-init";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ThemeInit />
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
