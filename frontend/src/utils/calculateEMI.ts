export const calculateEMI = (
  principal: number,
  annualRate: number,
  tenureMonths: number
): number => {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;
  return numerator / denominator;
};
