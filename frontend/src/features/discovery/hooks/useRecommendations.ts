import { useQuery } from "@tanstack/react-query";

import { apolloClient } from "../../../lib/apollo";
import { RECOMMEND_QUERY } from "../../../graphql/queries/discovery";
import type { Recommendation } from "../../../types/car";

type RecommendationResponse = { recommend: Recommendation[] };

export const useRecommendations = (input: Record<string, unknown>) =>
  useQuery({
    queryKey: ["recommendations", input],
    queryFn: async () => {
      const { data } = await apolloClient.query<RecommendationResponse>({
        query: RECOMMEND_QUERY,
        variables: { input },
        fetchPolicy: "no-cache"
      });
      return data.recommend;
    }
  });
