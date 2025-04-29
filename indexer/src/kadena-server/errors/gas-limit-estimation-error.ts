/**
 * Custom error class for handling gas limit estimation failures
 *
 * This file defines a specialized error class for dealing with errors that occur
 * during gas limit estimation for Pact transactions on the Kadena blockchain.
 * Gas limit estimation is an important step before submitting transactions, as it
 * determines the computational resources needed for execution.
 */

import zod from 'zod';

/**
 * Schema for validating gas estimation error responses from the blockchain
 *
 * This ensures that error objects we receive follow a consistent structure
 * with message and type fields.
 */
const errorSchema = zod.object({
  message: zod.string(),
  type: zod.string(),
});

/**
 * Type definition for a validated gas estimation error from the blockchain
 */
type GasError = zod.infer<typeof errorSchema>;

/**
 * Custom error class for gas limit estimation failures
 *
 * This class extends the standard Error class to provide better handling of
 * gas-related errors. It includes:
 * - A custom message explaining what went wrong with the gas estimation
 * - The original error from the blockchain (if available and valid)
 * - Type safety through Zod validation of the error structure
 *
 * Gas estimation failures can occur for various reasons, such as:
 * - The transaction would fail regardless of gas (logical errors)
 * - Insufficient gas for complex operations
 * - Issues with the blockchain node during estimation
 */
export class GasLimitEstimationError extends Error {
  /**
   * The validated error from the blockchain, if available
   */
  public originalError?: GasError;

  /**
   * Creates a new GasLimitEstimationError instance
   *
   * @param message - Human-readable error message explaining what went wrong
   * @param originalError - The original error from the blockchain (optional)
   */
  public constructor(message: string, originalError?: unknown) {
    super(message);

    // Attempt to validate the error object against our schema
    const res = errorSchema.safeParse(originalError);
    if (res.success) {
      // If validation succeeds, store the typed error
      this.originalError = res.data;
    }
  }
}
