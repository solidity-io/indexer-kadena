/**
 * @file query/graph-configuration-query-resolver.ts
 * @description GraphQL resolver for the 'graphConfiguration' query
 *
 * This file implements the resolver for the 'graphConfiguration' query in the GraphQL schema,
 * which allows clients to retrieve configuration and capability information about the GraphQL API,
 * such as the minimum indexed block height and API version.
 */

import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';

/**
 * Resolver function for the 'graphConfiguration' query
 *
 * This resolver handles requests for API configuration information.
 * It combines dynamic data from the block repository (like the minimum indexed block height)
 * with static configuration values (like the API version) to provide clients with
 * information about the capabilities and limitations of the API.
 *
 * This information is particularly useful for clients that need to know
 * how far back in the blockchain they can query data.
 *
 * @param _args - Parent object (unused in this root resolver)
 * @param _parent - GraphQL query arguments (unused in this resolver)
 * @param context - Resolver context containing repository implementations
 * @returns Promise resolving to a GraphConfiguration object with API configuration details
 */
export const graphConfigurationQueryResolver: QueryResolvers<ResolverContext>['graphConfiguration'] =
  async (_args, _parent, context) => {
    const minimumBlockHeight = await context.blockRepository.getLowestBlockHeight();

    return {
      minimumBlockHeight,
      version: '0.1.0',
    };
  };
