import type { Car, Comparison, Recommendation, Review } from "../types/car";
import type { CarFilters, Pagination } from "../types/filter";

type CarsResult = {
  nodes: Car[];
  pageInfo: { total: number; limit: number; offset: number };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

const toQuery = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
};

export const listCars = ({
  filter,
  page
}: {
  filter?: CarFilters;
  page?: Pagination;
} = {}): Promise<CarsResult> =>
  request<CarsResult>(
    `/api/cars${toQuery({
      q: filter?.q,
      bodyTypes: filter?.bodyTypes?.join(","),
      fuelType: filter?.fuelType,
      transmission: filter?.transmission,
      minPrice: filter?.minPrice,
      maxPrice: filter?.maxPrice,
      seatingCapacity: filter?.seatingCapacity,
      limit: page?.limit,
      offset: page?.offset
    })}`
  );

export const getCarById = (id?: string): Promise<Car | null> => {
  if (!id) return Promise.resolve(null);
  return request<Car>(`/api/cars/${encodeURIComponent(id)}`);
};

export const getUpcomingCars = (): Promise<Car[]> => request<Car[]>("/api/cars/upcoming");

export const getSimilarCars = (id?: string, limit = 4): Promise<Car[]> => {
  if (!id) return Promise.resolve([]);
  return request<Car[]>(
    `/api/cars/${encodeURIComponent(id)}/similar${toQuery({ limit })}`
  );
};

export const getReviews = (variantId?: string): Promise<Review[]> => {
  if (!variantId) return Promise.resolve([]);
  return request<Review[]>(`/api/cars/${encodeURIComponent(variantId)}/reviews`);
};

export const calculateOnRoadPrice = async (variantId?: string): Promise<number> => {
  if (!variantId) return 0;
  const data = await request<{ totalOnRoadPrice: number }>(
    `/api/cars/${encodeURIComponent(variantId)}/on-road-price`
  );
  return data.totalOnRoadPrice;
};

export const compareCars = (ids: string[]): Promise<Comparison> =>
  request<Comparison>("/api/compare", {
    method: "POST",
    body: JSON.stringify({ ids })
  });

export const recommendCars = (input: Record<string, unknown>): Promise<Recommendation[]> =>
  request<Recommendation[]>("/api/recommendations", {
    method: "POST",
    body: JSON.stringify(input)
  });
