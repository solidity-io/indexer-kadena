import { gql } from 'graphql-request';
import { blockFragment, transactionFragment } from './node.builder';

export const getNodesQuery = (params: { ids: string[] }): string => {
  if (Object.keys(params).length === 0) {
    throw new Error('No parameters provided to getNodesQuery.');
  }

  const queryGql = gql`
    query {
      nodes(ids: [${params.ids.map(id => `"${id}"`).join(', ')}]) {
        ${blockFragment}
        ${transactionFragment}
      }
    }
  `;

  return queryGql;
};
