import { CarCard } from "../../components/CarCard";
import { useCars } from "../../hooks/useCars";

const UsedCarsPage = () => {
  const usedCarsQuery = useCars({ filter: { minPrice: 4, maxPrice: 18 }, page: { limit: 12, offset: 0 } });

  return (
    <div className="app-container py-6">
      <div className="section-heading">
        <div>
          <h1 className="section-title">Used Cars</h1>
          <p className="section-subtitle">Condition-first listings with verification signals</p>
        </div>
      </div>

      <div className="mb-4 card-surface p-4 text-sm text-textSecondary">
        Filters: Year range, mileage driven, owners, verified only, condition badge, RC verification.
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {usedCarsQuery.data?.nodes.map((car, index) => (
          <div key={car.id} className="space-y-2">
            <CarCard
              car={car}
              badges={[index % 3 === 0 ? "Excellent" : index % 3 === 1 ? "Good" : "Fair"]}
              showCompareCheckbox
            />
            <div className="card-surface p-3 text-xs text-textSecondary">
              <p>217-point inspection: Brakes, suspension, AC, electricals</p>
              <p className="mt-1">Fair market value: {index % 2 === 0 ? "At market" : "Below market"}</p>
              <p className="mt-1 text-successGreen">RC verified</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsedCarsPage;
