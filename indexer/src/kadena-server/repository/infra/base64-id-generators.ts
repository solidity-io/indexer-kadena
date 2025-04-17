/**
 * @file base64-id-generators.ts
 * @description Utility functions for generating Base64 encoded global IDs
 *
 * This file provides functions for creating globally unique identifiers that
 * conform to the Relay Global Object Identification specification. These IDs
 * encode both the type of object and its unique identifiers in a Base64 string
 * that can be used across the GraphQL API.
 *
 * These functions follow the Relay specification by:
 * 1. Creating opaque, globally unique IDs
 * 2. Encoding both the type and database ID information
 * 3. Using Base64 encoding to make IDs safe for transport
 *
 * @see https://relay.dev/graphql/objectidentification.htm
 */

/**
 * Generates a globally unique ID for a non-fungible token account
 *
 * Creates a Base64-encoded string that represents a non-fungible token account,
 * containing both the type information and the account name. This follows the
 * Relay Global Object Identification specification for creating unique object IDs.
 *
 * @param accountName - The name of the account that owns non-fungible tokens
 * @returns A Base64 encoded global ID string
 */
export const getNonFungibleAccountBase64ID = (accountName: string): string => {
  const inputString = `NonFungibleAccount:${accountName}`;
  const base64ID = Buffer.from(inputString, 'utf-8').toString('base64');
  return base64ID;
};

/**
 * Generates a globally unique ID for a chain-specific non-fungible token account
 *
 * Creates a Base64-encoded string that represents a non-fungible token account on a
 * specific blockchain chain, containing both the type information and the identifiers.
 * This follows the Relay Global Object Identification specification.
 *
 * @param chainId - The ID of the blockchain chain
 * @param accountName - The name of the account that owns non-fungible tokens
 * @returns A Base64 encoded global ID string
 */
export const getNonFungibleChainAccountBase64ID = (
  chainId: string,
  accountName: string,
): string => {
  const inputString = `NonFungibleChainAccount:[\"${chainId}\",\"${accountName}\"]`;
  const base64ID = Buffer.from(inputString, 'utf-8').toString('base64');
  return base64ID;
};
