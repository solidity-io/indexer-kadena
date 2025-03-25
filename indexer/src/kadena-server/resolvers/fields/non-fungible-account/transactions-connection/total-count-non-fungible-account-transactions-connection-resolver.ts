import { ResolverContext } from '../../../../config/apollo-server-config';
import { NonFungibleAccountTransactionsConnectionResolvers } from '../../../../config/graphql-types';
import zod from 'zod';

const schema = zod.object({
  accountName: zod.string(),
});

export const totalCountNonFungibleAccountTransactionsConnectionResolver: NonFungibleAccountTransactionsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    const { accountName } = schema.parse(parent);

    const output = await context.transactionRepository.getTransactionsCount({
      accountName,
      hasTokenId: true,
    });
    return output;
  };
