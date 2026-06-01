import type { Comparison } from "../../../types/car";

type ComparisonTableProps = {
  comparison: Comparison;
};

export const ComparisonTable = ({ comparison }: ComparisonTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[760px] border-collapse text-sm">
      <thead>
        <tr>
          <th className="border border-appBorder p-2">Metric</th>
          {comparison.cars.map((car) => (
            <th key={car.id} className="border border-appBorder p-2">{car.make.name} {car.model.name}</th>
          ))}
        </tr>
      </thead>
    </table>
  </div>
);
