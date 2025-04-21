import { gql } from 'graphql-request';

export const getNetworkInfoQuery = (): string => {
  const queryGql = gql`
    query {
      networkInfo {
        apiVersion
        coinsInCirculation
        genesisHeights {
          chainId
          height
        }
        networkHashRate
        networkHost
        networkId
        nodeBlockDelay
        nodeChains
        nodeLatestBehaviorHeight
        nodePackageVersion
        nodeServiceDate
        numberOfChains
        totalDifficulty
        transactionCount
      }
    }
  `;

  return queryGql;
};
