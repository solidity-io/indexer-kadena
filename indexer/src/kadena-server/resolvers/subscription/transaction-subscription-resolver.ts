import { ResolverContext } from '../../config/apollo-server-config';
import { SubscriptionResolvers } from '../../config/graphql-types';
import { TransactionOutput } from '../../repository/application/transaction-repository';
import { buildTransactionOutput } from '../output/build-transaction-output';

async function* iteratorFn(
  requestKey: string,
  context: ResolverContext,
  chainId?: string | null,
): AsyncGenerator<TransactionOutput | undefined, void, unknown> {
  while (context.signal) {
    const { edges } = await context.transactionRepository.getTransactions({
      requestKey,
      chainId,
    });
    const transactions = edges.map(e => e.node);

    if (transactions.length > 0) {
      const [first, ...rest] =
        await context.blockRepository.getTransactionsOrderedByBlockDepth(transactions);

      const result = {
        ...buildTransactionOutput(first),
        orphanedTransactions: rest.map(r => buildTransactionOutput(r)),
      };

      yield result;
      return;
    }
  }
}

export const transactionSubscriptionResolver: SubscriptionResolvers<ResolverContext>['transaction'] =
  {
    subscribe: (_root, args, context) => {
      return iteratorFn(args.requestKey, context, args.chainId);
    },
    resolve: (payload: any) => payload,
  };
