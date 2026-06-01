import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apolloClient } from "../../../lib/apollo";
import { SHORTLIST_QUERY } from "../../../graphql/queries/shortlist";
import {
  REMOVE_SHORTLIST_MUTATION,
  SAVE_SHORTLIST_MUTATION
} from "../../../graphql/mutations/shortlist";
import { useShortlistStore } from "../store";

type ShortlistItem = {
  id: string;
  variantId: string;
  notes?: string | null;
  shareToken?: string | null;
  savedAt?: string | null;
};

type ShortlistResponse = { shortlist: ShortlistItem[] };

export const useShortlist = () => {
  const guestToken = useShortlistStore((state) => state.guestToken);
  const setIds = useShortlistStore((state) => state.setIds);
  const queryClient = useQueryClient();

  const shortlistQuery = useQuery({
    queryKey: ["shortlist", guestToken],
    queryFn: async () => {
      const { data } = await apolloClient.query<ShortlistResponse>({
        query: SHORTLIST_QUERY,
        variables: { token: guestToken },
        fetchPolicy: "no-cache"
      });
      setIds(data.shortlist.map((item) => item.variantId));
      return data.shortlist;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (variantId: string) => {
      await apolloClient.mutate({
        mutation: SAVE_SHORTLIST_MUTATION,
        variables: { carId: variantId, token: guestToken }
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shortlist", guestToken] });
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (variantId: string) => {
      await apolloClient.mutate({
        mutation: REMOVE_SHORTLIST_MUTATION,
        variables: { carId: variantId, token: guestToken }
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shortlist", guestToken] });
    }
  });

  return {
    shortlist: shortlistQuery.data ?? [],
    isLoading: shortlistQuery.isLoading,
    save: saveMutation.mutateAsync,
    remove: removeMutation.mutateAsync
  };
};
