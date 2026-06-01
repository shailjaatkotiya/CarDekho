export type CarFilters = {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  bodyTypes?: string[];
  fuelType?: string;
  transmission?: string;
  seatingCapacity?: number;
};

export type FilterValue = string | number | string[] | undefined;

export type Pagination = {
  limit: number;
  offset: number;
};
