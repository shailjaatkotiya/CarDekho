import { useQuery } from "@tanstack/react-query";

import { compareCars } from "../../../data/catalog";
import { useComparisonStore } from "../store";

export const useComparison = () => {
  const ids = useComparisonStore((state) => state.selectedIds);
  return useQuery({
    queryKey: ["comparison", ids],
    enabled: ids.length >= 2,
    queryFn: async () => compareCars(ids)
  });
};
