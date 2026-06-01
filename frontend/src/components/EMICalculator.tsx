import { useMemo, useState } from "react";

import { calculateEMI } from "../utils/calculateEMI";

type EMICalculatorProps = {
  principal: number;
};

export const EMICalculator = ({ principal }: EMICalculatorProps) => {
  const [rate, setRate] = useState(9.5);
  const [months, setMonths] = useState(60);
  const emi = useMemo(() => calculateEMI(principal * 100000, rate, months), [principal, rate, months]);

  return (
    <div className="card-surface p-4">
      <h3 className="font-heading text-lg">EMI Calculator</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-sm text-textSecondary">
          Interest %
          <input
            type="number"
            value={rate}
            onChange={(event) => setRate(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-appBorder px-3 py-2"
          />
        </label>
        <label className="text-sm text-textSecondary">
          Tenure (months)
          <input
            type="number"
            value={months}
            onChange={(event) => setMonths(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-appBorder px-3 py-2"
          />
        </label>
      </div>
      <p className="mt-3 font-numeric text-xl font-semibold text-brandRed">Rs {emi.toFixed(0)} / month</p>
    </div>
  );
};
