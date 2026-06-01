import { useEffect } from "react";

import type { CarFilters } from "../../../types/filter";

export const useFilterSync = (
  filters: CarFilters,
  onChange: (filters: CarFilters) => void
) => {
  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);
};
