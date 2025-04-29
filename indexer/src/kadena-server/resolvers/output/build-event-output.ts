/**
 * Builder function for transforming database event entities into GraphQL-compatible format
 *
 * This file is responsible for preparing event data from the database to be returned through
 * the GraphQL API. It transforms an EventOutput from the repository into a format that matches
 * the Event type in the GraphQL schema, including placeholders for fields that will be resolved
 * by field resolvers.
 */

import { Block } from '../../config/graphql-types';
import { EventOutput } from '../../repository/application/event-repository';

/**
 * Transforms a database event entity into a GraphQL-compatible format
 *
 * This function takes an EventOutput from the database repository and converts it into
 * a structure that matches the Event type in the GraphQL schema. It preserves all the
 * scalar properties from the original event entity and adds a placeholder object for
 * the block field that will be resolved by a separate field resolver.
 *
 * The placeholder object (block) allows the GraphQL resolver system to identify which
 * fields need to be resolved, while avoiding unnecessary database queries for fields
 * that aren't requested in the client query.
 *
 * @param event - The event entity from the database repository
 * @returns A GraphQL-compatible event object with a placeholder for the block relation
 */
export const buildEventOutput = (event: EventOutput) => {
  return {
    ...event,
    // for resolvers
    block: {} as Block,
  };
};
