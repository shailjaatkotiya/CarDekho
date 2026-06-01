export const generateShareLink = (token: string): string => {
  const base = window.location.origin;
  return `${base}/shortlist?token=${encodeURIComponent(token)}`;
};
