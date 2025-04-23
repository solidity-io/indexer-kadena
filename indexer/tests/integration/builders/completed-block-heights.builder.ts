import { gql } from 'graphql-request';

export const getCompletedBlockHeightsQuery = (): string => {
  const queryGql = gql`
    query {
      completedBlockHeights {
        edges {
          cursor
          node {
            chainId
            creationTime
            difficulty
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
