/**
 * Resolver for the totalCount field of the BlockEventsConnection type.
 * This module counts events associated with a specific block.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { BlockEventsConnectionResolvers } from '../../../config/graphql-types';
import zod from 'zod';

/**
 * Zod schema for validating the block hash parameter.
 * Requires a non-nullable string for the blockHash field.
 */
const schema = zod.object({ blockHash: zod.string() });

/**
 * Resolver function for the totalCount field of the BlockEventsConnection type.
 * Retrieves the total count of events associated with the specified block.
 *
 * @param parent - The parent object containing the blockHash parameter
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and services
 * @returns The total count of events for the specified block
 */
export const totalCountBlockEventsConnectionResolver: BlockEventsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    const { blockHash } = schema.parse(parent);

    const total = await context.eventRepository.getTotalCountOfBlockEvents(blockHash);

    return total;
  };
