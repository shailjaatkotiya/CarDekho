import { useCars } from "../../hooks/useCars";
import { CarCard } from "../../components/CarCard";
import { calculateEMI } from "../../utils/calculateEMI";

const EVSectionPage = () => {
  const evQuery = useCars({ filter: { fuelType: "electric" }, page: { limit: 12, offset: 0 } });

  return (
    <div className="app-container py-6">
      <div className="section-heading">
        <div>
          <h1 className="section-title">EV Decision Center</h1>
          <p className="section-subtitle">Range, charging readiness, and long-term ownership economics</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="card-surface p-4">
          <h3 className="font-heading text-lg">EV-specific filters</h3>
          <p className="mt-2 text-sm text-textSecondary">Range, charging type, battery capacity, DC fast charging support.</p>
        </div>
        <div className="card-surface p-4">
          <h3 className="font-heading text-lg">Charging availability</h3>
          <p className="mt-2 text-sm text-textSecondary">City-level charging readiness indicator with public station density.</p>
        </div>
        <div className="card-surface p-4">
          <h3 className="font-heading text-lg">5-year EV vs Petrol cost</h3>
          <p className="mt-2 text-sm text-textSecondary">
            Indicative EV EMI: Rs {calculateEMI(1600000, 9.2, 60).toFixed(0)}/month.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {evQuery.data?.nodes.map((car) => (
          <CarCard key={car.id} car={car} badges={["EV", "Trending"]} />
        ))}
      </div>
    </div>
  );
};

export default EVSectionPage;
