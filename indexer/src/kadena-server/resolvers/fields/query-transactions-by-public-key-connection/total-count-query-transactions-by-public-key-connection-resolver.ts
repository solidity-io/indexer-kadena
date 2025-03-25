import { ResolverContext } from '../../../config/apollo-server-config';
import { QueryTransactionsByPublicKeyConnectionResolvers } from '../../../config/graphql-types';
import zod from 'zod';

const schema = zod.object({
  publicKey: zod.string(),
});

export const totalCountQueryTransactionsByPublicKeyConnectionResolver: QueryTransactionsByPublicKeyConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    const { publicKey } = schema.parse(parent);

    const output = await context.transactionRepository.getTransactionsByPublicKeyCount(publicKey);
    return output;
  };
