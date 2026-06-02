import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { queryClient } from "../lib/queryClient";
import { ErrorBoundary } from "../components/ErrorBoundary";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ErrorBoundary>
);
