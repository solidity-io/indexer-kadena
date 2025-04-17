import { gql } from 'graphql-request';

export const getNonFungibleAccountQuery = (params: any): string => {
  if (Object.keys(params).length === 0) {
    throw new Error('No parameters provided to getNonFungibleAccountQuery.');
  }

  const query = Object.entries(params)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value}"` : value}`)
    .join(', ');

  const queryGql = gql`
    query {
      nonFungibleAccount(${query}) {
        id
        accountName
        chainAccounts {
          accountName
          chainId
          id
          nonFungibleTokenBalances {
            accountName
            balance
            chainId
            guard {
              raw
            }
            id
            info {
              precision
              supply
              uri
            }
            tokenId
            version
          }
        }
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
