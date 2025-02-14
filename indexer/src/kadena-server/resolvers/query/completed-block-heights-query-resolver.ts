import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { buildBlockOutput } from '../output/build-block-output';

export const completedBlockHeightsQueryResolver: QueryResolvers<ResolverContext>['completedBlockHeights'] =
  async (_parent, args, context) => {
    console.log('completedBlockHeightsQueryResolver');
    const { completedHeights, heightCount, chainIds, first, after, before, last } = args;
    const output = await context.blockRepository.getCompletedBlocks({
      completedHeights,
      heightCount,
      chainIds,
      first,
      after,
      before,
      last,
    });

    const edges = output.edges.map(e => ({
      cursor: e.cursor,
      node: buildBlockOutput(e.node),
    }));

    return { edges, pageInfo: output.pageInfo };
  };
