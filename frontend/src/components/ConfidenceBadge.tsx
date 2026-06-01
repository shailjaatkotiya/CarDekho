type ConfidenceBadgeProps = {
  score: number;
};

export const ConfidenceBadge = ({ score }: ConfidenceBadgeProps) => {
  const tone =
    score >= 85 ? "bg-successGreen" : score >= 70 ? "bg-warningAmber" : "bg-brandRed";
  return <span className={`confidence-pill ${tone}`}>{score.toFixed(0)}% Match</span>;
};
