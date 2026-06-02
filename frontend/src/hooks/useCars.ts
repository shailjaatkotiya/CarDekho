import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getUpcomingCars, listCars } from "../data/catalog";
import type { CarFilters, Pagination } from "../types/filter";

type UseCarsVariables = {
  filter?: CarFilters;
  page?: Pagination;
};

export const useCars = (variables: UseCarsVariables = {}) =>
  useQuery({
    queryKey: ["cars", variables],
    queryFn: async () => listCars(variables),
    // Keep the previous page visible while the next one loads (no blank flash).
    placeholderData: keepPreviousData
  });

export const useUpcomingCars = () =>
  useQuery({
    queryKey: ["upcomingCars"],
    queryFn: async () => getUpcomingCars()
  });
