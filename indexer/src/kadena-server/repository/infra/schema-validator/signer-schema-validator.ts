/**
 * Validation and transformation utilities for transaction signer data
 *
 * This file provides schema validation and data transformation functions for
 * transaction signers in the Kadena blockchain indexer. Signers represent the parties
 * that have authorized a transaction with their cryptographic signatures, along with
 * any capability lists (clist) that define their permissions.
 *
 * The validator uses Zod for runtime type checking and handles the conversion
 * of raw database rows to the standardized SignerOutput type that's used
 * throughout the application. It also generates globally unique identifiers
 * that conform to the Relay specification for GraphQL objects.
 */

import zod from 'zod';
import { SignerOutput } from '../../application/transaction-repository';

/**
 * Zod schema for validating signer data
 *
 * Defines the expected structure and types for signer records retrieved
 * from the database or API responses. The schema includes the public key,
 * optional address, capability list, and position within the transaction.
 */
const schema = zod.object({
  requestKey: zod.string(),
  publicKey: zod.string(),
  address: zod.string().nullable(),
  signerOrderIndex: zod.number(),
  clist: zod.array(zod.object({ args: zod.array(zod.any()), name: zod.string() })).nullable(),
});

/**
 * Generates a globally unique ID for a transaction signer
 *
 * Creates a Base64-encoded string that represents a transaction signer,
 * combining the transaction request key and the signer's order index.
 * This follows the Relay Global Object Identification specification.
 *
 * @param requestKey - The unique request key of the transaction
 * @param orderIndex - The position of the signer in the transaction's signer list
 * @returns A Base64 encoded global ID string
 */
export const getBase64SignerID = (requestKey: string, orderIndex: number): string => {
  const inputString = `Signer:[\"${requestKey}\",\"${orderIndex}\"]`;
  const base64ID = Buffer.from(inputString, 'utf-8').toString('base64');
  return base64ID;
};

/**
 * Validates and transforms raw signer data into the standardized output format
 *
 * This function performs several important tasks:
 * 1. Validates the input data against the schema
 * 2. Generates a globally unique ID for the signer
 * 3. Handles nullable capability lists with default empty arrays
 * 4. Stringifies capability list arguments for consistent representation
 *
 * @param row - The raw data row typically from a database query result
 * @returns A validated and transformed SignerOutput object
 * @throws Will throw an error if validation fails
 */
function validate(row: any): SignerOutput {
  const res = schema.parse(row);
  return {
    id: getBase64SignerID(res.requestKey, res.signerOrderIndex),
    pubkey: res.publicKey,
    address: res.address,
    orderIndex: res.signerOrderIndex,
    scheme: '', // Signature scheme is not provided in the input data
    clist: (res.clist ?? []).map(c => ({
      args: JSON.stringify(c.args),
      name: c.name,
    })),
  };
}

/**
 * Exported validator object providing validation and transformation functionality
 * This pattern allows for easy mocking in tests and consistent usage across the codebase
 */
export const signerMetaValidator = { validate };
