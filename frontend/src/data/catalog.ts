import rawCatalog from "../../../data/cars.json";

import type { Car, Comparison, Recommendation, Review } from "../types/car";
import type { CarFilters, Pagination } from "../types/filter";

type RawCar = {
  id: string;
  make: string;
  model: string;
  variant: string;
  modelYear: number;
  bodyType: string;
  segment: string;
  exShowroomPriceLakh: { min: number; max: number };
  preferredFuelType: string;
  fuelTypes?: string[];
  usageType?: string;
  gearType: string;
  transmissionOptions?: string[];
  seatingCapacity: number;
  mileageKmpl?: { min: number; max: number } | null;
  rangeKm?: number | null;
  featureScore?: {
    safety?: number;
    comfort?: number;
    technology?: number;
    performance?: number;
    value?: number;
  };
  features: Record<string, string[]>;
  idealBuyer?: string;
  productDescription?: string;
  recommendationTags?: string[];
  pros?: string[];
  tradeoffs?: string[];
  imageUrl: string;
};

type Catalog = {
  cars: RawCar[];
};

type CarsResult = {
  nodes: Car[];
  pageInfo: { total: number; limit: number; offset: number };
};

const catalog = rawCatalog as Catalog;

const titleCase = (value: string) =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const makeId = (make: string) => make.toLowerCase().replace(/\s+/g, "-");

export const cars: Car[] = catalog.cars.map((car) => {
  const featureGroups = Object.entries(car.features).map(([category, items]) => ({
    category,
    items
  }));
  const features = featureGroups.flatMap((group) => group.items);
  const mileage = car.mileageKmpl ? car.mileageKmpl.max : null;
  const safetyScore = car.featureScore?.safety;

  return {
    id: car.id,
    make: { id: makeId(car.make), name: car.make },
    model: {
      id: `${makeId(car.make)}-${car.model.toLowerCase().replace(/\s+/g, "-")}`,
      name: car.model,
      bodyType: car.bodyType,
      segment: car.segment
    },
    variant: car.variant,
    priceRange: car.exShowroomPriceLakh,
    fuelType: car.preferredFuelType,
    transmission: car.gearType,
    topSafetyRating: safetyScore ? Math.min(5, Math.max(1, Math.round(safetyScore / 2))) : null,
    topMileage: mileage,
    seatingCapacity: car.seatingCapacity,
    images: [car.imageUrl],
    features,
    featureGroups,
    isNew: car.modelYear >= 2026,
    isEV: car.preferredFuelType === "electric",
    description: car.productDescription,
    idealBuyer: car.idealBuyer,
    pros: car.pros ?? [],
    tradeoffs: car.tradeoffs ?? [],
    recommendationTags: car.recommendationTags ?? [],
    rangeKm: car.rangeKm ?? null,
    featureScore: car.featureScore ?? {}
  };
});

const matchesFilter = (car: Car, filter?: CarFilters) => {
  if (!filter) return true;
  const query = filter.q?.trim().toLowerCase();
  if (
    query &&
    !`${car.make.name} ${car.model.name} ${car.variant} ${car.model.bodyType} ${car.model.segment ?? ""}`
      .toLowerCase()
      .includes(query)
  ) {
    return false;
  }
  if (filter.bodyTypes?.length && !filter.bodyTypes.includes(car.model.bodyType)) return false;
  if (filter.fuelType && car.fuelType !== filter.fuelType) return false;
  if (filter.transmission && car.transmission !== filter.transmission) return false;
  if (filter.minPrice !== undefined && car.priceRange.min < filter.minPrice) return false;
  if (filter.maxPrice !== undefined && car.priceRange.min > filter.maxPrice) return false;
  if (filter.seatingCapacity !== undefined && car.seatingCapacity < filter.seatingCapacity) return false;
  return true;
};

export const listCars = ({
  filter,
  page
}: {
  filter?: CarFilters;
  page?: Pagination;
} = {}): CarsResult => {
  const filtered = cars.filter((car) => matchesFilter(car, filter));
  const limit = page?.limit ?? filtered.length;
  const offset = page?.offset ?? 0;
  return {
    nodes: filtered.slice(offset, offset + limit),
    pageInfo: { total: filtered.length, limit, offset }
  };
};

export const getCarById = (id?: string) => cars.find((car) => car.id === id) ?? null;

export const getUpcomingCars = () => cars.filter((car) => car.isNew).slice(0, 8);

export const getSimilarCars = (id?: string, limit = 4) => {
  const base = getCarById(id);
  if (!base) return [];
  return cars
    .filter((car) => car.id !== base.id)
    .map((car) => {
      let score = 0;
      if (car.model.bodyType === base.model.bodyType) score += 3;
      if (car.make.name === base.make.name) score += 2;
      score -= Math.abs(car.priceRange.min - base.priceRange.min) / 8;
      return { car, score };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((item) => item.car);
};

export const getReviews = (variantId?: string): Review[] => {
  const car = getCarById(variantId);
  if (!car) return [];
  return [
    {
      id: `${car.id}-review-1`,
      variantId: car.id,
      ratingOverall: car.topSafetyRating ?? 4,
      ratingValue: car.featureScore?.value ? car.featureScore.value / 2 : 4,
      ratingComfort: car.featureScore?.comfort ? car.featureScore.comfort / 2 : 4,
      ratingPerformance: car.featureScore?.performance ? car.featureScore.performance / 2 : 4,
      ratingMileage: car.topMileage ? 4 : 3.8,
      ratingFeatures: car.featureScore?.technology ? car.featureScore.technology / 2 : 4,
      ratingService: 4,
      body: `${car.make.name} ${car.model.name} feels like a strong fit for ${car.idealBuyer ?? "daily use"}`,
      ownershipMonths: 8,
      upvotes: 24,
      isVerified: true,
      createdAt: "2026-06-01"
    }
  ];
};

export const calculateOnRoadPrice = (variantId?: string) => {
  const car = getCarById(variantId);
  if (!car) return 0;
  return Number((car.priceRange.min * 1.16 + 0.35).toFixed(2));
};

export const compareCars = (ids: string[]): Comparison => {
  const selectedCars = ids.map((id) => getCarById(id)).filter(Boolean) as Car[];
  const rows = [
    { key: "price", label: "Price", value: (car: Car) => car.priceRange.min, pick: Math.min },
    { key: "mileage", label: "Mileage", value: (car: Car) => car.topMileage ?? car.rangeKm ?? 0, pick: Math.max },
    { key: "safety", label: "Safety", value: (car: Car) => car.topSafetyRating ?? 0, pick: Math.max },
    { key: "seating", label: "Seating", value: (car: Car) => car.seatingCapacity, pick: Math.max }
  ];

  const winnerPerRow = rows.map((row) => {
    const valuesByCar = selectedCars.map((car) => ({ id: car.id, value: row.value(car) }));
    const winnerValue = valuesByCar.length ? row.pick(...valuesByCar.map((item) => item.value)) : 0;
    return {
      key: row.key,
      label: row.label,
      winnerVariantId: valuesByCar.find((item) => item.value === winnerValue)?.id ?? null,
      values: valuesByCar.map((item) => `${item.id}:${item.value}`)
    };
  });

  const best = selectedCars
    .map((car) => ({
      car,
      score:
        (car.topSafetyRating ?? 0) * 1.4 +
        (car.topMileage ?? 0) * 0.25 +
        (car.featureScore?.value ?? 0) -
        car.priceRange.min * 0.15
    }))
    .sort((left, right) => right.score - left.score)[0]?.car;

  return {
    cars: selectedCars,
    winnerPerRow,
    verdict: best
      ? `${best.make.name} ${best.model.name} ${best.variant} leads for balanced value, features, and everyday ownership fit.`
      : "Add cars to compare.",
    buyerTypeMatch: best
      ? [
          best.idealBuyer ?? "Balanced ownership",
          ...(best.recommendationTags ?? []).map(titleCase)
        ].slice(0, 4)
      : []
  };
};

export const recommendCars = (input: Record<string, unknown>): Recommendation[] => {
  const budget = typeof input.budget === "number" ? input.budget : 12;
  const fuelPreferences = Array.isArray(input.fuelPreferences)
    ? input.fuelPreferences.filter((fuel): fuel is string => typeof fuel === "string")
    : [];
  const familySize = typeof input.familySize === "number" ? input.familySize : 4;
  const safetyImportance = typeof input.safetyImportance === "number" ? input.safetyImportance : 3;
  const mileageImportance = typeof input.mileageImportance === "number" ? input.mileageImportance : 3;
  const featureImportance = typeof input.featureImportance === "number" ? input.featureImportance : 3;
  return cars
    .map((car) => {
      const priceScore = Math.max(0, 1 - Math.abs(car.priceRange.min - budget) / Math.max(budget, 1));
      const fuelScore = fuelPreferences.length && fuelPreferences.includes(car.fuelType) ? 1 : 0.55;
      const seatingScore = car.seatingCapacity >= familySize ? 1 : 0.3;
      const safetyScore = ((car.topSafetyRating ?? 3) / 5) * (safetyImportance / 5);
      const mileageScore =
        ((car.topMileage ?? (car.rangeKm ? car.rangeKm / 20 : 12)) / 25) *
        (mileageImportance / 5);
      const featureScore = ((car.featureScore?.technology ?? 6) / 10) * (featureImportance / 5);
      const total = priceScore * 30 + fuelScore * 18 + seatingScore * 12 + safetyScore * 16 + mileageScore * 12 + featureScore * 12;

      return {
        car,
        confidenceScore: Math.round(Math.min(98, Math.max(45, total))),
        reasoning: car.description ?? `${car.make.name} ${car.model.name} matches your budget and usage profile.`,
        matchReasons: [
          `${titleCase(car.fuelType)} powertrain`,
          `${car.seatingCapacity} seats`,
          `${titleCase(car.model.bodyType)} body style`
        ],
        tradeoffs: car.tradeoffs ?? [],
        bestFor: [car.idealBuyer ?? "Balanced ownership", ...(car.recommendationTags ?? [])].slice(0, 4)
      };
    })
    .sort((left, right) => right.confidenceScore - left.confidenceScore)
    .slice(0, 12);
};
