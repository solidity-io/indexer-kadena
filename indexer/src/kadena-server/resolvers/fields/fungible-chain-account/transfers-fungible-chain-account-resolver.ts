import { ResolverContext } from '../../../config/apollo-server-config';
import { FungibleChainAccountResolvers } from '../../../config/graphql-types';
import { buildTransferOutput } from '../../output/build-transfer-output';

export const transfersFungibleChainAccountResolver: FungibleChainAccountResolvers<ResolverContext>['transfers'] =
  async (parent, args, context) => {
    console.log('transfersFungibleAccountResolver');

    const { first, after, last, before } = args;
    const output = await context.transferRepository.getTransfers({
      accountName: parent.accountName,
      fungibleName: parent.fungibleName,
      chainId: parent.chainId,
      after,
      first,
      last,
      before,
    });

    const edges = output.edges.map(e => ({
      cursor: e.cursor,
      node: buildTransferOutput(e.node),
    }));

    return {
      edges,
      pageInfo: output.pageInfo,
      // for resolvers
      totalCount: -1,
      accountName: parent.accountName,
      chainId: parent.chainId,
      fungibleName: parent.fungibleName,
    };
  };
