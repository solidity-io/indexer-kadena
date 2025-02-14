import { ResolverContext } from '../../config/apollo-server-config';
import { Block, QueryResolvers } from '../../config/graphql-types';
import { buildBlockOutput } from '../output/build-block-output';

export const blockQueryResolver: QueryResolvers<ResolverContext>['block'] = async (
  _parent,
  args,
  context,
): Promise<Block | null> => {
  console.log('blockQueryResolver');
  const { hash } = args;
  const output = await context.blockRepository.getBlockByHash(hash);

  return buildBlockOutput(output);
};
