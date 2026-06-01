import { CheckSquare, Fuel, Gauge, Heart, HeartOff, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { apolloClient } from "../lib/apollo";
import { CAR_DETAIL_QUERY } from "../graphql/queries/cars";
import type { Car } from "../types/car";
import { formatMileage } from "../utils/formatMileage";
import { formatPrice } from "../utils/formatPrice";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { LazyImage } from "./LazyImage";
import { SpecPill } from "./SpecPill";

export type CarCardProps = {
  car: Car;
  variant?: "grid" | "list" | "horizontal-scroll";
  showCompareCheckbox?: boolean;
  showShortlistButton?: boolean;
  badges?: string[];
  isCompared?: boolean;
  isShortlisted?: boolean;
  confidenceScore?: number;
  onCompareToggle?: (carId: string) => void;
  onShortlistToggle?: (carId: string) => void;
};

const badgeColor = (badge: string): string => {
  const key = badge.toLowerCase();
  if (key.includes("safety")) return "bg-successGreen";
  if (key.includes("mileage")) return "bg-warningAmber";
  if (key.includes("budget")) return "bg-brandRed";
  if (key.includes("family")) return "bg-brandNavy";
  return "bg-brandRed";
};

const CARD_SHADE_PALETTE = [
  { surface: "#FFFFFF", border: "#D4D4D8", overlay: "rgba(24, 24, 27, 0.03)" },
  { surface: "#FAFAFA", border: "#D4D4D8", overlay: "rgba(39, 39, 42, 0.04)" },
  { surface: "#F7F7F8", border: "#CFCFD4", overlay: "rgba(63, 63, 70, 0.05)" },
  { surface: "#F4F4F5", border: "#C9CAD1", overlay: "rgba(82, 82, 91, 0.06)" },
  { surface: "#F1F1F2", border: "#C4C5CC", overlay: "rgba(113, 113, 122, 0.06)" }
] as const;

const getCardShade = (seed: string) => {
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CARD_SHADE_PALETTE[hash % CARD_SHADE_PALETTE.length];
};

export const CarCard = ({
  car,
  variant = "grid",
  showCompareCheckbox = true,
  showShortlistButton = true,
  badges = [],
  isCompared = false,
  isShortlisted = false,
  confidenceScore,
  onCompareToggle,
  onShortlistToggle
}: CarCardProps) => {
  const queryClient = useQueryClient();
  const shade = getCardShade(`${car.id}-${car.make.name}-${car.model.name}`);

  const prefetchDetail = () => {
    queryClient.prefetchQuery({
      queryKey: ["car", car.id],
      queryFn: async () => {
        const { data } = await apolloClient.query<{ car: Car | null }>({
          query: CAR_DETAIL_QUERY,
          variables: { id: car.id }
        });
        return data.car;
      },
      staleTime: 60_000
    });
  };

  return (
    <article
      onMouseEnter={prefetchDetail}
      onFocus={prefetchDetail}
      onTouchStart={prefetchDetail}
      className={`card-surface relative overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        variant === "list" ? "flex flex-col md:flex-row" : "flex flex-col"
      }`}
      style={{ backgroundColor: shade.surface, borderColor: shade.border }}
    >
      <Link
        to={`/cars/${car.id}`}
        aria-label={`View ${car.make.name} ${car.model.name} details`}
        className="absolute inset-0 z-[1]"
      />

      <div className="relative h-44 w-full overflow-hidden bg-slate-100 md:h-auto md:w-72">
        <LazyImage
          src={car.images[0]}
          alt={`${car.make.name} ${car.model.name}`}
          width={400}
          className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: shade.overlay }}
          aria-hidden="true"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-2">
          {(badges.length ? badges : car.isEV ? ["EV"] : car.isNew ? ["New"] : ["Popular"]).map(
            (badge) => (
              <span
                key={`${car.id}-${badge}`}
                className={`rounded-full px-2 py-1 text-[11px] font-semibold text-white ${badgeColor(
                  badge
                )}`}
              >
                {badge}
              </span>
            )
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-bold text-textPrimary">
              {car.make.name} {car.model.name}
            </h3>
            <p className="text-sm text-textSecondary">{car.variant}</p>
          </div>
          {typeof confidenceScore === "number" ? <ConfidenceBadge score={confidenceScore} /> : null}
        </div>

        <div className="mb-3 font-numeric text-xl font-bold text-brandRed">
          {formatPrice(car.priceRange.min)}
        </div>

        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <SpecPill icon={<Fuel size={14} />} value={car.fuelType} />
          <SpecPill icon={<Settings2 size={14} />} value={car.transmission} />
          <SpecPill icon={<Gauge size={14} />} value={formatMileage(car.topMileage, undefined)} />
        </div>

        <div className="relative z-[2] mt-auto flex flex-wrap items-center gap-3">
          {showShortlistButton ? (
            <button
              onClick={() => onShortlistToggle?.(car.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-appBorder bg-white px-3 py-2 text-sm font-medium text-textPrimary transition hover:border-slate-300 hover:bg-slate-50"
            >
              {isShortlisted ? <HeartOff size={16} /> : <Heart size={16} />}
              {isShortlisted ? "Remove" : "Shortlist"}
            </button>
          ) : null}

          {showCompareCheckbox ? (
            <button
              onClick={() => onCompareToggle?.(car.id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                isCompared
                  ? "border-brandRed bg-brandRed text-white"
                  : "border-appBorder bg-white text-textPrimary hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <CheckSquare size={16} />
              {isCompared ? "Compared" : "Compare"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
};
