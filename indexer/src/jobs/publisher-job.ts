/**
 * @file publisher-job.ts
 * @description Block event publishing system for the Kadena indexer
 *
 * This file implements the notification system that publishes blockchain events
 * to the GraphQL subscription system. When new blocks are indexed, this publisher
 * sends the data to the GraphQL server's /new-block endpoint, which then triggers
 * the appropriate subscription events for real-time client updates.
 *
 * The system includes:
 * - A validation schema for block event data
 * - A typed interface for block event information
 * - An asynchronous dispatch function with error handling
 */

import zod from 'zod';
import { getRequiredEnvString } from '../utils/helpers';

/**
 * GraphQL API URL and port from environment variables
 * Used to construct the target endpoint for block event notifications
 */
const KADENA_GRAPHQL_URL = getRequiredEnvString('KADENA_GRAPHQL_API_URL');
const KADENA_GRAPHQL_PORT = getRequiredEnvString('KADENA_GRAPHQL_API_PORT');

/**
 * Validation schema for block event dispatch information
 *
 * Defines the expected structure and data types for block events:
 * - hash: The block hash identifier
 * - chainId: The chain identifier (Kadena is a multi-chain system)
 * - height: The block height in the blockchain
 * - requestKeys: Transaction request keys contained in this block
 * - qualifiedEventNames: Event names triggered by transactions in this block
 */
export const dispatchInfoSchema = zod.object({
  hash: zod.string(),
  chainId: zod.string(),
  height: zod.number(),
  requestKeys: zod.array(zod.string()),
  qualifiedEventNames: zod.array(zod.string()),
});

/**
 * TypeScript interface for the dispatch information
 * Generated from the Zod schema to ensure type consistency
 */
export type DispatchInfo = zod.infer<typeof dispatchInfoSchema>;

/**
 * Sends block information to the GraphQL subscription system
 *
 * This function posts block data to the GraphQL server's /new-block endpoint,
 * which then triggers the appropriate subscription events. The function includes
 * comprehensive error handling and logging.
 *
 * @param dispatchInfo - Validated block event information to dispatch
 * @returns Promise resolving to true if successful, false if failed
 */
export const dispatch = async (dispatchInfo: DispatchInfo) => {
  try {
    const url = `${KADENA_GRAPHQL_URL}:${KADENA_GRAPHQL_PORT}/new-block`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dispatchInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`[ERROR][INT][INT_API] ${errorData.message} || ${response.statusText}`);
    }
    return true;
  } catch (err: unknown) {
    const errorData = err instanceof Error ? err.message : 'Unknown error';
    console.error('[ERROR][INT][INT_API] Dispatcher error:', errorData);
    return false;
  }
};
