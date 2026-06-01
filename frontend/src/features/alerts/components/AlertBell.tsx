import { Bell } from "lucide-react";

type AlertBellProps = {
  onClick: () => void;
};

export const AlertBell = ({ onClick }: AlertBellProps) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-lg border border-appBorder bg-white px-3 py-2 text-sm"
  >
    <Bell size={16} />
    Alert
  </button>
);
