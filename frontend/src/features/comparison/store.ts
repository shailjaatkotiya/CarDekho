import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ComparisonState = {
  selectedIds: string[];
  setSelection: (ids: string[]) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const normalizeSelection = (ids: string[]) => Array.from(new Set(ids.filter(Boolean))).slice(0, 4);

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      selectedIds: [],
      setSelection: (ids) => set({ selectedIds: normalizeSelection(ids) }),
      toggle: (id) => {
        const selected = get().selectedIds;
        const exists = selected.includes(id);
        if (exists) {
          set({ selectedIds: selected.filter((value) => value !== id) });
          return;
        }
        set({ selectedIds: normalizeSelection([...selected, id]) });
      },
      remove: (id) => set({ selectedIds: get().selectedIds.filter((value) => value !== id) }),
      clear: () => set({ selectedIds: [] })
    }),
    {
      name: "cardekho-comparison",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedIds: state.selectedIds })
    }
  )
);
