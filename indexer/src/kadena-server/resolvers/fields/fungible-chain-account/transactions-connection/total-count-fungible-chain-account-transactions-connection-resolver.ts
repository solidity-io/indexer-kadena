import { ResolverContext } from '../../../../config/apollo-server-config';
import { FungibleChainAccountTransactionsConnectionResolvers } from '../../../../config/graphql-types';
import zod from 'zod';

const schema = zod.object({
  accountName: zod.string(),
  chainId: zod.string(),
  fungibleName: zod.string(),
});

export const totalCountFungibleChainAccountTransactionsConnectionResolver: FungibleChainAccountTransactionsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    const { accountName, chainId, fungibleName } = schema.parse(parent);

    const output = await context.transactionRepository.getTransactionsCount({
      accountName,
      chainId,
      fungibleName,
    });
    return output;
  };
