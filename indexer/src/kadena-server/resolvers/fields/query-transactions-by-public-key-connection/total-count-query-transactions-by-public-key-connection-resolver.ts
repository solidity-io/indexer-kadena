/**
 * Resolver for the totalCount field of the QueryTransactionsByPublicKeyConnection type.
 * This module counts transactions associated with a specific public key.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { QueryTransactionsByPublicKeyConnectionResolvers } from '../../../config/graphql-types';
import zod from 'zod';

/**
 * Zod schema for validating the public key parameter.
 * Requires a non-nullable string for the publicKey field.
 */
const schema = zod.object({
  publicKey: zod.string(),
});

/**
 * Resolver function for the totalCount field of the QueryTransactionsByPublicKeyConnection type.
 * Retrieves the total count of transactions associated with a specific public key.
 *
 * @param parent - The parent object containing the publicKey parameter
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and services
 * @returns The total count of transactions for the specified public key
 */
export const totalCountQueryTransactionsByPublicKeyConnectionResolver: QueryTransactionsByPublicKeyConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    const { publicKey } = schema.parse(parent);

    const output = await context.transactionRepository.getTransactionsByPublicKeyCount(publicKey);
    return output;
  };
