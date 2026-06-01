import type { CarFilters } from "../../../types/filter";

type FilterChipsProps = {
  filters: CarFilters;
  onClear: (key: keyof CarFilters) => void;
};

const LABELS: Partial<Record<keyof CarFilters, string>> = {
  q: "Search",
  minPrice: "Min price",
  maxPrice: "Max price",
  bodyTypes: "Body type",
  fuelType: "Fuel",
  transmission: "Transmission",
  seatingCapacity: "Seats"
};

export const FilterChips = ({ filters, onClear }: FilterChipsProps) => {
  const entries = Object.entries(filters).filter(
    ([, value]) =>
      value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0)
  );

  if (!entries.length) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <button
          key={key}
          onClick={() => onClear(key as keyof CarFilters)}
          className="rounded-full border border-appBorder bg-white px-3 py-1 text-xs font-medium capitalize transition hover:border-slate-300 hover:bg-slate-50"
        >
          {LABELS[key as keyof CarFilters] ?? key}: {Array.isArray(value) ? value.join(", ") : value} x
        </button>
      ))}
    </div>
  );
};
