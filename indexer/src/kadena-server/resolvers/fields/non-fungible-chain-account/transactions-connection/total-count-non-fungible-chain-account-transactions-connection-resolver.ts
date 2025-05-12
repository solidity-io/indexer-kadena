/**
 * Resolver for the totalCount field of the NonFungibleChainAccountTransactionsConnection type.
 */
import { ResolverContext } from '../../../../config/apollo-server-config';
import { NonFungibleChainAccountTransactionsConnectionResolvers } from '../../../../config/graphql-types';
import zod from 'zod';

/**
 * Zod schema for validating input parameters.
 */
const schema = zod.object({
  accountName: zod.string(),
  chainId: zod.string(),
});

/**
 * Resolver function that counts NFT transactions for a specific account on a specific chain.
 *
 * @param parent - Parent object with accountName and chainId
 * @param _args - Unused GraphQL arguments
 * @param context - Resolver context with repositories
 * @returns Count of NFT transactions
 */
export const totalCountNonFungibleChainAccountTransactionsConnectionResolver: NonFungibleChainAccountTransactionsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    const { accountName, chainId } = schema.parse(parent);

    const output = await context.transactionRepository.getTransactionsCount({
      accountName,
      chainId,
      hasTokenId: true, // Filter for NFT transactions
    });
    return output;
  };
