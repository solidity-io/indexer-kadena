/**
 * @file event-schema-validator.ts
 * @description Validation and transformation utilities for blockchain event data
 *
 * This file provides schema validation and data transformation functions for
 * blockchain events in the Kadena indexer. Events represent actions or state changes
 * that occur during transaction execution on the blockchain, such as token transfers,
 * account creations, or contract interactions.
 *
 * The validator uses Zod for runtime type checking and handles the conversion
 * of raw database rows to the standardized EventOutput type that's used
 * throughout the application. It also generates globally unique identifiers
 * that conform to the Relay specification for GraphQL objects.
 */

import { EventOutput } from '../../application/event-repository';
import zod from 'zod';

/**
 * Zod schema for validating event data
 *
 * Defines the expected structure and types for event records retrieved
 * from the database or API responses. The schema includes all essential event
 * properties such as name, module, chain ID, and parameters.
 */
const schema = zod.object({
  id: zod.number(),
  name: zod.string(),
  blockHash: zod.string(),
  requestKey: zod.string(),
  chainId: zod.number(),
  orderIndex: zod.number().nullable(),
  moduleName: zod.string(),
  height: zod.number(),
  parameters: zod.array(zod.any()),
});

/**
 * Generates a globally unique ID for an event
 *
 * Creates a Base64-encoded string that represents a blockchain event,
 * containing the block hash, event order index, and transaction request key
 * as identifiers. This follows the Relay Global Object Identification specification.
 *
 * @param hash - The hash of the block containing the event
 * @param orderIndex - The position of the event in its transaction
 * @param requestKey - The transaction request key that emitted this event
 * @returns A Base64 encoded global ID string
 */
const getBase64ID = (hash: string, orderIndex: number, requestKey: string): string => {
  const inputString = `Event:[\"${hash}\",\"${orderIndex}\",\"${requestKey}\"]`;
  const base64ID = Buffer.from(inputString, 'utf-8').toString('base64');
  return base64ID;
};

/**
 * Validates and transforms raw event data into the standardized output format
 *
 * This function performs several important tasks:
 * 1. Validates the input data against the schema
 * 2. Generates a globally unique ID for the event
 * 3. Handles nullable order index with a default value of 0
 * 4. Creates a qualified name by combining module name and event name
 * 5. Stringifies parameter arrays for consistent representation
 *
 * @param row - The raw data row typically from a database query result
 * @returns A validated and transformed EventOutput object
 * @throws Will throw an error if validation fails
 */
function validate(row: any): EventOutput {
  const res = schema.parse(row);
  return {
    id: getBase64ID(res.blockHash, res.orderIndex ?? 0, res.requestKey),
    eventId: res.id.toString(),
    orderIndex: res.orderIndex ?? 0,
    name: res.name,
    requestKey: res.requestKey,
    chainId: res.chainId,
    moduleName: res.moduleName,
    height: res.height,
    qualifiedName: `${res.moduleName}.${res.name}`,
    parameters: JSON.stringify(res.parameters),
    parameterText: JSON.stringify(res.parameters),
  };
}

/**
 * Exported validator object providing validation and transformation functionality
 * This pattern allows for easy mocking in tests and consistent usage across the codebase
 */
export const eventValidator = { validate };
