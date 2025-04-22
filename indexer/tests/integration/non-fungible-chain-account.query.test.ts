import { GraphQLClient } from 'graphql-request';
import { nonFungibleChainAccountFixture001 } from './fixtures/non-fungible-chain-account/non-fungible-chain-account.fixture.001';
import { getNonFungibleChainAccountQuery } from './builders/non-fungible-chain-account.builder';

const client = new GraphQLClient(process.env.API_URL ?? 'http://localhost:3001/graphql');

describe('Non Fungible Chain Account', () => {
  it('#001', async () => {
    const query = getNonFungibleChainAccountQuery({
      accountName: 'k:48f3c8ee3f14943e20adbb302cd7e74030ae4ed1cfcbb6313b8ac5367c1a3df4',
      chainId: '8',
    });

    const data = await client.request(query);

    expect(nonFungibleChainAccountFixture001.data).toMatchObject(data);
  });
});
