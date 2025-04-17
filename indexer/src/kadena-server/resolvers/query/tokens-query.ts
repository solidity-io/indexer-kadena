/**
 * @file query/tokens-query.ts
 * @description GraphQL resolver for the 'tokens' query
 *
 * This file implements the resolver for the 'tokens' query in the GraphQL schema,
 * which allows clients to retrieve a paginated list of all tokens (both fungible and
 * non-fungible) that exist in the blockchain and are tracked by the indexer.
 */

import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';

/**
 * Resolver function for the 'tokens' query
 *
 * This resolver handles requests for token data with pagination support.
 * It delegates to the balance repository to fetch token data from the database,
 * returning a connection of token information.
 *
 * The resolver implements the GraphQL Connection specification for pagination,
 * returning edges with cursors and pageInfo for navigation.
 *
 * @param _parent - Parent resolver object (unused in this root resolver)
 * @param args - GraphQL query arguments containing pagination parameters
 * @param context - Resolver context containing repository implementations
 * @returns Promise resolving to a tokens connection with pagination info
 */
export const tokensQueryResolver: QueryResolvers<ResolverContext>['tokens'] = async (
  _parent,
  args,
  context,
) => {
  console.log('tokensQueryResolver');
  const { after, before, first, last } = args;
  const output = await context.balanceRepository.getTokens({ after, before, first, last });
  return output;
};
