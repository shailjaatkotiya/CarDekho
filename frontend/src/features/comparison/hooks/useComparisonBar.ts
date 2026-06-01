import { useComparisonStore } from "../store";

export const useComparisonBar = () => {
  const selectedIds = useComparisonStore((state) => state.selectedIds);
  const toggle = useComparisonStore((state) => state.toggle);
  const remove = useComparisonStore((state) => state.remove);
  const clear = useComparisonStore((state) => state.clear);

  return {
    selectedIds,
    showBar: selectedIds.length >= 2,
    toggle,
    remove,
    clear
  };
};
