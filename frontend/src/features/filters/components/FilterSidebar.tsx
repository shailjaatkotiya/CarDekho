import type { CarFilters, FilterValue } from "../../../types/filter";

type FilterSidebarProps = {
  filters: CarFilters;
  onChange: (key: keyof CarFilters, value: FilterValue) => void;
};

const BODY_TYPE_OPTIONS = [
  { value: "suv", label: "SUV" },
  { value: "sedan", label: "Sedan" },
  { value: "hatchback", label: "Hatchback" },
  { value: "muv", label: "MUV" }
];

export const FilterSidebar = ({ filters, onChange }: FilterSidebarProps) => {
  const selectedBodyTypes = filters.bodyTypes ?? [];
  const toggleBodyType = (value: string) => {
    const next = selectedBodyTypes.includes(value)
      ? selectedBodyTypes.filter((item) => item !== value)
      : [...selectedBodyTypes, value];
    onChange("bodyTypes", next);
  };

  return (
    <aside className="card-surface h-fit p-4">
      <h3 className="font-heading text-lg">Filters</h3>
      <div className="mt-3 space-y-3 text-sm">
        <label className="block">
          <span className="font-medium text-textSecondary">Search</span>
          <input
            value={filters.q ?? ""}
            onChange={(event) => onChange("q", event.target.value)}
            className="mt-1 w-full rounded-lg border border-appBorder px-3 py-2 outline-none transition focus:border-slate-400"
          />
        </label>
        <fieldset className="block">
          <legend className="mb-1 flex items-center justify-between font-medium text-textSecondary">
            <span>Body type</span>
            {selectedBodyTypes.length > 0 ? (
              <button
                type="button"
                onClick={() => onChange("bodyTypes", undefined)}
                className="text-xs text-brandRed hover:underline"
              >
                Clear
              </button>
            ) : null}
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {BODY_TYPE_OPTIONS.map((option) => {
              const checked = selectedBodyTypes.includes(option.value);
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition ${
                    checked ? "border-brandRed bg-brandRed/5" : "border-appBorder hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBodyType(option.value)}
                    className="accent-brandRed"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>
        <label className="block">
          <span className="font-medium text-textSecondary">Fuel</span>
          <select
            value={filters.fuelType ?? ""}
            onChange={(event) => onChange("fuelType", event.target.value || undefined)}
            className="mt-1 w-full rounded-lg border border-appBorder px-3 py-2 outline-none transition focus:border-slate-400"
          >
            <option value="">All</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="cng">CNG</option>
            <option value="electric">Electric</option>
          </select>
        </label>
        <label className="block">
          <span className="font-medium text-textSecondary">Transmission</span>
          <select
            value={filters.transmission ?? ""}
            onChange={(event) => onChange("transmission", event.target.value || undefined)}
            className="mt-1 w-full rounded-lg border border-appBorder px-3 py-2 outline-none transition focus:border-slate-400"
          >
            <option value="">All</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
            <option value="amt">AMT</option>
            <option value="cvt">CVT</option>
            <option value="dct">DCT</option>
          </select>
        </label>
        <label className="block">
          <span className="font-medium text-textSecondary">Max price (Lakh)</span>
          <input
            type="number"
            value={filters.maxPrice ?? ""}
            onChange={(event) =>
              onChange("maxPrice", event.target.value ? Number(event.target.value) : undefined)
            }
            className="mt-1 w-full rounded-lg border border-appBorder px-3 py-2 outline-none transition focus:border-slate-400"
          />
        </label>
      </div>
    </aside>
  );
};
