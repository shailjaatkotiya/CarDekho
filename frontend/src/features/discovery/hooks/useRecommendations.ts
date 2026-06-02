import { useQuery } from "@tanstack/react-query";

import { recommendCars } from "../../../data/catalog";
import type { Recommendation } from "../../../types/car";

export const useRecommendations = (input: Record<string, unknown>) =>
  useQuery({
    queryKey: ["recommendations", input],
    queryFn: async (): Promise<Recommendation[]> => recommendCars(input)
  });
