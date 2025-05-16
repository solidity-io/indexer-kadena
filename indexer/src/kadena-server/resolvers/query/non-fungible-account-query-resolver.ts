import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { buildNonFungibleAccount } from '../output/build-non-fungible-account-output';

export const nonFungibleAccountQueryResolver: QueryResolvers<ResolverContext>['nonFungibleAccount'] =
  async (_parent, args, context) => {
    const accountInfo = await context.balanceRepository.getNonFungibleAccountInfo(args.accountName);

    if (!accountInfo) return null;

    const nftsInfo = await context.pactGateway.getNftsInfo(
      accountInfo.accountName,
      accountInfo.nonFungibleTokenBalances,
    );

    const output = buildNonFungibleAccount(accountInfo, nftsInfo);
    return output;
  };
