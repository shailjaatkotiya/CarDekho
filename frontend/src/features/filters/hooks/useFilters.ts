import { useUrlFilters } from "../../../hooks/useUrlFilters";

export const useFilters = () => {
  const { filters, setFilter } = useUrlFilters();
  return { filters, setFilter };
};
