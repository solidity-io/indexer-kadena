/**
 * @file repository/gateway/gas-gateway.ts
 * @description Interface for gas estimation operations on the Kadena blockchain
 *
 * This file defines the interface for estimating gas costs for transactions on the
 * Kadena blockchain. Gas estimation is a critical operation that allows users to
 * determine the computational resources (and associated costs) required for executing
 * a transaction before it's submitted to the network.
 */

import { IUnsignedCommand } from '@kadena/types';
import { GasLimitEstimation } from '../../config/graphql-types';
import { UserInput } from '../../domain/gas/types.gas';

/**
 * Output type for gas estimation operations
 * Aliases to the GraphQL GasLimitEstimation type to maintain consistency
 * between internal operations and API responses
 */
export type EstimeGasOutput = GasLimitEstimation;

/**
 * Interface defining operations for gas estimation on the Kadena blockchain
 *
 * This gateway interface provides a method to estimate the gas required for
 * a transaction before it's submitted to the network. This is essential for:
 * - Determining transaction costs before execution
 * - Ensuring transactions have sufficient gas to complete
 * - Preventing transaction failures due to out-of-gas errors
 */
export default interface GasGateway {
  /**
   * Estimates the gas required for a transaction
   *
   * This method simulates the execution of a transaction to determine how much
   * computational resources (gas) it will consume. It supports configuration options
   * for preflight checks and signature verification.
   *
   * @param params - User input parameters controlling estimation behavior
   * @param transaction - The unsigned transaction command to estimate gas for
   * @param networkId - The Kadena network ID (e.g., "mainnet01", "testnet04")
   * @returns Promise resolving to a gas estimation result with amount and configuration details
   */
  estimateGas(
    params: UserInput,
    transaction: IUnsignedCommand,
    networkId: string,
  ): Promise<EstimeGasOutput>;
}
