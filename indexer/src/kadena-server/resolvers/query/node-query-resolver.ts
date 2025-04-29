/**
 * GraphQL resolver for the 'node' query implementing Relay Global Object Identification
 *
 * This file implements the resolver for the 'node' query in the GraphQL schema,
 * which allows clients to retrieve any object in the system given its global ID.
 * This follows the Relay Global Object Identification specification, enabling
 * clients to uniquely identify and fetch objects across the entire API.
 */

import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { getNode } from '../node-utils';

/**
 * Resolver function for the 'node' query
 *
 * This resolver handles requests for fetching any entity in the system by its global ID.
 * It delegates to the getNode utility function, which decodes the base64 global ID,
 * determines the entity type, and retrieves the corresponding object from the
 * appropriate repository.
 *
 * The resolver is a fundamental part of implementing the Relay Global Object
 * Identification specification, which enables clients to:
 * - Cache entities efficiently across different parts of the application
 * - Directly access any entity without additional query knowledge
 * - Refetch objects when needed with minimal data requirements
 *
 * @param _args - Parent resolver object (unused in this root resolver)
 * @param parent - GraphQL query arguments containing the ID to look up
 * @param context - Resolver context containing repository implementations
 * @returns Promise resolving to the requested node or null if not found
 */
export const nodeQueryResolver: QueryResolvers<ResolverContext>['node'] = async (
  _args,
  parent,
  context,
) => {
  return getNode(context, parent.id);
};
