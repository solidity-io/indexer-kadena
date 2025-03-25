import { ResolverContext } from '../../../config/apollo-server-config';
import { TransferResolvers } from '../../../config/graphql-types';
import { buildBlockOutput } from '../../output/build-block-output';
import zod from 'zod';

const schema = zod.object({
  blockHash: zod.string(),
});

export const blockTransferResolver: TransferResolvers<ResolverContext>['block'] = async (
  parent,
  _args,
  context,
) => {
  const { blockHash } = schema.parse(parent);
  const output = await context.blockRepository.getBlockByHash(blockHash);

  return buildBlockOutput(output);
};
