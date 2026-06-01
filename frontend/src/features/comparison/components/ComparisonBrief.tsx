import { Link, useNavigate } from "react-router-dom";

import type { Car } from "../../../types/car";
import { formatPrice } from "../../../utils/formatPrice";
import { useComparisonStore } from "../store";

type ComparisonBriefProps = {
  base: Car;
  rivals: Car[];
};

/** One-line, human-readable summary of how a rival stacks up against the base car. */
const buildBrief = (base: Car, rival: Car): string => {
  const parts: string[] = [];

  const priceDelta = rival.priceRange.min - base.priceRange.min;
  if (Math.abs(priceDelta) >= 0.05) {
    parts.push(
      `${formatPrice(Math.abs(priceDelta))} ${priceDelta > 0 ? "costlier" : "cheaper"}`
    );
  } else {
    parts.push("similar price");
  }

  const baseMileage = base.topMileage ?? 0;
  const rivalMileage = rival.topMileage ?? 0;
  if (baseMileage && rivalMileage) {
    const mileageDelta = rivalMileage - baseMileage;
    if (Math.abs(mileageDelta) >= 0.5) {
      parts.push(
        `${Math.abs(mileageDelta).toFixed(1)} kmpl ${mileageDelta > 0 ? "more" : "less"} efficient`
      );
    }
  }

  const baseSafety = base.topSafetyRating ?? 0;
  const rivalSafety = rival.topSafetyRating ?? 0;
  if (baseSafety && rivalSafety && Math.abs(rivalSafety - baseSafety) >= 0.5) {
    parts.push(`${rivalSafety > baseSafety ? "safer" : "lower safety"}`);
  }

  const featureDelta = rival.features.length - base.features.length;
  if (Math.abs(featureDelta) >= 2) {
    parts.push(`${Math.abs(featureDelta)} ${featureDelta > 0 ? "more" : "fewer"} features`);
  }

  return parts.join(" · ");
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[11px] uppercase tracking-wide text-textSecondary">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export const ComparisonBrief = ({ base, rivals }: ComparisonBriefProps) => {
  const navigate = useNavigate();
  const setSelection = useComparisonStore((state) => state.setSelection);

  const compareSideBySide = () => {
    setSelection([base.id, ...rivals.map((rival) => rival.id)]);
    navigate("/compare");
  };

  if (!rivals.length) {
    return (
      <p className="text-sm text-textSecondary">
        No closely related models found to compare right now.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-textSecondary">
        How the <span className="font-medium text-textPrimary">{base.make.name} {base.model.name}</span>{" "}
        compares with related models:
      </p>

      {rivals.map((rival) => (
        <div key={rival.id} className="rounded-lg border border-appBorder p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold">
                {rival.make.name} {rival.model.name}
              </p>
              <p className="text-xs text-textSecondary">{rival.variant}</p>
            </div>
            <Link
              to={`/cars/${rival.id}`}
              className="shrink-0 rounded-lg border border-appBorder px-3 py-1 text-xs"
            >
              View
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <Metric label="Price" value={formatPrice(rival.priceRange.min)} />
            <Metric
              label="Mileage"
              value={rival.topMileage ? `${rival.topMileage.toFixed(1)} kmpl` : "NA"}
            />
            <Metric label="Safety" value={rival.topSafetyRating ? `${rival.topSafetyRating}★` : "NA"} />
            <Metric label="Fuel" value={rival.fuelType} />
          </div>

          <p className="mt-3 rounded-md bg-appBg px-3 py-2 text-xs text-textSecondary">
            vs {base.model.name}: {buildBrief(base, rival)}
          </p>
        </div>
      ))}

      <button
        type="button"
        onClick={compareSideBySide}
        className="inline-block rounded-lg bg-brandRed px-3 py-2 text-sm text-white"
      >
        Compare side by side
      </button>
    </div>
  );
};
