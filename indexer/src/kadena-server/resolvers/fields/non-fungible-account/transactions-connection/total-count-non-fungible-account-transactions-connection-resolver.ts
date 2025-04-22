/**
 * Resolver for the totalCount field of the NonFungibleAccountTransactionsConnection type.
 * This module counts transactions associated with non-fungible tokens (NFTs) owned by a specific account.
 */
import { ResolverContext } from '../../../../config/apollo-server-config';
import { NonFungibleAccountTransactionsConnectionResolvers } from '../../../../config/graphql-types';
import zod from 'zod';

/**
 * Zod schema for validating the non-fungible account input parameter.
 * Requires a non-nullable string for the accountName field.
 */
const schema = zod.object({
  accountName: zod.string(),
});

/**
 * Resolver function for the totalCount field of the NonFungibleAccountTransactionsConnection type.
 * Retrieves the total count of NFT-related transactions associated with the specified account.
 *
 * @param parent - The parent object containing the accountName parameter
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and services
 * @returns The total count of NFT transactions for the specified account
 */
export const totalCountNonFungibleAccountTransactionsConnectionResolver: NonFungibleAccountTransactionsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    const { accountName } = schema.parse(parent);

    const output = await context.transactionRepository.getTransactionsCount({
      accountName,
      hasTokenId: true, // Specifically counts transactions with token IDs
    });
    return output;
  };
