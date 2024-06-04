import { staticTokens, unknownToken } from '../constants/tokens'

export const transformRawBalances = ({
  prices,
  allBalances,
}: any) => {
  if (!allBalances) {
    return []
  }

  const balancesObj = allBalances.nodes
    .sort((a: any, b: any) => a.chainId - b.chainId)
    .reduce((prev: any, current: any) => {
      const {
        balance,
        module = '',
      } = current || {}

      const formatedModule = current.module === 'coin' ? 'kadena' : current.module

      const rawEtl = prices?.find(({ id }: any) => formatedModule.includes(id)) || {}

      const etl = {
        current_price: rawEtl.current_price,
        price_change_percentage_24h: rawEtl.price_change_percentage_24h
      }

      if (!prev[module]) {
        prev[module] = {
          module,
          balance: 0,
          balances: [],

          ...etl,
          // ...metadata
          ...rawEtl
        }
      }

      prev[module].balance = prev[module].balance + Number(balance)

      prev[module].balances.push({
        ...etl,
        ...current,
      })

      return prev
    }, {})

  return Object.values(balancesObj).sort((a, b) => {
    return (b.current_price || 0) - (a.current_price || 0)
  })
}
