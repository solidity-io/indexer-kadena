import { tokens, unknownToken } from '../constants/tokens'

export const formatBalances = (balances?: any[]) => {
  if (!balances) {
    return []
  }

  const balancesObj = balances.sort((a, b) => a.chainId - b.chainId).reduce((prev: any, current: any) => {
    const {
      balance,
      module = '',
    } = current || {}

    const metadata = tokens[module] || unknownToken

    if (!prev[module]) {
      prev[module] = {
        module,
        balance: 0,
        balances: [],

        ...metadata,
      }
    }

    prev[module].balance = prev[module].balance + Number(balance)

    prev[module].balances.push(current)

    return prev
  }, {})

  return Object.values(balancesObj)
}
