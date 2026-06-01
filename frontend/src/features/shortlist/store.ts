import { create } from "zustand";

type ShortlistState = {
  guestToken: string;
  ids: string[];
  setIds: (ids: string[]) => void;
};

const token = localStorage.getItem("guestToken") ?? crypto.randomUUID();
localStorage.setItem("guestToken", token);

export const useShortlistStore = create<ShortlistState>((set) => ({
  guestToken: token,
  ids: [],
  setIds: (ids) => set({ ids })
}));
