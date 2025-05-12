import { GraphQLClient } from 'graphql-request';
import { getGraphConfigurationQuery } from '../builders/graph-configuration.builder';
import { graphConfigurationFixture001 } from '../fixtures/graph-configuration/graph-configuration.fixture.001';

const client = new GraphQLClient(process.env.API_URL ?? 'http://localhost:3001/graphql');

describe('Graph Configuration', () => {
  it('#001', async () => {
    const query = getGraphConfigurationQuery();
    const data = await client.request(query);

    expect(graphConfigurationFixture001.data).toMatchObject(data);
  });
});
