import { ResolverContext } from '../../../config/apollo-server-config';
import { FungibleAccountResolvers } from '../../../config/graphql-types';
import { buildTransferOutput } from '../../output/build-transfer-output';

export const transfersFungibleAccountResolver: FungibleAccountResolvers<ResolverContext>['transfers'] =
  async (parent, args, context) => {
    console.log('transfersFungibleAccountResolver');

    const { first, after, before, last } = args;
    const output = await context.transferRepository.getTransfers({
      accountName: parent.accountName,
      fungibleName: parent.fungibleName,
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
      accountName: parent.accountName,
      fungibleName: parent.fungibleName,
      totalCount: -1,
    };
  };
