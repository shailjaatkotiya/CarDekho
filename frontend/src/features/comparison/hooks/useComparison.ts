import { useQuery } from "@tanstack/react-query";

import { apolloClient } from "../../../lib/apollo";
import { COMPARE_QUERY } from "../../../graphql/queries/comparison";
import { useComparisonStore } from "../store";
import type { Comparison } from "../../../types/car";

type ComparisonResponse = { compare: Comparison };

export const useComparison = () => {
  const ids = useComparisonStore((state) => state.selectedIds);
  return useQuery({
    queryKey: ["comparison", ids],
    enabled: ids.length >= 2,
    queryFn: async () => {
      const { data } = await apolloClient.query<ComparisonResponse>({
        query: COMPARE_QUERY,
        variables: { variantIds: ids },
        fetchPolicy: "no-cache"
      });
      return data.compare;
    }
  });
};
