type StarRatingProps = {
  value: number;
};

export const StarRating = ({ value }: StarRatingProps) => {
  const full = Math.round(value);
  return (
    <div className="text-warningAmber" aria-label={`Rated ${value} out of 5`}>
      {"★".repeat(full)}
      <span className="text-slate-300">{"★".repeat(Math.max(0, 5 - full))}</span>
    </div>
  );
};
