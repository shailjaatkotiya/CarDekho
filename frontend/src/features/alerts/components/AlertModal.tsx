import { useState } from "react";

import { Modal } from "../../../components/Modal";
import { useAlerts } from "../hooks/useAlerts";

type AlertModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetId?: number;
};

export const AlertModal = ({ open, onOpenChange, targetId }: AlertModalProps) => {
  const [threshold, setThreshold] = useState(10);
  const alertMutation = useAlerts();

  return (
    <Modal title="Set Price Alert" open={open} onOpenChange={onOpenChange}>
      <label className="text-sm text-textSecondary">
        Alert me when price drops below (Lakh)
        <input
          type="number"
          value={threshold}
          onChange={(event) => setThreshold(Number(event.target.value))}
          className="mt-1 w-full rounded-lg border border-appBorder px-3 py-2"
        />
      </label>
      <button
        className="mt-4 rounded-lg bg-brandRed px-4 py-2 text-white"
        onClick={async () => {
          await alertMutation.mutateAsync({
            alertType: "price",
            targetId,
            thresholdPrice: threshold
          });
          onOpenChange(false);
        }}
      >
        Save alert
      </button>
    </Modal>
  );
};
