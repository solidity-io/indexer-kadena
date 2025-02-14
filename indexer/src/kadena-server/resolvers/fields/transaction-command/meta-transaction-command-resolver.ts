import { ResolverContext } from '../../../config/apollo-server-config';
import { TransactionCommandResolvers } from '../../../config/graphql-types';
import zod from 'zod';

const schema = zod.object({ databaseTransactionId: zod.string() });

export const metaTransactionCommandResolver: TransactionCommandResolvers<ResolverContext>['meta'] =
  async (parent, _args, context) => {
    console.log('metaTransactionCommandResolver');

    const parentArgs = schema.parse(parent);

    const transactionMeta = await context.transactionRepository.getTransactionMetaInfoById(
      parentArgs.databaseTransactionId,
    );
    return transactionMeta;
  };
