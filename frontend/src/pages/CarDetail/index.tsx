import { useState } from "react";
import { Check } from "lucide-react";
import { useParams } from "react-router-dom";

import { LazyImage } from "../../components/LazyImage";
import { useQuery } from "@tanstack/react-query";

import { calculateOnRoadPrice, getCarById, getReviews, getSimilarCars } from "../../data/catalog";
import { ComparisonBrief } from "../../features/comparison/components/ComparisonBrief";
import { formatMileage } from "../../utils/formatMileage";
import { formatPrice } from "../../utils/formatPrice";
import { EMICalculator } from "../../components/EMICalculator";
import { PriceBreakdown } from "../../components/PriceBreakdown";
import { StarRating } from "../../components/StarRating";

const tabs = ["Overview", "Specs", "Features", "Variants", "Reviews", "Comparisons"] as const;

const CarDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");
  const [onRoadPrice, setOnRoadPrice] = useState<number | undefined>(undefined);

  const carQuery = useQuery({
    queryKey: ["car", id],
    enabled: Boolean(id),
    queryFn: async () => getCarById(id)
  });

  const reviewsQuery = useQuery({
    queryKey: ["reviews", id],
    enabled: Boolean(id),
    queryFn: async () => getReviews(id)
  });

  const similarQuery = useQuery({
    queryKey: ["similarCars", id],
    enabled: Boolean(id),
    queryFn: async () => getSimilarCars(id, 4)
  });

  const car = carQuery.data;
  if (!car) {
    return (
      <div className="app-container py-10">
        <div className="card-surface p-6">Loading car details...</div>
      </div>
    );
  }

  return (
    <div className="app-container py-6">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <div className="card-surface overflow-hidden">
            <LazyImage
              src={car.images[0]}
              alt={`${car.make.name} ${car.model.name}`}
              width={800}
              eager
              className="h-[320px] w-full object-cover"
            />
            <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-5">
              <div><p className="text-xs text-textSecondary">Mileage</p><p>{formatMileage(car.topMileage)}</p></div>
              <div><p className="text-xs text-textSecondary">Transmission</p><p>{car.transmission}</p></div>
              <div><p className="text-xs text-textSecondary">Fuel</p><p>{car.fuelType}</p></div>
              <div><p className="text-xs text-textSecondary">Seating</p><p>{car.seatingCapacity}</p></div>
              <div><p className="text-xs text-textSecondary">Safety</p><p>{car.topSafetyRating ?? "NA"}</p></div>
            </div>
          </div>

          <div className="card-surface p-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    activeTab === tab ? "bg-brandRed text-white" : "bg-appBg text-textSecondary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {activeTab === "Overview" ? (
                <div className="space-y-3 text-sm text-textSecondary">
                  <p>
                    {car.description ??
                      `${car.make.name} ${car.model.name} ${car.variant} is best for users who want ${car.model.bodyType} practicality with confidence-driven buying support.`}
                  </p>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="rounded-lg border border-appBorder p-3">
                      <h4 className="font-semibold text-textPrimary">Pros</h4>
                      <ul className="mt-2 list-disc pl-5">
                        {car.features.slice(0, 3).map((feature) => <li key={feature}>{feature}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-appBorder p-3">
                      <h4 className="font-semibold text-textPrimary">Best for</h4>
                      <ul className="mt-2 list-disc pl-5">
                        <li>Family buyers</li>
                        <li>Mixed city + highway use</li>
                        <li>Value conscious ownership</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "Specs" ? (
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    <tr><td className="border border-appBorder p-2">Price</td><td className="border border-appBorder p-2">{formatPrice(car.priceRange.min)}</td></tr>
                    <tr><td className="border border-appBorder p-2">Fuel</td><td className="border border-appBorder p-2">{car.fuelType}</td></tr>
                    <tr><td className="border border-appBorder p-2">Transmission</td><td className="border border-appBorder p-2">{car.transmission}</td></tr>
                    <tr><td className="border border-appBorder p-2">Safety</td><td className="border border-appBorder p-2">{car.topSafetyRating ?? "NA"}</td></tr>
                  </tbody>
                </table>
              ) : null}

              {activeTab === "Features" ? (
                car.featureGroups && car.featureGroups.length ? (
                  <div className="space-y-4">
                    {car.featureGroups.map((group) => (
                      <div key={group.category}>
                        <h4 className="mb-2 flex items-center gap-2 font-semibold capitalize text-textPrimary">
                          {group.category}
                          <span className="rounded-full bg-appBg px-2 py-0.5 text-xs font-normal text-textSecondary">
                            {group.items.length}
                          </span>
                        </h4>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {group.items.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 rounded-lg border border-appBorder px-3 py-2 text-sm capitalize"
                            >
                              <Check size={16} className="shrink-0 text-successGreen" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature) => (
                      <span key={feature} className="rounded-full bg-appBg px-3 py-1 text-xs capitalize">
                        {feature}
                      </span>
                    ))}
                  </div>
                )
              ) : null}

              {activeTab === "Variants" ? (
                <div className="rounded-lg border border-appBorder">
                  <div className="grid grid-cols-4 gap-2 border-b border-appBorder bg-appBg p-3 text-sm font-semibold">
                    <span>Variant</span><span>Price</span><span>Fuel</span><span>Transmission</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 p-3 text-sm">
                    <span>{car.variant}</span><span>{formatPrice(car.priceRange.min)}</span><span>{car.fuelType}</span><span>{car.transmission}</span>
                  </div>
                </div>
              ) : null}

              {activeTab === "Reviews" ? (
                <div className="space-y-3">
                  {reviewsQuery.data?.map((review) => (
                    <article key={review.id} className="rounded-lg border border-appBorder p-3">
                      <div className="flex items-center justify-between">
                        <StarRating value={review.ratingOverall} />
                        <span className="text-xs text-textSecondary">{review.ownershipMonths} months ownership</span>
                      </div>
                      <p className="mt-2 text-sm text-textSecondary">{review.body}</p>
                    </article>
                  ))}
                </div>
              ) : null}

              {activeTab === "Comparisons" ? (
                <ComparisonBrief base={car} rivals={similarQuery.data ?? []} />
              ) : null}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card-surface p-4">
            <h1 className="font-heading text-2xl">{car.make.name} {car.model.name}</h1>
            <p className="text-textSecondary">{car.variant}</p>
            <p className="mt-2 font-numeric text-2xl font-bold text-brandRed">
              {formatPrice(car.priceRange.min)}
            </p>
            <button
              onClick={() => {
                calculateOnRoadPrice(id).then(setOnRoadPrice);
              }}
              className="mt-3 w-full rounded-lg bg-brandRed px-3 py-2 text-white"
            >
              Get on-road price for my city
            </button>
            <button
              onClick={() => alert("Test drive request saved locally for the demo.")}
              className="mt-2 w-full rounded-lg border border-appBorder px-3 py-2"
            >
              Book test drive
            </button>
          </div>
          <PriceBreakdown exShowroomPrice={car.priceRange.min} onRoadPrice={onRoadPrice} />
          <EMICalculator principal={car.priceRange.min} />
        </aside>
      </section>
    </div>
  );
};

export default CarDetailPage;
