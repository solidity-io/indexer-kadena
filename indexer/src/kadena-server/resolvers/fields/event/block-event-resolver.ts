/**
 * Resolver for the block field of the Event type.
 * This module retrieves the block associated with a specific event.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { EventResolvers } from '../../../config/graphql-types';

import zod from 'zod';
import { buildBlockOutput } from '../../output/build-block-output';

/**
 * Zod schema for validating the event input parameter.
 * Requires a non-nullable string for the eventId field.
 */
const schema = zod.object({ eventId: zod.string() });

/**
 * Resolver function for the block field of the Event type.
 * Retrieves the block that contains the specified event.
 *
 * @param parent - The parent object containing the eventId parameter
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and data loaders
 * @returns The block data associated with the event, formatted using buildBlockOutput
 */
export const blockEventResolver: EventResolvers<ResolverContext>['block'] = async (
  parent,
  _args,
  context,
) => {
  // Extract and validate the eventId from the parent event object
  const { eventId } = schema.parse(parent);

  // Use the specialized DataLoader to efficiently fetch the block containing this event
  // This is especially important for queries that request multiple events and their blocks:
  // 1. All event->block lookups in a single request are batched together
  // 2. If multiple events are from the same block, that block is only fetched once
  // 3. The batching reduces database round-trips, significantly improving performance
  const output = await context.getBlocksByEventIdsLoader.load(eventId);

  // Transform the database block model into the GraphQL response format
  // Even if we have multiple events from the same block, each needs its own
  // transformed object because GraphQL resolvers operate on individual fields
  return buildBlockOutput(output);
};
