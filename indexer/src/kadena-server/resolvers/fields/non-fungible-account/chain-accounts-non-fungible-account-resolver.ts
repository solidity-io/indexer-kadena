/**
 * Resolver for the chainAccounts field of the NonFungibleAccount type.
 * This module retrieves chain-specific information about non-fungible tokens (NFTs)
 * owned by a specific account across different chains in the Kadena multi-chain environment.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import {
  NonFungibleAccountResolvers,
  NonFungibleChainAccount,
} from '../../../config/graphql-types';
import { buildNonFungibleChainAccount } from '../../output/build-non-fungible-chain-account-output';

/**
 * Resolver function for the chainAccounts field of the NonFungibleAccount type.
 * Retrieves chain-specific information for NFTs owned by an account across all chains,
 * including detailed token information fetched from the blockchain.
 *
 * @param parent - The parent object containing the accountName
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and services
 * @returns An array of chain-specific NFT account information objects
 */
export const chainAccountsNonFungibleAccountResolver: NonFungibleAccountResolvers<ResolverContext>['chainAccounts'] =
  async (parent, _args, context) => {
    // Get basic chain account information from database
    const accounts = await context.balanceRepository.getNonFungibleChainAccountsInfo(
      parent.accountName,
    );

    // For each chain account, fetch detailed NFT information from the blockchain
    const outputPromises = accounts.map(async account => {
      const params = account.nonFungibleTokenBalances.map(n => ({
        tokenId: n.tokenId,
        chainId: n.chainId,
        module: n.module,
      }));

      const nftsInfo = await context.pactGateway.getNftsInfo(
        params ?? [],
        parent.accountName ?? '',
      );
      return buildNonFungibleChainAccount(account, nftsInfo);
    });

    const results = await Promise.all(outputPromises);
    return results.filter((result): result is NonFungibleChainAccount => result !== null);
  };
