import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";

import { CarCard } from "../../components/CarCard";
import { ComparisonBar } from "../../components/ComparisonBar";
import { CardSkeleton } from "../../components/Skeleton";
import { useCars } from "../../hooks/useCars";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { useComparisonBar } from "../../features/comparison/hooks/useComparisonBar";
import { useFilters } from "../../features/filters/hooks/useFilters";
import { useFilterUiStore } from "../../features/filters/store";
import { FilterChips } from "../../features/filters/components/FilterChips";
import { FilterSheet } from "../../features/filters/components/FilterSheet";
import { FilterSidebar } from "../../features/filters/components/FilterSidebar";
import { useShortlist } from "../../features/shortlist/hooks/useShortlist";
import type { Car } from "../../types/car";

const BrowsePage = () => {
  const { filters, setFilter } = useFilters();
  const { page, setPage, pageSize, offset } = usePagination(1, 12);
  const mobileOpen = useFilterUiStore((state) => state.mobileOpen);
  const setMobileOpen = useFilterUiStore((state) => state.setMobileOpen);
  const debouncedQuery = useDebounce(filters.q, 300);

  const variables = useMemo(
    () => ({
      filter: { ...filters, q: debouncedQuery },
      page: { limit: pageSize, offset }
    }),
    [filters, debouncedQuery, pageSize, offset]
  );
  const carsQuery = useCars(variables);
  const { shortlisted, save, remove } = (() => {
    const shortlist = useShortlist();
    return {
      shortlisted: new Set(shortlist.shortlist.map((item) => item.variantId)),
      save: shortlist.save,
      remove: shortlist.remove
    };
  })();
  const comparison = useComparisonBar();

  const cars = carsQuery.data?.nodes ?? [];
  const total = carsQuery.data?.pageInfo.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const comparedCars = useMemo<Car[]>(
    () => cars.filter((car) => comparison.selectedIds.includes(car.id)),
    [cars, comparison.selectedIds]
  );

  return (
    <div className="app-container py-6">
      <div className="section-heading">
        <div>
          <h1 className="section-title">Browse Cars</h1>
          <p className="section-subtitle">{total} results found</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-lg border border-appBorder bg-white px-3 py-2 text-sm transition hover:border-slate-300 hover:bg-slate-50 md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <FilterChips filters={filters} onClear={(key) => setFilter(key, undefined)} />

      <div className="grid gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden md:block">
          <FilterSidebar filters={filters} onChange={setFilter} />
        </div>
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-appBorder/80 bg-white p-3">
            <span className="text-sm font-medium text-textSecondary">Sort by</span>
            <label className="text-sm">
              <select className="rounded-lg border border-appBorder px-3 py-2 text-sm outline-none transition focus:border-slate-400">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Mileage</option>
                <option>Safety Rating</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {carsQuery.isLoading
              ? Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={index} />)
              : cars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    isCompared={comparison.selectedIds.includes(car.id)}
                    isShortlisted={shortlisted.has(car.id)}
                    onCompareToggle={comparison.toggle}
                    onShortlistToggle={(id) =>
                      shortlisted.has(id) ? remove(id) : save(id)
                    }
                  />
                ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(Math.max(1, page - 1))}
              className="rounded border border-appBorder bg-white px-3 py-2 text-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-textSecondary">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              className="rounded border border-appBorder bg-white px-3 py-2 text-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      </div>

      <FilterSheet
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        filters={filters}
        onChange={setFilter}
      />

      <ComparisonBar
        selectedCars={comparedCars}
        onRemove={comparison.remove}
        show={comparison.showBar}
      />
    </div>
  );
};

export default BrowsePage;
