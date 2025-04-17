import { gql } from 'graphql-request';

export const getFungibleChainAccountsByPublicKeyQuery = (params: any): string => {
  if (Object.keys(params).length === 0) {
    throw new Error('No parameters provided to getFungibleChainAccountsByPublicKeyQuery.');
  }

  const query = Object.entries(params)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value}"` : value}`)
    .join(', ');

  const queryGql = gql`
    query {
      fungibleChainAccountsByPublicKey(${query}) {
        accountName
        balance
        chainId
        fungibleName
        guard {
          raw
        }
        id
        transactions {
          edges {
            node {
              id
            }
          }
        }
        transfers {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;

  return queryGql;
};
