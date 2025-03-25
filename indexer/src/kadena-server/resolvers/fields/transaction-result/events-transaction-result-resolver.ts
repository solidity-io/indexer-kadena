import { ResolverContext } from '../../../config/apollo-server-config';
import { TransactionResultResolvers } from '../../../config/graphql-types';
import { buildEventOutput } from '../../output/build-event-output';
import zod from 'zod';

const schema = zod.object({ databaseTransactionId: zod.string() });

export const eventsTransactionResultResolver: TransactionResultResolvers<ResolverContext>['events'] =
  async (parent, args, context) => {
    const parentArgs = schema.parse(parent);

    const { first, after, before, last } = args;

    const output = await context.eventRepository.getTransactionEvents({
      transactionId: parentArgs.databaseTransactionId,
      first,
      after,
      before,
      last,
    });
    const edges = output.edges.map(e => ({
      cursor: e.cursor,
      node: buildEventOutput(e.node),
    }));

    return {
      edges,
      pageInfo: output.pageInfo,

      // for resolvers
      databaseTransactionId: parentArgs.databaseTransactionId,
      totalCount: -1,
    };
  };
