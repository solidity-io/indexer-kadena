/**
 * Resolver for the block field of the TransactionResult type.
 * This module retrieves the block data associated with a transaction.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { TransactionResultResolvers } from '../../../config/graphql-types';
import zod from 'zod';
import { buildBlockOutput } from '../../output/build-block-output';

/**
 * Zod schema for validating the transaction input parameter.
 * Requires a non-nullable string for the databaseTransactionId field.
 */
const schema = zod.object({ databaseTransactionId: zod.string() });

/**
 * Resolver function for the block field of the TransactionResult type.
 * Retrieves the block that contains the specified transaction.
 *
 * @param parent - The parent object containing the databaseTransactionId parameter
 * @param _args - GraphQL arguments (unused in this resolver)
 * @param context - The resolver context containing repositories and data loaders
 * @returns The block data associated with the transaction, formatted using buildBlockOutput
 */
export const blockTransactionResultResolver: TransactionResultResolvers<ResolverContext>['block'] =
  async (parent, _args, context) => {
    const parentArgs = schema.parse(parent);

    const output = await context.getBlocksByTransactionIdsLoader.load(
      parentArgs.databaseTransactionId,
    );
    return buildBlockOutput(output);
  };
