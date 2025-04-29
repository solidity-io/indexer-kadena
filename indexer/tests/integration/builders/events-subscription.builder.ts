import { gql } from 'graphql-request';

export const getEventsSubscriptionQuery = (params: {
  qualifiedEventName: string;
  chainId?: string;
  minimumDepth?: number;
}): string => {
  const { qualifiedEventName, chainId, minimumDepth } = params;

  const queryGql = gql`
    subscription {
      events(
        qualifiedEventName: "${qualifiedEventName}"
        ${chainId ? `chainId: "${chainId}"` : ''}
        ${minimumDepth ? `minimumDepth: ${minimumDepth}` : ''}
      ) {
        id
        chainId
        height
        moduleName
        name
        orderIndex
        parameters
        qualifiedName
        requestKey
      }
    }
  `;

  return queryGql;
};
