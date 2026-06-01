import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

import type { Car } from "../types/car";
import { LazyImage } from "./LazyImage";

type ComparisonBarProps = {
  selectedCars: Car[];
  onRemove: (id: string) => void;
  show: boolean;
};

export const ComparisonBar = ({ selectedCars, onRemove, show }: ComparisonBarProps) => (
  <AnimatePresence>
    {show ? (
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-appBorder bg-white/95 px-4 py-3 text-textPrimary shadow-[0_-8px_24px_rgba(20,20,20,0.08)] backdrop-blur-md"
        aria-live="polite"
      >
        <div className="app-container flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {selectedCars.map((car) => (
              <div
                key={car.id}
                className="flex items-center gap-2 rounded-lg border border-appBorder bg-white px-2 py-1 text-sm"
              >
                <LazyImage
                  src={car.images[0]}
                  alt={`${car.make.name} ${car.model.name}`}
                  width={120}
                  className="h-8 w-10 rounded object-cover"
                />
                <span>{car.make.name} {car.model.name}</span>
                <button
                  aria-label="Remove from comparison"
                  onClick={() => onRemove(car.id)}
                  className="text-textSecondary transition hover:text-textPrimary"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <Link
            to="/compare"
            className="rounded-lg bg-brandRed px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Compare Now
          </Link>
        </div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);
