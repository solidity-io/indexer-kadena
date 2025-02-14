import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';

export const networkInfoQueryResolver: QueryResolvers<ResolverContext>['networkInfo'] = async (
  _args,
  _parent,
  context,
) => {
  console.log('networkInfoQueryResolver');
  const output = await context.networkRepository.getAllInfo();
  return output;
};
