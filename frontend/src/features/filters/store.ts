import { create } from "zustand";

type FilterUiState = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

export const useFilterUiStore = create<FilterUiState>((set) => ({
  mobileOpen: false,
  setMobileOpen: (open) => set({ mobileOpen: open })
}));
