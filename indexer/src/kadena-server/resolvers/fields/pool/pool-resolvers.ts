export const poolResolvers = {
  tvlUsd: (parent: any) => parent.poolStats?.[0]?.tvlUsd ?? 0,
  volume24hUsd: (parent: any) => parent.poolStats?.[0]?.volume24hUsd ?? 0,
  volume7dUsd: (parent: any) => parent.poolStats?.[0]?.volume7dUsd ?? 0,
  transactionCount24h: (parent: any) => parent.poolStats?.[0]?.transactionCount24h ?? 0,
  apr24h: (parent: any) => parent.poolStats?.[0]?.apr24h ?? 0,
};
