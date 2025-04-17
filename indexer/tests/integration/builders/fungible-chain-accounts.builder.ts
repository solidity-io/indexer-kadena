import { gql } from 'graphql-request';

export const getFungibleChainAccountsQuery = (params: any): string => {
  if (Object.keys(params).length === 0) {
    throw new Error('No parameters provided to getFungibleChainAccountsQuery.');
  }

  const query = Object.entries(params)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
      }
      return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`;
    })
    .join(', ');

  const queryGql = gql`
    query {
      fungibleChainAccounts(${query}) {
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
