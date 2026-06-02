import { useMemo } from "react";

import { useDiscoveryStore } from "../store";

export const useDiscovery = () => {
  const { profile, step, setStep, update } = useDiscoveryStore();

  const recommendationInput = useMemo(
    () => ({
      budget: profile.budget,
      usage: profile.usage,
      familySize: profile.familySize,
      fuelPreferences: profile.fuelPreferences,
      transmissionPreference: profile.transmissionPreference,
      safetyImportance: profile.safetyImportance,
      mileageImportance: profile.mileageImportance,
      featureImportance: profile.featureImportance,
      resaleImportance: profile.resaleImportance
    }),
    [profile]
  );

  return { profile, step, setStep, update, recommendationInput };
};
