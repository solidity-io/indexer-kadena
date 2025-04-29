/**
 * Resolver for the totalCount field of the FungibleChainAccountTransactionsConnection type.
 * This module counts transactions associated with a chain-specific fungible token account.
 */
import { ResolverContext } from '../../../../config/apollo-server-config';
import { FungibleChainAccountTransactionsConnectionResolvers } from '../../../../config/graphql-types';
import zod from 'zod';

/**
 * Zod schema for validating the fungible chain account input parameters.
 * Requires non-nullable strings for accountName, chainId, and fungibleName fields.
 */
const schema = zod.object({
  accountName: zod.string(),
  chainId: zod.string(),
  fungibleName: zod.string(),
});

/**
 * Resolver function for the totalCount field of the FungibleChainAccountTransactionsConnection type.
 * Retrieves the total count of transactions associated with the specified account, chain, and fungible token.
 *
 * @param parent - The parent object containing accountName, chainId, and fungibleName parameters
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and services
 * @returns The total count of transactions for the specified account, chain, and fungible token
 */
export const totalCountFungibleChainAccountTransactionsConnectionResolver: FungibleChainAccountTransactionsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    const { accountName, chainId, fungibleName } = schema.parse(parent);

    const output = await context.transactionRepository.getTransactionsCount({
      accountName,
      chainId,
      fungibleName,
    });
    return output;
  };
