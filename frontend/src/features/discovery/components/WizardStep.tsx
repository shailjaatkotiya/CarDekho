import type { ReactNode } from "react";

type WizardStepProps = {
  number: number;
  title: string;
  active: boolean;
  children: ReactNode;
};

export const WizardStep = ({ number, title, active, children }: WizardStepProps) => (
  <div className={`card-surface p-4 ${active ? "ring-2 ring-brandRed" : ""}`}>
    <div className="mb-3 flex items-center gap-3">
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
          active ? "bg-brandRed text-white" : "bg-appBg text-textSecondary"
        }`}
      >
        {number}
      </span>
      <h3 className="font-heading text-lg">{title}</h3>
    </div>
    {children}
  </div>
);
