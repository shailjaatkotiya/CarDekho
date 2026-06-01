export const CardSkeleton = () => (
  <div className="card-surface overflow-hidden">
    <div className="skeleton h-40 w-full" />
    <div className="space-y-3 p-4">
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-8 w-full" />
    </div>
  </div>
);
