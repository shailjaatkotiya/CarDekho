import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import type { CarFilters, FilterValue } from "../types/filter";

export const useUrlFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const bodyTypesFromUrl =
    searchParams.get("bodyTypes") ?? searchParams.get("bodyType") ?? undefined;

  const filters = useMemo<CarFilters>(
    () => ({
      q: searchParams.get("q") || undefined,
      bodyTypes: bodyTypesFromUrl?.split(",").filter(Boolean) || undefined,
      fuelType: searchParams.get("fuelType") || undefined,
      transmission: searchParams.get("transmission") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined
    }),
    [searchParams, bodyTypesFromUrl]
  );

  const setFilter = (name: keyof CarFilters, value: FilterValue) => {
    const next = new URLSearchParams(searchParams);
    const isEmpty =
      value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
    if (name === "bodyTypes") {
      next.delete("bodyType");
    }
    if (isEmpty) next.delete(name);
    else next.set(name, Array.isArray(value) ? value.join(",") : String(value));
    setSearchParams(next, { replace: true });
  };

  return { filters, setFilter };
};
