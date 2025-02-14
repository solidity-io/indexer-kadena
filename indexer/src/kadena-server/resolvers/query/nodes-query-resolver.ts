import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { getNode } from '../node-utils';

export const nodesQueryResolver: QueryResolvers<ResolverContext>['nodes'] = async (
  _args,
  parent,
  context,
) => {
  const nodes = await Promise.all(parent.ids.map(id => getNode(context, id)));
  return nodes;
};
