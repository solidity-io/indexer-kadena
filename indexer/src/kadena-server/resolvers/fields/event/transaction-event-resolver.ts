/**
 * Resolver for the transaction field of the Event type.
 * This module retrieves the transaction associated with a specific event.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { EventResolvers } from '../../../config/graphql-types';
import zod from 'zod';
import { buildTransactionOutput } from '../../output/build-transaction-output';

/**
 * Zod schema for validating the event input parameter.
 * Requires a non-nullable string for the eventId field.
 */
const schema = zod.object({ eventId: zod.string() });

/**
 * Resolver function for the transaction field of the Event type.
 * Retrieves the transaction that contains the specified event.
 *
 * @param parent - The parent object containing the eventId parameter
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and data loaders
 * @returns The transaction data associated with the event, formatted using buildTransactionOutput
 */
export const transactionEventResolver: EventResolvers<ResolverContext>['transaction'] = async (
  parent,
  _args,
  context,
) => {
  const { eventId } = schema.parse(parent);

  const output = await context.getTransactionsByEventIdsLoader.load(eventId);

  return buildTransactionOutput(output);
};
