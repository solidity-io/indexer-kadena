/**
 * Resolver for the events field of the TransactionResult type.
 * This module retrieves events associated with a transaction in a paginated connection format.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { TransactionResultResolvers } from '../../../config/graphql-types';
import { buildEventOutput } from '../../output/build-event-output';
import zod from 'zod';

/**
 * Zod schema for validating the transaction input parameter.
 * Requires a non-nullable string for the databaseTransactionId field.
 */
const schema = zod.object({ databaseTransactionId: zod.string() });

/**
 * Resolver function for the events field of the TransactionResult type.
 * Retrieves a paginated connection of events associated with the specified transaction.
 *
 * @param parent - The parent object containing the databaseTransactionId parameter
 * @param args - GraphQL pagination arguments (first, after, before, last)
 * @param context - The resolver context containing repositories and services
 * @returns A connection object with edges containing event nodes, pagination info, and metadata for resolvers
 */
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
      totalCount: -1, // Placeholder value; actual count is resolved by a separate resolver
    };
  };
