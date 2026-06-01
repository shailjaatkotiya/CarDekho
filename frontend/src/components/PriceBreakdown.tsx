type PriceBreakdownProps = {
  exShowroomPrice: number;
  onRoadPrice?: number;
};

export const PriceBreakdown = ({ exShowroomPrice, onRoadPrice }: PriceBreakdownProps) => (
  <div className="card-surface p-4">
    <h3 className="font-heading text-lg">Price Breakdown</h3>
    <dl className="mt-3 space-y-2 text-sm text-textSecondary">
      <div className="flex justify-between">
        <dt>Ex-showroom</dt>
        <dd className="font-numeric text-textPrimary">Rs {exShowroomPrice.toFixed(2)}L</dd>
      </div>
      <div className="flex justify-between">
        <dt>Estimated on-road</dt>
        <dd className="font-numeric text-brandRed">
          {onRoadPrice ? `Rs ${onRoadPrice.toFixed(2)}L` : "Tap calculate"}
        </dd>
      </div>
    </dl>
  </div>
);
