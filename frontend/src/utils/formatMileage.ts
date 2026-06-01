export const formatMileage = (mileage?: number | null, rangeKm?: number | null): string => {
  if (rangeKm) return `${rangeKm.toFixed(0)} km range`;
  if (mileage) return `${mileage.toFixed(1)} kmpl`;
  return "NA";
};
