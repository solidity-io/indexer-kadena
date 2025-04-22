/**
 * Resolver for the parent field of the Block type.
 * This module retrieves the parent block of a given block in the blockchain.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { Block, BlockResolvers } from '../../../config/graphql-types';
import zod from 'zod';
import { buildBlockOutput } from '../../output/build-block-output';

/**
 * Zod schema for validating the block input parameter.
 * Requires a non-nullable string for the parentHash field.
 */
const schema = zod.object({ parentHash: zod.string() });

/**
 * Resolver function for the parent field of the Block type.
 * Retrieves the parent block associated with the current block via its parentHash.
 *
 * @param parent - The parent object containing the parentHash parameter
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and data loaders
 * @returns The parent block data if found, null otherwise
 */
export const parentBlockResolver: BlockResolvers<ResolverContext>['parent'] = async (
  parent,
  _args,
  context,
): Promise<Block | null> => {
  // Extract and validate the parentHash from the parent block object
  const { parentHash } = schema.parse(parent);

  // Use the DataLoader to efficiently fetch the parent block by its hash
  // This is a key optimization point:
  // 1. If multiple blocks in the same query need the same parent, it's only fetched once
  // 2. If this parent block was already loaded in this request, it's returned from cache
  // 3. If multiple blocks need different parents, the requests are batched into one DB query
  const output = await context.getBlocksByHashesLoader.load(parentHash);

  // If no parent block was found with this hash, return null
  if (!output) {
    return null;
  }

  // Transform the database model into the GraphQL response format
  return buildBlockOutput(output);
};
