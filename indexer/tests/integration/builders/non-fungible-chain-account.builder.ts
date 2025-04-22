import { gql } from 'graphql-request';

export const getNonFungibleChainAccountQuery = (params: any): string => {
  if (Object.keys(params).length === 0) {
    throw new Error('No parameters provided to getNonFungibleChainAccountQuery.');
  }

  const query = Object.entries(params)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value}"` : value}`)
    .join(', ');

  const queryGql = gql`
    query {
      nonFungibleChainAccount(${query}) {
        id
        accountName
        nonFungibleTokenBalances {
          id
          accountName
          chainId
          guard {
            raw
          }
          info {
            precision
            supply
            uri
          }
          tokenId
          version
        }
      }
    }
  `;

  return queryGql;
};
