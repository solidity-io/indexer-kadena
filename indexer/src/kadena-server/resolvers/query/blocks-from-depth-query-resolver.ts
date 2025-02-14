import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { buildBlockOutput } from '../output/build-block-output';

export const blocksFromDepthQueryResolver: QueryResolvers<ResolverContext>['blocksFromDepth'] =
  async (_parent, args, context) => {
    console.log('blocksFromDepthQueryResolver', args);
    const { minimumDepth, after, before, chainIds, first, last } = args;
    const output = await context.blockRepository.getBlocksFromDepth({
      minimumDepth,
      after,
      before,
      first,
      last,
      chainIds,
    });

    const edges = output.edges.map(e => ({
      cursor: e.cursor,
      node: buildBlockOutput(e.node),
    }));

    return { edges, pageInfo: output.pageInfo };
  };
