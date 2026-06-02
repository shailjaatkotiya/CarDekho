import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const ids = useShortlistStore((state) => state.ids);
  const add = useShortlistStore((state) => state.add);
  const removeId = useShortlistStore((state) => state.remove);
  const queryClient = useQueryClient();

  const shortlistQuery = useQuery({
    queryKey: ["shortlist", guestToken, ids],
    queryFn: async (): Promise<ShortlistItem[]> =>
      ids.map((id) => ({
        id,
        variantId: id,
        notes: "",
        shareToken: guestToken,
        savedAt: new Date().toISOString()
      }))
  });

  const saveMutation = useMutation({
    mutationFn: async (variantId: string) => {
      add(variantId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shortlist", guestToken] });
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (variantId: string) => {
      removeId(variantId);
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
