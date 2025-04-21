import { gql } from 'graphql-request';

export const getFungibleAccountsByPublicKeyQuery = (params: any): string => {
  if (Object.keys(params).length === 0) {
    throw new Error('No parameters provided to getFungibleAccountsByPublicKeyQuery.');
  }

  const query = Object.entries(params)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value}"` : value}`)
    .join(', ');

  const queryGql = gql`
    query {
      fungibleAccountsByPublicKey(${query}) {
        accountName
        chainAccounts {
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
        fungibleName
        id
        totalBalance
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
