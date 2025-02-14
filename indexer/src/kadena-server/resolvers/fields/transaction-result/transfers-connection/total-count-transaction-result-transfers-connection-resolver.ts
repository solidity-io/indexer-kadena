import { ResolverContext } from '../../../../config/apollo-server-config';
import { TransactionResultTransfersConnectionResolvers } from '../../../../config/graphql-types';
import zod from 'zod';

const schema = zod.object({
  databaseTransactionId: zod.string(),
});

export const totalCountTransactionResultTransfersConnectionResolver: TransactionResultTransfersConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    console.log('totalCountTransactionResultTransfersConnectionResolver');

    const { databaseTransactionId } = schema.parse(parent);

    const output = await context.transferRepository.getTotalCountOfTransfers({
      transactionId: databaseTransactionId,
    });
    return output;
  };
