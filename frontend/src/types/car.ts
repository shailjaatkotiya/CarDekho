export type Car = {
  id: string;
  make: { id: string; name: string; logoUrl?: string | null };
  model: { id: string; name: string; bodyType: string; segment?: string | null };
  variant: string;
  priceRange: { min: number; max: number };
  fuelType: string;
  transmission: string;
  topSafetyRating?: number | null;
  topMileage?: number | null;
  seatingCapacity: number;
  images: string[];
  features: string[];
  featureGroups?: FeatureGroup[];
  isNew: boolean;
  isEV: boolean;
};

export type FeatureGroup = {
  category: string;
  items: string[];
};

export type Recommendation = {
  car: Car;
  confidenceScore: number;
  reasoning: string;
  matchReasons: string[];
  tradeoffs: string[];
  bestFor: string[];
};

export type ComparisonRow = {
  key: string;
  label: string;
  winnerVariantId?: string | null;
  values: string[];
};

export type Comparison = {
  cars: Car[];
  winnerPerRow: ComparisonRow[];
  verdict: string;
  buyerTypeMatch: string[];
};

export type Review = {
  id: string;
  variantId: string;
  ratingOverall: number;
  ratingValue: number;
  ratingComfort: number;
  ratingPerformance: number;
  ratingMileage: number;
  ratingFeatures: number;
  ratingService: number;
  body: string;
  ownershipMonths: number;
  upvotes: number;
  isVerified: boolean;
  createdAt?: string | null;
};
