import { getRequiredEnvString } from '../../../utils/helpers';
import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { determineInputType } from '../../domain/gas/input-checker.gas';
import { parseInput } from '../../domain/gas/parser.gas';
import { buildTransactionPayload } from '../../domain/gas/transaction.gas';

const NETWORK_ID = getRequiredEnvString('SYNC_NETWORK');

export const gasLimitEstimateQueryResolver: QueryResolvers<ResolverContext>['gasLimitEstimate'] =
  async (_parent, args, context) => {
    console.log('gasLimitEstimateQueryResolver');

    const res = await Promise.all(
      args.input.map(input => {
        const parsedInput = parseInput(input);
        const userInput = determineInputType(parsedInput);
        const networkId = userInput.networkId ? userInput.networkId : NETWORK_ID;
        const transaction = buildTransactionPayload(userInput, networkId);
        return context.gasGateway.estimateGas(userInput, transaction, networkId);
      }),
    );

    return res;
  };
