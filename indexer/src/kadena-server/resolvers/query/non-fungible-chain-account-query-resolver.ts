import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { buildNonFungibleChainAccount } from '../output/build-non-fungible-chain-account-output';

export const nonFungibleChainAccountQueryResolver: QueryResolvers<ResolverContext>['nonFungibleChainAccount'] =
  async (_parent, args, context) => {
    const account = await context.balanceRepository.getNonFungibleChainAccountInfo(
      args.accountName,
      args.chainId,
    );

    if (!account) return null;

    const nftsInfo = await context.pactGateway.getNftsInfo(
      account.accountName,
      account.nonFungibleTokenBalances,
    );

    const output = buildNonFungibleChainAccount(account, nftsInfo);
    return output;
  };
