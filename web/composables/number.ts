export const formatNumber = new Intl.NumberFormat('en-US', {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})
