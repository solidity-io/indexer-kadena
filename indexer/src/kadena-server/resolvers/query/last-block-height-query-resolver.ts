import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';

export const lastBlockHeightQueryResolver: QueryResolvers<ResolverContext>['lastBlockHeight'] =
  async (_args, _parent, context) => {
    console.log('lastBlockHeightQueryResolver');

    const lastBlockHeight = await context.blockRepository.getLastBlockHeight();

    return lastBlockHeight;
  };
