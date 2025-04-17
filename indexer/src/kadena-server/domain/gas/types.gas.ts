/**
 * @file types.gas.ts
 * @description Type definitions for the gas estimation system
 *
 * This file defines the type interfaces used by the gas estimation system. Gas is the
 * execution fee mechanism in the Kadena blockchain, similar to Ethereum's gas concept.
 * The types defined here enable the system to handle various input formats for
 * estimating the gas cost of transactions before they're submitted to the blockchain.
 *
 * The system supports multiple input formats to provide flexibility for different
 * client use cases, from complete transactions to simple Pact code snippets.
 */

import { ChainId } from '@kadena/types';

/**
 * Base interface for all gas estimation input types
 *
 * @property preflight - Whether to execute the transaction in preflight mode
 * @property signatureVerification - Whether to verify signatures during estimation
 */
export interface IBaseInput {
  preflight: boolean;
  signatureVerification: boolean;
}

/**
 * Complete transaction input format
 *
 * Used when the client already has a fully formed transaction with
 * command, hash, and signatures.
 */
export type FullTransactionInput = IBaseInput & {
  type: 'full-transaction';
  cmd: string;
  hash: string;
  sigs: string[];
  networkId?: string;
};

/**
 * JSON-stringified command input format
 *
 * Used when the client has a command string but may not have generated
 * a hash or signatures yet.
 */
export type StringifiedCommandInput = IBaseInput & {
  type: 'stringified-command';
  cmd: string;
  sigs?: string[];
  networkId?: string;
};

/**
 * Complete Pact command object input format
 *
 * Used when the client has constructed all the individual parts of
 * a Pact command (payload, meta, signers) but hasn't assembled them.
 */
export type FullCommandInput = IBaseInput & {
  type: 'full-command';
  payload: any;
  meta: any;
  signers: any[];
  networkId?: string;
};

/**
 * Partial Pact command object input format
 *
 * Similar to FullCommandInput but allows for missing optional fields
 * that will be filled with defaults during processing.
 */
export type PartialCommandInput = IBaseInput & {
  type: 'partial-command';
  payload: any;
  meta?: any;
  signers?: any[];
  chainId?: ChainId;
  networkId?: string;
};

/**
 * Pact payload-only input format
 *
 * Used when the client only has the payload portion of a Pact command
 * and needs the system to construct the rest of the command.
 */
export type PayloadInput = IBaseInput & {
  type: 'payload';
  payload: any;
  chainId: ChainId;
  networkId?: string;
};

/**
 * Raw Pact code input format
 *
 * The simplest format, used when the client only has Pact code
 * and needs the system to construct a complete transaction.
 */
export type CodeInput = IBaseInput & {
  type: 'code';
  code: string;
  chainId: ChainId;
  networkId?: string;
};

/**
 * Union type of all possible input formats
 *
 * This allows functions to accept any of the defined input types
 * and handle them appropriately based on the 'type' field.
 */
export type UserInput =
  | FullTransactionInput
  | StringifiedCommandInput
  | FullCommandInput
  | PartialCommandInput
  | PayloadInput
  | CodeInput;
