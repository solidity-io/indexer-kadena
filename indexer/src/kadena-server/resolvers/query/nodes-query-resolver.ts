/**
 * GraphQL resolver for the 'nodes' query implementing batch retrieval of multiple nodes
 *
 * This file implements the resolver for the 'nodes' query in the GraphQL schema,
 * which allows clients to retrieve multiple objects in the system given their global IDs
 * in a single request. This is an extension of the Relay Global Object Identification
 * specification, providing a more efficient way to fetch multiple entities at once.
 */

import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { getNode } from '../node-utils';

/**
 * Resolver function for the 'nodes' query
 *
 * This resolver handles requests for fetching multiple entities in the system by their global IDs.
 * It iterates through the provided array of IDs and delegates each lookup to the getNode utility
 * function, which handles the decoding of each base64 global ID, determines the entity type,
 * and retrieves the corresponding object from the appropriate repository.
 *
 * Benefits of using this batch resolver:
 * - Reduces the number of GraphQL requests needed to fetch multiple entities
 * - Improves client performance by retrieving multiple entities in a single roundtrip
 * - Maintains consistency with the Relay specification pattern while offering more efficiency
 *
 * @param _args - Parent resolver object (unused in this root resolver)
 * @param parent - GraphQL query arguments containing the array of IDs to look up
 * @param context - Resolver context containing repository implementations
 * @returns Promise resolving to an array of requested nodes (null for any not found)
 */
export const nodesQueryResolver: QueryResolvers<ResolverContext>['nodes'] = async (
  _args,
  parent,
  context,
) => {
  const nodes = await Promise.all(parent.ids.map(id => getNode(context, id)));
  return nodes;
};
