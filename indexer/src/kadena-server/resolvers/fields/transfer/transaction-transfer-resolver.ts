/**
 * Resolver for the transaction field of the Transfer type.
 * This module retrieves the transaction associated with a specific transfer.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { TransferResolvers } from '../../../config/graphql-types';
import zod from 'zod';
import { buildTransactionOutput } from '../../output/build-transaction-output';

/**
 * Zod schema for validating the transfer input parameter.
 * Requires a non-nullable string for the transferId field.
 */
const schema = zod.object({ transferId: zod.string() });

/**
 * Resolver function for the transaction field of the Transfer type.
 * Retrieves the transaction that contains the specified transfer.
 *
 * @param parent - The parent object containing the transferId parameter
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and services
 * @returns The transaction data associated with the transfer, formatted using buildTransactionOutput
 */
export const transactionTransferResolver: TransferResolvers<ResolverContext>['transaction'] =
  async (parent, _args, context) => {
    const { transferId } = schema.parse(parent);

    const transaction = await context.transactionRepository.getTransactionByTransferId(transferId);

    return buildTransactionOutput(transaction);
  };
