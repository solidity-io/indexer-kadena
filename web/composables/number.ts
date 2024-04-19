export const money = new Intl.NumberFormat('en-US', {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export const moneyCompact = new Intl.NumberFormat('en-US', {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export const integer = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
})
