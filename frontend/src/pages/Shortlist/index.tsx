import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useCars } from "../../hooks/useCars";
import { useShortlist } from "../../features/shortlist/hooks/useShortlist";
import { useComparisonStore } from "../../features/comparison/store";
import { getPriceTracking } from "../../features/shortlist/hooks/getPriceTracking";
import { generateShareLink } from "../../utils/generateShareLink";
import { CarCard } from "../../components/CarCard";

const ShortlistPage = () => {
  const { shortlist, isLoading, remove } = useShortlist();
  const { data } = useCars({ page: { limit: 120, offset: 0 } });
  const allCars = data?.nodes ?? [];
  const toggleCompare = useComparisonStore((state) => state.toggle);
  const selectedIds = useComparisonStore((state) => state.selectedIds);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const shortlistCars = useMemo(
    () => allCars.filter((car) => shortlist.some((item) => item.variantId === car.id)),
    [allCars, shortlist]
  );

  return (
    <div className="app-container py-6">
      <div className="section-heading">
        <div>
          <h1 className="section-title">Shortlist / My Garage</h1>
          <p className="section-subtitle">Saved cars, notes, and quick compare</p>
        </div>
        <Link to="/compare" className="rounded-lg bg-brandRed px-4 py-2 text-white">
          Compare selected
        </Link>
      </div>

      {isLoading ? <p>Loading shortlist...</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {shortlistCars.map((car) => {
          const shortlistItem = shortlist.find((item) => item.variantId === car.id);
          const priceTracking = getPriceTracking(car.priceRange.min);
          return (
            <div key={car.id} className="space-y-3">
              <CarCard
                car={car}
                isCompared={selectedIds.includes(car.id)}
                isShortlisted
                onCompareToggle={toggleCompare}
                onShortlistToggle={(id) => remove(id)}
                showShortlistButton
              />
              <div className="card-surface p-3 text-sm">
                <label className="block">
                  Notes
                  <textarea
                    value={notes[car.id] ?? shortlistItem?.notes ?? ""}
                    onChange={(event) => setNotes((prev) => ({ ...prev, [car.id]: event.target.value }))}
                    className="mt-1 min-h-20 w-full rounded-lg border border-appBorder px-3 py-2"
                    placeholder="Check this one's service cost"
                  />
                </label>
                <p className="mt-2 text-textSecondary">
                  {priceTracking.direction === "down" ? "↓" : "↑"} Price {priceTracking.direction}{" "}
                  Rs {Math.abs(priceTracking.changeAmount).toLocaleString()} since saved
                </p>
                {shortlistItem?.shareToken ? (
                  <p className="mt-1 text-xs text-brandNavy">
                    Share link: {generateShareLink(shortlistItem.shareToken)}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShortlistPage;
