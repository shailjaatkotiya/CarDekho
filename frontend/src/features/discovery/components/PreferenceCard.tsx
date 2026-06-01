import type { ReactNode } from "react";

type PreferenceCardProps = {
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  children?: ReactNode;
};

export const PreferenceCard = ({
  title,
  description,
  selected = false,
  onClick,
  children
}: PreferenceCardProps) => (
  <button
    onClick={onClick}
    className={`w-full rounded-lg border p-3 text-left ${
      selected ? "border-brandRed bg-brandRed/5" : "border-appBorder"
    }`}
  >
    <h4 className="font-semibold">{title}</h4>
    <p className="mt-1 text-xs text-textSecondary">{description}</p>
    {children}
  </button>
);
