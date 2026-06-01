import type { ReactNode } from "react";

type SpecPillProps = {
  icon: ReactNode;
  value: string;
};

export const SpecPill = ({ icon, value }: SpecPillProps) => (
  <span className="spec-chip">
    <span>{icon}</span>
    <span>{value}</span>
  </span>
);
