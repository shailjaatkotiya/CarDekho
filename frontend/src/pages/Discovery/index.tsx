import { useMemo } from "react";

import { CarCard } from "../../components/CarCard";
import { useDiscovery } from "../../features/discovery/hooks/useDiscovery";
import { useRecommendations } from "../../features/discovery/hooks/useRecommendations";
import { WizardStep } from "../../features/discovery/components/WizardStep";
import { useComparisonBar } from "../../features/comparison/hooks/useComparisonBar";

const stepTitles = [
  "Budget",
  "Usage Profile",
  "Family & Seating",
  "Fuel & Transmission",
  "Priorities",
  "Results"
];

const DiscoveryPage = () => {
  const { profile, step, setStep, update, recommendationInput } = useDiscovery();
  const recommendationsQuery = useRecommendations(recommendationInput);
  const comparison = useComparisonBar();

  const currentStepTitle = stepTitles[Math.max(0, step - 1)];
  const recommendations = recommendationsQuery.data ?? [];

  const progress = useMemo(() => (step / 6) * 100, [step]);

  return (
    <div className="app-container py-6">
      <div className="mb-6 card-surface p-5">
        <p className="text-sm text-textSecondary">Discovery wizard</p>
        <h1 className="font-heading text-3xl font-bold">Smart Advisor Flow</h1>
        <p className="text-textSecondary">Current step: {currentStepTitle}</p>
        <div className="mt-3 h-2 rounded-full bg-appBg">
          <div className="h-full rounded-full bg-brandRed" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {stepTitles.map((title, index) => (
            <button
              key={title}
              onClick={() => setStep(index + 1)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                step === index + 1 ? "bg-brandRed text-white" : "bg-appBg text-textSecondary"
              }`}
            >
              {index + 1}. {title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WizardStep number={1} title="Budget" active={step === 1}>
          <input
            type="range"
            min={3}
            max={50}
            value={profile.budget}
            onChange={(event) => update({ budget: Number(event.target.value) })}
            className="w-full"
          />
          <p className="font-numeric text-brandRed">Rs {profile.budget.toFixed(1)}L</p>
        </WizardStep>

        <WizardStep number={2} title="Usage Profile" active={step === 2}>
          <div className="grid grid-cols-3 gap-2">
            {["city", "highway", "mixed"].map((usage) => (
              <button
                key={usage}
                onClick={() => update({ usage })}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  profile.usage === usage ? "border-brandRed bg-brandRed text-white" : "border-appBorder"
                }`}
              >
                {usage}
              </button>
            ))}
          </div>
        </WizardStep>

        <WizardStep number={3} title="Family & Seating" active={step === 3}>
          <input
            type="number"
            min={2}
            max={8}
            value={profile.familySize}
            onChange={(event) => update({ familySize: Number(event.target.value) })}
            className="w-full rounded-lg border border-appBorder px-3 py-2"
          />
        </WizardStep>

        <WizardStep number={4} title="Fuel & Transmission" active={step === 4}>
          <div className="grid grid-cols-2 gap-2">
            {["petrol", "diesel", "cng", "electric", "hybrid"].map((fuel) => {
              const selected = profile.fuelPreferences.includes(fuel);
              return (
                <button
                  key={fuel}
                  onClick={() =>
                    update({
                      fuelPreferences: selected
                        ? profile.fuelPreferences.filter((item) => item !== fuel)
                        : [...profile.fuelPreferences, fuel]
                    })
                  }
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    selected ? "border-brandRed bg-brandRed text-white" : "border-appBorder"
                  }`}
                >
                  {fuel}
                </button>
              );
            })}
          </div>
          <select
            value={profile.transmissionPreference}
            onChange={(event) => update({ transmissionPreference: event.target.value })}
            className="mt-3 w-full rounded-lg border border-appBorder px-3 py-2"
          >
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
            <option value="no_preference">No preference</option>
          </select>
        </WizardStep>

        <WizardStep number={5} title="Priorities" active={step === 5}>
          <div className="space-y-2">
            {[
              ["safetyImportance", "Safety"],
              ["mileageImportance", "Mileage"],
              ["featureImportance", "Features"],
              ["resaleImportance", "Resale"]
            ].map(([key, label]) => (
              <label key={key} className="block text-sm text-textSecondary">
                {label}
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={profile[key as keyof typeof profile] as number}
                  onChange={(event) =>
                    update({ [key]: Number(event.target.value) } as Partial<typeof profile>)
                  }
                  className="w-full"
                />
              </label>
            ))}
          </div>
        </WizardStep>

        <WizardStep number={6} title="Results" active={step === 6}>
          <p className="text-sm text-textSecondary">
            Recommendations update live. Move to step 6 when you are ready to shortlist.
          </p>
        </WizardStep>
      </div>

      <section className="mt-8">
        <div className="section-heading">
          <h2 className="section-title">Recommended for your profile</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((recommendation) => (
            <div key={recommendation.car.id} className="space-y-2">
              <CarCard
                car={recommendation.car}
                confidenceScore={recommendation.confidenceScore}
                badges={recommendation.bestFor.slice(0, 2)}
                isCompared={comparison.selectedIds.includes(recommendation.car.id)}
                onCompareToggle={comparison.toggle}
                showShortlistButton={false}
              />
              <details className="card-surface p-3 text-sm text-textSecondary">
                <summary className="cursor-pointer font-medium text-textPrimary">Why this car</summary>
                <p className="mt-2">{recommendation.reasoning}</p>
                <ul className="mt-2 list-disc pl-5">
                  {recommendation.tradeoffs.map((tradeoff) => (
                    <li key={tradeoff}>{tradeoff}</li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DiscoveryPage;
