import { GraphQLClient } from 'graphql-request';
import { getNodesQuery } from './builders/nodes.builder';
import { nodesFixture001 } from './fixtures/nodes/nodes.fixture.001';
const client = new GraphQLClient(process.env.API_URL ?? 'http://localhost:3001/graphql');

describe('Nodes', () => {
  it('#001 - Block and Transfer', async () => {
    const query = getNodesQuery({
      ids: [
        'QmxvY2s6T0txV3psalZXZll6SkdVaEtIMlBBUUo1M2VIMjRNdUd0TC13Sl82bGxWbw==',
        'VHJhbnNmZXI6WyJzNUp3ckxJeUVkQ00tdUJRTFN6RGxJeG9RSld4RkV3UDVOcHN4ekdESEVzIiwiMCIsIjQiLCJCNURsTnQ4T2E1VG53UUhneEszQlowbFdGM0pvdW94WmhWOWN5ZHNmQlRBIiwiT1ZzRFJzQkN0MzZkME1fWjA1ZG5fQ2UxcGVDUUYwY3JnOTloYkI5X1FYVSJd',
      ],
    });

    const data = await client.request(query);
    expect(nodesFixture001.data).toMatchObject(data);
  });
});
