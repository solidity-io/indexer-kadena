import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';

export const graphConfigurationQueryResolver: QueryResolvers<ResolverContext>['graphConfiguration'] =
  async (_args, _parent, context) => {
    console.log('graphConfigurationQueryResolver');

    const minimumBlockHeight = await context.blockRepository.getLowestBlockHeight();

    return {
      minimumBlockHeight,
      version: '0.1.0',
    };
  };
