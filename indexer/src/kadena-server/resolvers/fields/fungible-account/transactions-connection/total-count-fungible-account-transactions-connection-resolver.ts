/**
 * Resolver for the totalCount field of the FungibleAccountTransactionsConnection type.
 * This module counts transactions associated with a specific fungible token account.
 */
import { ResolverContext } from '../../../../config/apollo-server-config';
import { FungibleAccountTransactionsConnectionResolvers } from '../../../../config/graphql-types';
import zod from 'zod';

/**
 * Zod schema for validating the fungible account input parameters.
 * Requires non-nullable strings for accountName and fungibleName fields.
 */
const schema = zod.object({
  accountName: zod.string(),
  fungibleName: zod.string(),
});

/**
 * Resolver function for the totalCount field of the FungibleAccountTransactionsConnection type.
 * Retrieves the total count of transactions associated with the specified account and fungible token.
 *
 * @param parent - The parent object containing accountName and fungibleName parameters
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and services
 * @returns The total count of transactions for the specified account and fungible token
 */
export const totalCountFungibleAccountTransactionsConnectionResolver: FungibleAccountTransactionsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    const { accountName, fungibleName } = schema.parse(parent);

    const output = await context.transactionRepository.getTransactionsCount({
      accountName,
      fungibleName,
    });
    return output;
  };
