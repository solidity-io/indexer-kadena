import { gql } from 'graphql-request';

export const getGraphConfigurationQuery = (): string => {
  const queryGql = gql`
    query {
      graphConfiguration {
        minimumBlockHeight
        version
      }
    }
  `;

  return queryGql;
};
