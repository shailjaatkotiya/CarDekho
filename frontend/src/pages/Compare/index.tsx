import { Link } from "react-router-dom";

import { useComparison } from "../../features/comparison/hooks/useComparison";
import { useComparisonStore } from "../../features/comparison/store";
import { CarCard } from "../../components/CarCard";

const parseRowValue = (values: string[], id: string): string => {
  const pair = values.find((entry) => entry.startsWith(`${id}:`));
  return pair ? pair.split(":").slice(1).join(":") : "-";
};

const ComparePage = () => {
  const selectedIds = useComparisonStore((state) => state.selectedIds);
  const comparisonQuery = useComparison();

  if (selectedIds.length < 2) {
    return (
      <div className="app-container py-10">
        <div className="card-surface p-6">
          <h1 className="font-heading text-3xl">Comparison Page</h1>
          <p className="mt-2 text-textSecondary">
            Add at least two cars from Browse or Discovery to compare them side by side.
          </p>
          <Link to="/browse" className="mt-4 inline-block rounded-lg bg-brandRed px-4 py-2 text-white">
            Browse cars
          </Link>
        </div>
      </div>
    );
  }

  const comparison = comparisonQuery.data;
  if (!comparison) {
    return <div className="app-container py-10">Loading comparison...</div>;
  }

  return (
    <div className="app-container py-6">
      <div className="section-heading">
        <div>
          <h1 className="section-title">Compare Cars</h1>
          <p className="section-subtitle">Up to 4 cars with row-wise winners and AI verdict</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {comparison.cars.map((car) => (
          <CarCard key={car.id} car={car} showCompareCheckbox={false} showShortlistButton={false} />
        ))}
      </div>

      <div className="mt-6 overflow-x-auto card-surface p-4">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-appBorder bg-appBg p-2 text-left">Metric</th>
              {comparison.cars.map((car) => (
                <th key={car.id} className="border border-appBorder bg-appBg p-2 text-left">
                  {car.make.name} {car.model.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.winnerPerRow.map((row) => (
              <tr key={row.key}>
                <td className="border border-appBorder p-2 font-semibold">{row.label}</td>
                {comparison.cars.map((car) => {
                  const isWinner = row.winnerVariantId === car.id;
                  return (
                    <td
                      key={`${row.key}-${car.id}`}
                      className={`border border-appBorder p-2 ${
                        isWinner ? "bg-successGreen/15 font-semibold" : ""
                      }`}
                    >
                      {parseRowValue(row.values, car.id)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-6 card-surface p-4">
        <h2 className="font-heading text-xl">AI Verdict</h2>
        <p className="mt-2 text-textSecondary">{comparison.verdict}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {comparison.buyerTypeMatch.map((match) => (
            <span key={match} className="rounded-full bg-appBg px-3 py-1 text-xs">{match}</span>
          ))}
        </div>
        <button className="mt-4 rounded-lg border border-appBorder px-3 py-2 text-sm">
          Export PDF (roadmap)
        </button>
      </section>
    </div>
  );
};

export default ComparePage;
