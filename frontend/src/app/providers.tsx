import { ApolloProvider } from "@apollo/client";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { apolloClient } from "../lib/apollo";
import { queryClient } from "../lib/queryClient";
import { ErrorBoundary } from "../components/ErrorBoundary";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <ErrorBoundary>
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApolloProvider>
  </ErrorBoundary>
);
