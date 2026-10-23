"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 60s — data is fresh for 60s
            gcTime: 5 * 60 * 1000, // 5min — cache kept for 5min after unmount
            refetchOnWindowFocus: true, // refetch when user returns to tab
            retry: 1, // retry once on failure
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
