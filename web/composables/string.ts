export const shortenAddress = (
  address: string,
  chars = 5
): string => {
  if (!address) {
    return ''
  }

  return `${address.slice(0, chars)}...${address.slice(
    -chars
  )}`
}
