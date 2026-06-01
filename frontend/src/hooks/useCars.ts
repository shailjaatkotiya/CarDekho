import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { apolloClient } from "../lib/apollo";
import { CARS_QUERY, UPCOMING_QUERY } from "../graphql/queries/cars";
import type { Car } from "../types/car";

type CarsResponse = {
  cars: { nodes: Car[]; pageInfo: { total: number; limit: number; offset: number } };
};

type UpcomingResponse = {
  upcomingCars: { nodes: Car[]; pageInfo: { total: number; limit: number; offset: number } };
};

export const useCars = (variables: Record<string, unknown>) =>
  useQuery({
    queryKey: ["cars", variables],
    queryFn: async () => {
      const { data } = await apolloClient.query<CarsResponse>({
        query: CARS_QUERY,
        variables,
        fetchPolicy: "no-cache"
      });
      return data.cars;
    },
    // Keep the previous page visible while the next one loads (no blank flash).
    placeholderData: keepPreviousData
  });

export const useUpcomingCars = () =>
  useQuery({
    queryKey: ["upcomingCars"],
    queryFn: async () => {
      const { data } = await apolloClient.query<UpcomingResponse>({
        query: UPCOMING_QUERY,
        variables: { page: { limit: 8, offset: 0 } },
        fetchPolicy: "no-cache"
      });
      return data.upcomingCars.nodes;
    }
  });
