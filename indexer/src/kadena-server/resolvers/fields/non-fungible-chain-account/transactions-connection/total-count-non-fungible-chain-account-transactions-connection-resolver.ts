import { ResolverContext } from '../../../../config/apollo-server-config';
import { NonFungibleChainAccountTransactionsConnectionResolvers } from '../../../../config/graphql-types';
import zod from 'zod';

const schema = zod.object({
  accountName: zod.string(),
  chainId: zod.string(),
});

export const totalCountNonFungibleChainAccountTransactionsConnectionResolver: NonFungibleChainAccountTransactionsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    console.log('totalCountNonFungibleChainAccountTransactionsConnectionResolver');

    const { accountName, chainId } = schema.parse(parent);

    const output = await context.transactionRepository.getTransactionsCount({
      accountName,
      chainId,
      hasTokenId: true,
    });
    return output;
  };
