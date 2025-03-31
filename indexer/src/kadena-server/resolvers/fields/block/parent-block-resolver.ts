import { ResolverContext } from '../../../config/apollo-server-config';
import { Block, BlockResolvers } from '../../../config/graphql-types';
import zod from 'zod';
import { buildBlockOutput } from '../../output/build-block-output';

const schema = zod.object({ parentHash: zod.string() });

export const parentBlockResolver: BlockResolvers<ResolverContext>['parent'] = async (
  parent,
  _args,
  context,
): Promise<Block | null> => {
  const { parentHash } = schema.parse(parent);

  const output = await context.getBlocksByHashesLoader.load(parentHash);

  if (!output) {
    return null;
  }

  return buildBlockOutput(output);
};
