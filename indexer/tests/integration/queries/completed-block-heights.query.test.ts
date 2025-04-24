import { GraphQLClient } from 'graphql-request';
import { getCompletedBlockHeightsQuery } from '../builders/completed-block-heights.builder';
const client = new GraphQLClient(process.env.API_URL ?? 'http://localhost:3001/graphql');

describe('Completed block heights', () => {
  it('#001', async () => {
    const query = getCompletedBlockHeightsQuery();
    const data = await client.request(query);

    // Check the basic structure
    expect(data).toHaveProperty('completedBlockHeights');
    expect(data.completedBlockHeights).toHaveProperty('edges');
    expect(Array.isArray(data.completedBlockHeights.edges)).toBe(true);

    // Check that we have at least one block
    expect(data.completedBlockHeights.edges.length).toBeGreaterThan(0);

    // Check the structure of the first block
    const firstBlock = data.completedBlockHeights.edges[0].node;
    expect(firstBlock).toHaveProperty('chainId');
    expect(firstBlock).toHaveProperty('height');
    expect(firstBlock).toHaveProperty('hash');
    expect(firstBlock).toHaveProperty('creationTime');
    expect(firstBlock).toHaveProperty('events');
    expect(firstBlock).toHaveProperty('transactions');

    // Check that the block height is a number
    expect(typeof firstBlock.height).toBe('number');
    expect(firstBlock.height).toBeGreaterThan(0);

    // Check that chainId is a number
    expect(typeof firstBlock.chainId).toBe('number');
    expect(firstBlock.chainId).toBeGreaterThan(-1);

    // Check that events and transactions have the expected structure
    expect(firstBlock.events).toHaveProperty('totalCount');
    expect(firstBlock.events).toHaveProperty('pageInfo');
    expect(firstBlock.transactions).toHaveProperty('totalCount');
    expect(firstBlock.transactions).toHaveProperty('pageInfo');
  });
});
