import { ResolverContext } from '../../../config/apollo-server-config';
import { QueryEventsConnectionResolvers } from '../../../config/graphql-types';
import zod from 'zod';

const schema = zod.object({
  blockHash: zod.string().nullable().optional(),
  chainId: zod.string().nullable().optional(),
  maxHeight: zod.number().nullable().optional(),
  minHeight: zod.number().nullable().optional(),
  minimumDepth: zod.number().nullable().optional(),
  requestKey: zod.string().nullable().optional(),
  qualifiedEventName: zod.string(),
});

export const totalCountQueryEventsConnectionResolver: QueryEventsConnectionResolvers<ResolverContext>['totalCount'] =
  async (parent, _args, context) => {
    const {
      blockHash,
      chainId,
      maxHeight,
      minHeight,
      minimumDepth,
      requestKey,
      qualifiedEventName,
    } = schema.parse(parent);

    const output = await context.eventRepository.getTotalEventsCount({
      blockHash,
      chainId,
      maxHeight,
      minHeight,
      minimumDepth,
      requestKey,
      qualifiedEventName,
    });
    return output;
  };
