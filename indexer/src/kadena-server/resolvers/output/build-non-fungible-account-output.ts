import {
  NonFungibleAccount,
  NonFungibleAccountTransactionsConnection,
} from "../../config/graphql-types";
import { INonFungibleAccount } from "../../repository/application/balance-repository";
import { NftInfo } from "../../repository/gateway/pact-gateway";

export const buildNonFungibleAccount = (
  acc: INonFungibleAccount | null,
  nftsInfo: NftInfo[],
): NonFungibleAccount | null => {
  if (!acc) return null;

  const nonFungibleTokenBalances = (nftsInfo ?? []).map((nft, index) => ({
    id: acc.nonFungibleTokenBalances[index].id,
    accountName: acc.accountName,
    chainId: acc.nonFungibleTokenBalances[index].chainId,
    balance: acc.nonFungibleTokenBalances[index].balance,
    tokenId: acc.nonFungibleTokenBalances[index].tokenId,
    version: nft.version,
    info: {
      precision: nft.precision,
      supply: nft.supply,
      uri: nft.uri,
    },
  }));

  return {
    id: acc.id,
    accountName: acc.accountName,
    nonFungibleTokenBalances,
    // for resolvers
    transactions: {} as NonFungibleAccountTransactionsConnection,
  };
};
