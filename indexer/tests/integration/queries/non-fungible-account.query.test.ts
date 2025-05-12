import { GraphQLClient } from 'graphql-request';
import { nonFungibleAccountFixture001 } from '../fixtures/non-fungible-account/non-fungible-account.fixture.001';
import { getNonFungibleAccountQuery } from '../builders/non-fungible-account.builder';

const client = new GraphQLClient(process.env.API_URL ?? 'http://localhost:3001/graphql');

describe('Non Fungible Account', () => {
  it('#001', async () => {
    const query = getNonFungibleAccountQuery({
      accountName: 'k:48f3c8ee3f14943e20adbb302cd7e74030ae4ed1cfcbb6313b8ac5367c1a3df4',
    });

    const data = await client.request(query);

    expect(nonFungibleAccountFixture001.data).toMatchObject(data);
  });
});
