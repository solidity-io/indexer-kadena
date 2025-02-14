import { ResolverContext } from '../../../../config/apollo-server-config';
import { TransactionResultEventsConnectionResolvers } from '../../../../config/graphql-types';
import zod from 'zod';

const schema = zod.object({
  databaseTransactionId: zod.string(),
});

export const totalCountTransactionResultEventsConnectionResolver: TransactionResultEventsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    console.log('totalCountTransactionResultEventsConnectionResolver');

    const { databaseTransactionId } = schema.parse(parent);

    const output = await context.eventRepository.getTotalTransactionEventsCount({
      transactionId: databaseTransactionId,
    });
    return output;
  };
