/**
 * Interface for interactions with the Pact smart contract language on Kadena blockchain
 *
 * This file defines the interface for accessing Pact smart contract functionality on the
 * Kadena blockchain. The PactGateway interface provides methods for retrieving NFT information
 * and potentially other Pact contract interactions. It serves as an abstraction layer between
 * the application and the blockchain, allowing for different implementations (e.g., mock for testing).
 */

import { INonFungibleTokenBalance } from '@/kadena-server/repository/application/balance-repository';

/**
 * Represents NFT token information retrieved from the blockchain
 *
 * This interface models the structure of NFT data as it's stored in the Marmalade v2
 * token standard on Kadena. It includes metadata like:
 * - Version information
 * - Supply and precision details
 * - URI pointing to the token's metadata
 * - Balance information for the specified account
 * - Guard (security predicate) details controlling token transfers
 */
export interface NftInfo {
  version: string;
  supply: number;
  precision: number;
  uri: string;
  balance: number;
  guard: {
    keys: string[];
    predicate: string;
    raw: string;
  };
}

/**
 * Interface defining operations for interacting with Pact smart contracts
 *
 * This gateway interface provides methods to interact with Pact smart contracts
 * on the Kadena blockchain, focusing particularly on NFT-related operations.
 */
export default interface PactGateway {
  /**
   * Retrieves detailed information about multiple NFTs
   *
   * This method fetches information about multiple NFTs in a batch operation.
   * It queries the Marmalade v2 NFT standard contracts to retrieve token info,
   * version data, and balance information for the specified account.
   *
   * @param data - Array of NFT identifiers to query
   * @param account - Account address to check balances for
   * @returns Promise resolving to an array of NFT information objects
   */
  getNftsInfo(
    accountName: string,
    nonFungibleTokenBalances: INonFungibleTokenBalance[],
  ): Promise<NftInfo[]>;
}
