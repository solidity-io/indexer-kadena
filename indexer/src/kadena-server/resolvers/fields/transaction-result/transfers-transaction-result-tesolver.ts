import { ResolverContext } from '../../../config/apollo-server-config';
import { TransactionResultResolvers } from '../../../config/graphql-types';
import { buildTransferOutput } from '../../output/build-transfer-output';
import zod from 'zod';

const schema = zod.object({ databaseTransactionId: zod.string() });

export const transfersTransactionResultResolver: TransactionResultResolvers<ResolverContext>['transfers'] =
  async (parent, args, context) => {
    console.log('transfersTransactionResultResolver');

    const parentArgs = schema.parse(parent);

    const { first, after, before, last } = args;

    const output = await context.transferRepository.getTransfersByTransactionId({
      transactionId: parentArgs.databaseTransactionId,
      first,
      after,
      before,
      last,
    });
    const edges = output.edges.map(e => ({
      cursor: e.cursor,
      node: buildTransferOutput(e.node),
    }));

    return {
      edges,
      pageInfo: output.pageInfo,

      // for resolvers
      databaseTransactionId: parentArgs.databaseTransactionId,
      totalCount: -1,
    };
  };
