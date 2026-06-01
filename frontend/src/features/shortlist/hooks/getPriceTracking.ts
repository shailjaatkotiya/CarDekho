export const getPriceTracking = (price: number) => {
  const simulatedChange = Math.round((Math.random() - 0.4) * 30000);
  return {
    changeAmount: simulatedChange,
    direction: simulatedChange < 0 ? "down" : "up",
    latestPrice: price + simulatedChange
  };
};
