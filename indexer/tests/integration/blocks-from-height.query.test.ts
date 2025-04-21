import { GraphQLClient } from 'graphql-request';
import { getBlocksFromHeightQuery } from './builders/blocks-from-height.builder';
import { blocksFromHeightFixture001 } from './fixtures/blocks-from-height/blocks-from-height.fixture.001';
import { blocksFromHeightFixture002 } from './fixtures/blocks-from-height/blocks-from-height.fixture.002';
import { blocksFromHeightFixture003 } from './fixtures/blocks-from-height/blocks-from-height.fixture.003';
import { blocksFromHeightFixture004 } from './fixtures/blocks-from-height/blocks-from-height.fixture.004';
const client = new GraphQLClient(process.env.API_URL ?? 'http://localhost:3001/graphql');

describe('Blocks from height', () => {
  it('#001', async () => {
    const query = getBlocksFromHeightQuery({ startHeight: 3000000, endHeight: 5000000 });
    const data = await client.request(query);
    expect(blocksFromHeightFixture001.data).toMatchObject(data);
  });

  it('#002', async () => {
    const query = getBlocksFromHeightQuery({
      startHeight: 3000000,
      endHeight: 5000000,
      chainIds: ['8'],
    });
    const data = await client.request(query);
    expect(blocksFromHeightFixture002.data).toMatchObject(data);
  });

  //
  it('#003', async () => {
    const query = getBlocksFromHeightQuery({
      startHeight: 2000000,
      endHeight: 4000000,
      after: 'OTE1OTgwMzE=',
    });
    const data = await client.request(query);
    expect(blocksFromHeightFixture003.data).toMatchObject(data);
  });

  it('#004', async () => {
    const query = getBlocksFromHeightQuery({
      startHeight: 2000000,
      endHeight: 4000000,
      last: 5,
    });
    const data = await client.request(query);
    expect(blocksFromHeightFixture004.data).toMatchObject(data);
  });

  it.skip('#005', async () => {
    const query = getBlocksFromHeightQuery({
      startHeight: 2000000,
      endHeight: 4000000,
      chainIds: ['8'],
      after: 'OTE1OTgwMzE=',
    });
    const data = await client.request(query);
    expect(null).toMatchObject(data);
  });
});
