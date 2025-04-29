import { GraphQLClient } from 'graphql-request';
import { getBlocksFromDepthQuery } from '../builders/blocks-from-depth.builder';
import { blocksFromDepthFixture001 } from '../fixtures/blocks-from-depth/blocks-from-depth.fixture.001';
import { blocksFromDepthFixture002 } from '../fixtures/blocks-from-depth/blocks-from-depth.fixture.002';
const client = new GraphQLClient(process.env.API_URL ?? 'http://localhost:3001/graphql');

describe('Blocks from depth', () => {
  it.skip('#001', async () => {
    const query = getBlocksFromDepthQuery({ minimumDepth: 10, after: 'OTE1OTgwMzY=' });
    const data = await client.request(query);
    expect(blocksFromDepthFixture001.data).toMatchObject(data);
  });

  it.skip('#002', async () => {
    const query = getBlocksFromDepthQuery({
      minimumDepth: 10,
      chainIds: ['8', '9'],
      after: 'OTE1OTgwMzY=',
    });
    const data = await client.request(query);
    expect(blocksFromDepthFixture002.data).toMatchObject(data);
  });
});
