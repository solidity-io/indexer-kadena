/**
 * GraphQL resolver for the 'networkInfo' query
 *
 * This file implements the resolver for the 'networkInfo' query in the GraphQL schema,
 * which allows clients to retrieve general information about the Kadena blockchain network,
 * such as API version, coins in circulation, total transaction count, and network hash rate.
 */

import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';

/**
 * Resolver function for the 'networkInfo' query
 *
 * This resolver handles requests for network-wide statistical information.
 * It delegates to the network repository to fetch aggregated blockchain data
 * from the database, providing a high-level view of the network's current state.
 *
 * Unlike most other resolvers, this one takes no arguments as it returns
 * global network information rather than entity-specific data.
 *
 * @param _args - Parent object (unused in this root resolver)
 * @param _parent - GraphQL query arguments (unused in this resolver)
 * @param context - Resolver context containing repository implementations
 * @returns Promise resolving to a NetworkInfo object with blockchain statistics
 */
export const networkInfoQueryResolver: QueryResolvers<ResolverContext>['networkInfo'] = async (
  _args,
  _parent,
  context,
) => {
  const output = await context.networkRepository.getAllInfo();
  return output;
};
