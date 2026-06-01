import { create } from "zustand";

type DiscoveryState = {
  step: number;
  setStep: (step: number) => void;
  profile: {
    budget: number;
    usage: string;
    familySize: number;
    fuelPreferences: string[];
    transmissionPreference?: string;
    safetyImportance: number;
    mileageImportance: number;
    featureImportance: number;
    resaleImportance: number;
  };
  update: (partial: Partial<DiscoveryState["profile"]>) => void;
};

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
  profile: {
    budget: 12,
    usage: "mixed",
    familySize: 4,
    fuelPreferences: ["petrol"],
    transmissionPreference: "automatic",
    safetyImportance: 3,
    mileageImportance: 3,
    featureImportance: 3,
    resaleImportance: 3
  },
  update: (partial) => set((state) => ({ profile: { ...state.profile, ...partial } }))
}));
