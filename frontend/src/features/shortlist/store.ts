import { create } from "zustand";

type ShortlistState = {
  guestToken: string;
  ids: string[];
  setIds: (ids: string[]) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
};

const token = localStorage.getItem("guestToken") ?? crypto.randomUUID();
localStorage.setItem("guestToken", token);

const readIds = () => {
  try {
    return JSON.parse(localStorage.getItem("shortlistIds") ?? "[]") as string[];
  } catch {
    return [];
  }
};

const persistIds = (ids: string[]) => {
  localStorage.setItem("shortlistIds", JSON.stringify(ids));
};

export const useShortlistStore = create<ShortlistState>((set, get) => ({
  guestToken: token,
  ids: readIds(),
  setIds: (ids) => {
    const next = Array.from(new Set(ids));
    persistIds(next);
    set({ ids: next });
  },
  add: (id) => {
    const next = Array.from(new Set([...get().ids, id]));
    persistIds(next);
    set({ ids: next });
  },
  remove: (id) => {
    const next = get().ids.filter((value) => value !== id);
    persistIds(next);
    set({ ids: next });
  }
}));
