import { ResolverContext } from '../../../../config/apollo-server-config';
import { FungibleChainAccountTransfersConnectionResolvers } from '../../../../config/graphql-types';
import zod from 'zod';

const schema = zod.object({
  accountName: zod.string(),
  chainId: zod.string(),
  fungibleName: zod.string(),
});

export const totalCountFungibleChainAccountTransfersConnectionResolver: FungibleChainAccountTransfersConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    console.log('totalCountFungibleChainAccountTransfersConnection');

    const { accountName, chainId, fungibleName } = schema.parse(parent);

    const output = await context.transferRepository.getTotalCountOfTransfers({
      accountName,
      chainId,
      fungibleName,
    });
    return output;
  };
