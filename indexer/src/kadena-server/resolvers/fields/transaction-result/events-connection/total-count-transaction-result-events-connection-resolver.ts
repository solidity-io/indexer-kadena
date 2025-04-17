/**
 * Resolver for the totalCount field of the TransactionResultEventsConnection type.
 * This module counts events associated with a specific transaction.
 */
import { ResolverContext } from '../../../../config/apollo-server-config';
import { TransactionResultEventsConnectionResolvers } from '../../../../config/graphql-types';
import zod from 'zod';

/**
 * Zod schema for validating the transaction input parameter.
 * Requires a non-nullable string for the databaseTransactionId field.
 */
const schema = zod.object({
  databaseTransactionId: zod.string(),
});

/**
 * Resolver function for the totalCount field of the TransactionResultEventsConnection type.
 * Retrieves the total count of events associated with the specified transaction.
 *
 * @param parent - The parent object containing the databaseTransactionId parameter
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and services
 * @returns The total count of events for the specified transaction
 */
export const totalCountTransactionResultEventsConnectionResolver: TransactionResultEventsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    const { databaseTransactionId } = schema.parse(parent);

    const output = await context.eventRepository.getTotalTransactionEventsCount({
      transactionId: databaseTransactionId,
    });
    return output;
  };
