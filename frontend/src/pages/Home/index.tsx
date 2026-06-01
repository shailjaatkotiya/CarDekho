import { Link } from "react-router-dom";
import { CarFront, Car, Truck, Zap, Shield, Landmark } from "lucide-react";

import { CarCard } from "../../components/CarCard";
import { CardSkeleton } from "../../components/Skeleton";
import { useCars, useUpcomingCars } from "../../hooks/useCars";

const bodyTypes = [
  { label: "SUV", icon: CarFront },
  { label: "Sedan", icon: Car },
  { label: "Hatchback", icon: CarFront },
  { label: "MUV", icon: Truck },
  { label: "Pickup", icon: Truck },
  { label: "Luxury", icon: Landmark }
];

const budgetPills = ["Under Rs 5L", "Rs 5-8L", "Rs 8-12L", "Rs 12-20L", "Rs 20L+"];

const HomePage = () => {
  const trendingQuery = useCars({ page: { limit: 8, offset: 0 } });
  const upcomingCarsQuery = useUpcomingCars();
  const evQuery = useCars({ filter: { fuelType: "electric" }, page: { limit: 8, offset: 0 } });

  return (
    <div>
      <section id="main-app" className="app-container tech-grid py-8">
        <div className="card-surface overflow-hidden border-slate-400/40 bg-gradient-to-r from-black to-zinc-700 p-6 text-white">
          <h1 className="font-heading text-3xl md:text-[2.8rem]">
            Buy with confidence, not guesswork.
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85">
            Search, compare, and get explainable recommendations tailored to your budget,
            usage, and family needs.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {budgetPills.map((pill) => (
              <button
                key={pill}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90"
              >
                {pill}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <Link
              to="/discovery"
              className="rounded-lg bg-brandRed px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Start Smart Advisor
            </Link>
          </div>
        </div>

        <section className="mt-8">
          <div className="section-heading">
            <div>
              <h2 className="section-title">Body Type Explorer</h2>
              <p className="section-subtitle">Choose your preferred form factor</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {bodyTypes.map((bodyType) => {
              const Icon = bodyType.icon;
              return (
                <Link
                  key={bodyType.label}
                  to={`/browse?bodyTypes=${bodyType.label.toLowerCase()}`}
                  className="card-surface flex flex-col items-center gap-3 p-4 text-center transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
                >
                  <Icon size={24} className="text-brandRed" />
                  <span className="text-sm font-semibold">{bodyType.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <div className="section-heading">
            <div>
              <h2 className="section-title">Trending Cars</h2>
              <p className="section-subtitle">Most searched this week</p>
            </div>
            <Link to="/browse" className="text-sm font-semibold text-brandRed">View all</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {trendingQuery.isLoading
              ? Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)
              : trendingQuery.data?.nodes.map((car) => (
                  <CarCard key={car.id} car={car} badges={["Trending"]} />
                ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="card-surface p-5">
            <div className="mb-2 flex items-center gap-2 text-brandRed">
              <Shield size={18} />
              <h3 className="font-heading text-xl">Popular Comparisons</h3>
            </div>
            <p className="text-sm text-textSecondary">Compare two cars instantly and get row-wise winners.</p>
            <div className="mt-3 space-y-2">
              <Link
                to="/compare"
                className="block rounded-lg border border-appBorder px-3 py-2 text-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Hyundai Creta vs Kia Seltos
              </Link>
              <Link
                to="/compare"
                className="block rounded-lg border border-appBorder px-3 py-2 text-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Tata Nexon vs Maruti Brezza
              </Link>
            </div>
          </div>
          <div className="card-surface p-5">
            <div className="mb-2 flex items-center gap-2 text-warningAmber">
              <Zap size={18} />
              <h3 className="font-heading text-xl">Electric Cars Spotlight</h3>
            </div>
            <p className="text-sm text-textSecondary">Range, charging readiness, and EV value in one place.</p>
            <Link
              to="/ev"
              className="mt-4 inline-block rounded-lg bg-brandRed px-3 py-2 text-sm text-white transition hover:bg-zinc-800"
            >
              Explore EV Section
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="section-heading">
            <h2 className="section-title">New Launches This Month</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {upcomingCarsQuery.isLoading
              ? Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)
              : upcomingCarsQuery.data?.map((car) => (
                  <CarCard key={car.id} car={car} badges={["New"]} />
                ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="section-heading">
            <h2 className="section-title">Electric Cars</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {evQuery.isLoading
              ? Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)
              : evQuery.data?.nodes.map((car) => <CarCard key={car.id} car={car} badges={["EV"]} />)}
          </div>
        </section>
      </section>
    </div>
  );
};

export default HomePage;
