/**
 * Resolver for the events field of the Block type.
 * This module retrieves blockchain events associated with a specific block in a paginated connection format.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { BlockResolvers } from '../../../config/graphql-types';
import { buildEventOutput } from '../../output/build-event-output';

/**
 * Resolver function for the events field of the Block type.
 * Retrieves a paginated connection of events associated with the specified block.
 *
 * @param parent - The parent object containing the block hash
 * @param args - GraphQL pagination arguments (first, after, before, last)
 * @param context - The resolver context containing repositories and services
 * @returns A connection object with edges containing event nodes, pagination info, and metadata for resolvers
 */
export const eventsBlockResolver: BlockResolvers<ResolverContext>['events'] = async (
  parent,
  args,
  context,
) => {
  const { hash } = parent;
  const { first, after, before, last } = args;

  const output = await context.eventRepository.getBlockEvents({
    hash,
    first,
    after,
    before,
    last,
  });

  const edges = output.edges.map(e => ({
    cursor: e.cursor,
    node: buildEventOutput(e.node),
  }));

  return {
    edges,
    pageInfo: output.pageInfo,
    // for resolvers
    blockHash: hash,
    totalCount: -1, // Placeholder value; actual count is resolved by a separate resolver
  };
};
