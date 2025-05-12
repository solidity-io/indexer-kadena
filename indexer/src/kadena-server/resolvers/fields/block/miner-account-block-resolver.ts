/**
 * Resolver for the minerAccount field of the Block type.
 * This module retrieves information about the account that mined a specific block.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { BlockResolvers } from '../../../config/graphql-types';
import { buildFungibleChainAccount } from '../../output/build-fungible-chain-account-output';

/**
 * Resolver function for the minerAccount field of the Block type.
 * Retrieves the miner account data for the specified block.
 *
 * @param parent - The parent object containing the block hash and chainId
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and services
 * @returns The miner account data formatted as a FungibleChainAccount
 */
export const minerAccountBlockResolver: BlockResolvers<ResolverContext>['minerAccount'] = async (
  parent,
  _args,
  context,
) => {
  const output = await context.blockRepository.getMinerData(parent.hash, parent.chainId);

  return buildFungibleChainAccount(output);
};
