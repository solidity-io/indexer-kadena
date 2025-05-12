/**
 * Resolver for the chainAccounts field of the FungibleAccount type.
 * This module retrieves information about the same account across different chains
 * in the Kadena multi-chain environment.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { FungibleAccountResolvers } from '../../../config/graphql-types';
import { buildFungibleChainAccount } from '../../output/build-fungible-chain-account-output';

/**
 * Resolver function for the chainAccounts field of the FungibleAccount type.
 * Retrieves chain-specific information for a fungible token account across all chains.
 * Note: Uses NODE suffix indicating it fetches real-time data directly from blockchain nodes.
 *
 * @param parent - The parent object containing accountName and fungibleName
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and services
 * @returns An array of chain-specific account information objects
 */
export const chainAccountsFungibleAccountResolver: FungibleAccountResolvers<ResolverContext>['chainAccounts'] =
  async (parent, _args, context) => {
    const accounts = await context.balanceRepository.getChainsAccountInfo_NODE(
      parent.accountName,
      parent.fungibleName,
    );

    return accounts.map(acc => buildFungibleChainAccount(acc));
  };
