import { gql } from 'graphql-request';

export const getBlocksFromDepthQuery = (params: any): string => {
  if (Object.keys(params).length === 0) {
    throw new Error('No parameters provided to getBlocksFromDepthQuery.');
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
      blocksFromDepth(${query}) {
        edges {
          cursor
          node {
            chainId
            creationTime
            difficulty
            hash
            epoch
            events {
              totalCount
              pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
              }
              edges {
                cursor
                node {
                  chainId
                  height
                  id
                  moduleName
                  name
                  orderIndex
                  parameters
                  parameterText
                  qualifiedName
                  requestKey
                }
              }
            }
            flags
            hash
            height
            id
            minerAccount {
              accountName
              balance
              chainId
              fungibleName
              guard {
                ... on KeysetGuard {
                  keys
                  predicate
                  raw
                }
              }
              id
            }
            neighbors {
              chainId
              hash
            }
            nonce
            parent {
              chainId
            }
            payloadHash
            powHash
            target
            transactions {
              totalCount
              pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
              }
              edges {
                cursor
                node {
                  id
                }
              }
            }
            weight
          }   
        }
      }
    }
  `;

  return queryGql;
};
