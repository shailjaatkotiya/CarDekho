import { create } from "zustand";

type ComparisonState = {
  selectedIds: string[];
  setSelection: (ids: string[]) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useComparisonStore = create<ComparisonState>((set, get) => ({
  selectedIds: [],
  setSelection: (ids) => set({ selectedIds: ids.slice(0, 4) }),
  toggle: (id) => {
    const selected = get().selectedIds;
    const exists = selected.includes(id);
    if (exists) {
      set({ selectedIds: selected.filter((value) => value !== id) });
      return;
    }
    const next = [...selected, id].slice(0, 4);
    set({ selectedIds: next });
  },
  remove: (id) => set({ selectedIds: get().selectedIds.filter((value) => value !== id) }),
  clear: () => set({ selectedIds: [] })
}));
