/**
 * Custom error class for handling Pact command execution failures
 *
 * This file defines a specialized error class for dealing with errors that occur
 * during the execution of Pact commands against the Kadena blockchain. It provides
 * structured error handling with validation of the error format.
 */

import zod from 'zod';

/**
 * Schema for validating Pact error responses from the blockchain
 *
 * This ensures that error objects we receive follow a consistent structure
 * with message and type fields.
 */
const errorSchema = zod.object({
  message: zod.string(),
  type: zod.string(),
});

/**
 * Type definition for a validated Pact error from the blockchain
 */
type PactError = zod.infer<typeof errorSchema>;

/**
 * Custom error class for Pact command failures
 *
 * This class extends the standard Error class to provide better handling of
 * Pact-specific errors. It includes:
 * - A custom message explaining what went wrong
 * - The original error from the Pact runtime (if available and valid)
 * - Type safety through Zod validation of the error structure
 *
 * This helps with both logging errors and providing detailed feedback to clients
 * about what went wrong during command execution.
 */
export class PactCommandError extends Error {
  /**
   * The validated error from the Pact runtime, if available
   */
  public pactError?: PactError;

  /**
   * Creates a new PactCommandError instance
   *
   * @param message - Human-readable error message explaining what went wrong
   * @param pactError - The original error from the Pact runtime (optional)
   */
  public constructor(message: string, pactError?: unknown) {
    super(message);

    // Attempt to validate the error object against our schema
    const res = errorSchema.safeParse(pactError);
    if (res.success) {
      // If validation succeeds, store the typed error
      this.pactError = res.data;
    }
  }
}
