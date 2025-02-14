import { ResolverContext } from '../../../config/apollo-server-config';
import { BlockTransactionsConnectionResolvers } from '../../../config/graphql-types';
import zod from 'zod';

const schema = zod.object({
  blockHash: zod.string(),
});

export const totalCountBlockTransactionsConnectionResolver: BlockTransactionsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    console.log('totalCountBlockTransactionsConnectionResolver');

    const { blockHash } = schema.parse(parent);

    const total = await context.blockRepository.getTotalCountOfBlockEvents(blockHash);

    return total;
  };
