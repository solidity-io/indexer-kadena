import { NonFungibleChainAccountTransactionsConnection } from '../../config/graphql-types';
import { INonFungibleChainAccount } from '../../repository/application/balance-repository';
import { NftInfo } from '../../repository/gateway/pact-gateway';

export const buildNonFungibleChainAccount = (
  acc: INonFungibleChainAccount | null,
  nftsInfo: NftInfo[],
) => {
  if (!acc) return null;

  const nonFungibleTokenBalances = (nftsInfo ?? []).map((nft, index) => ({
    id: acc.nonFungibleTokenBalances[index].id,
    accountName: acc.accountName,
    chainId: acc.nonFungibleTokenBalances[index].chainId,
    balance: acc.nonFungibleTokenBalances[index].balance,
    tokenId: acc.nonFungibleTokenBalances[index].tokenId,
    version: nft.version,
    // TODO
    guard: {
      keys: [],
      predicate: '',
      raw: JSON.stringify('{}'),
    },
    info: {
      precision: nft.precision,
      supply: nft.supply,
      uri: nft.uri,
    },
  }));

  return {
    ...acc,
    nonFungibleTokenBalances,
    // for resolvers
    transactions: {} as NonFungibleChainAccountTransactionsConnection,
  };
};
