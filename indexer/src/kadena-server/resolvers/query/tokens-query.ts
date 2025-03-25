import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';

export const tokensQueryResolver: QueryResolvers<ResolverContext>['tokens'] = async (
  _parent,
  args,
  context,
) => {
  console.log('tokensQueryResolver');
  const { after, before, first, last } = args;
  const output = await context.balanceRepository.getTokens({ after, before, first, last });
  return output;
};
