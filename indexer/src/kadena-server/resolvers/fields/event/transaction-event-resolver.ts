import { ResolverContext } from '../../../config/apollo-server-config';
import { EventResolvers } from '../../../config/graphql-types';
import zod from 'zod';
import { buildTransactionOutput } from '../../output/build-transaction-output';

const schema = zod.object({ eventId: zod.string() });

export const transactionEventResolver: EventResolvers<ResolverContext>['transaction'] = async (
  parent,
  _args,
  context,
) => {
  console.log('transactionEventResolver');

  const { eventId } = schema.parse(parent);

  const output = await context.getTransactionsByEventIdsLoader.load(eventId);

  return buildTransactionOutput(output);
};
