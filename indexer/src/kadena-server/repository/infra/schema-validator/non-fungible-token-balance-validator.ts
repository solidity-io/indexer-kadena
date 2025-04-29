/**
 * Validation and transformation utilities for non-fungible token (NFT) balance data
 *
 * This file provides schema validation and data transformation functions for
 * non-fungible token balances in the Kadena blockchain indexer. NFT balances represent
 * ownership of unique tokens by accounts on specific chains in the network.
 *
 * The validator uses Zod for runtime type checking and handles the conversion
 * of raw database rows to the standardized INonFungibleTokenBalance type that's used
 * throughout the application. It also generates globally unique identifiers
 * that conform to the Relay specification for GraphQL objects.
 */

import zod from 'zod';
import { INonFungibleTokenBalance } from '../../application/balance-repository';

/**
 * Zod schema for validating non-fungible token balance data
 *
 * Defines the expected structure and types for NFT balance records retrieved
 * from the database or API responses. The schema includes essential properties
 * such as account name, chain ID, token ID, and balance amount.
 */
const nonFungibleTokenBalanceSchema = zod.object({
  id: zod.number(),
  account: zod.string(),
  chainId: zod.number(),
  tokenId: zod.string(),
  balance: zod.string(),
  module: zod.string(),
});

/**
 * Generates a globally unique ID for a non-fungible token balance
 *
 * Creates a Base64-encoded string that represents an NFT balance,
 * combining the token ID, account name, and chain ID to uniquely identify it.
 * This follows the Relay Global Object Identification specification.
 *
 * @param tokenId - The unique identifier of the NFT
 * @param accountName - The account that owns the token
 * @param chainId - The chain ID where the balance is recorded
 * @returns A Base64 encoded global ID string
 */
const getBase64ID = (tokenId: string, accountName: string, chainId: number): string => {
  const inputString = `NonFungibleTokenBalance:[\"${tokenId}\",\"${accountName}\",\"${chainId}\"]`;
  const base64ID = Buffer.from(inputString, 'utf-8').toString('base64');
  return base64ID;
};

/**
 * Validates and transforms raw NFT balance data into the standardized output format
 *
 * This function performs several important tasks:
 * 1. Validates the input data against the schema
 * 2. Generates a globally unique ID for the NFT balance
 * 3. Converts string balance values to numbers
 * 4. Transforms database column formats to application-friendly formats
 *
 * @param row - The raw data row typically from a database query result
 * @returns A validated and transformed INonFungibleTokenBalance object
 * @throws Will throw an error if validation fails
 */
const validate = (row: any): INonFungibleTokenBalance => {
  const res = nonFungibleTokenBalanceSchema.parse(row);
  return {
    id: getBase64ID(res.tokenId, res.account, res.chainId),
    accountName: res.account,
    balance: Number(res.balance),
    chainId: res.chainId.toString(),
    module: res.module,
    tokenId: res.tokenId,
  };
};

/**
 * Exported validator object providing validation and transformation functionality
 * This pattern allows for easy mocking in tests and consistent usage across the codebase
 */
export const nonFungibleTokenBalanceValidator = {
  validate,
};
