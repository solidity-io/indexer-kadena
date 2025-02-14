import { ResolverContext } from '../../../config/apollo-server-config';
import { TransferResolvers } from '../../../config/graphql-types';
import zod from 'zod';
import { buildTransactionOutput } from '../../output/build-transaction-output';

const schema = zod.object({ transferId: zod.string() });

export const transactionTransferResolver: TransferResolvers<ResolverContext>['transaction'] =
  async (parent, _args, context) => {
    console.log('transactionTransferResolver');

    const { transferId } = schema.parse(parent);

    const transaction = await context.transactionRepository.getTransactionByTransferId(transferId);

    return buildTransactionOutput(transaction);
  };
