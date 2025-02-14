import { ResolverContext } from '../../../config/apollo-server-config';
import { EventResolvers } from '../../../config/graphql-types';

import zod from 'zod';
import { buildBlockOutput } from '../../output/build-block-output';

const schema = zod.object({ eventId: zod.string() });

export const blockEventResolver: EventResolvers<ResolverContext>['block'] = async (
  parent,
  _args,
  context,
) => {
  console.log('blockEventResolver');

  const { eventId } = schema.parse(parent);

  const output = await context.getBlocksByEventIdsLoader.load(eventId);

  return buildBlockOutput(output);
};
