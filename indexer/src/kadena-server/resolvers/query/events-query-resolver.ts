import { ResolverContext } from "../../config/apollo-server-config";
import { QueryResolvers } from "../../config/graphql-types";
import { buildEventOutput } from "../output/build-event-output";

export const eventsQueryResolver: QueryResolvers<ResolverContext>["events"] =
  async (_parent, args, context) => {
    console.log("eventsQueryResolver");
    const {
      after,
      first,
      last,
      before,
      blockHash,
      chainId,
      maxHeight,
      minHeight,
      minimumDepth,
      requestKey,
      qualifiedEventName,
    } = args;
    const output = await context.eventRepository.getEventsWithQualifiedName({
      qualifiedEventName,
      after,
      before,
      first,
      last,
      blockHash,
      chainId,
      maxHeight,
      minHeight,
      minimumDepth,
      requestKey,
    });

    const edges = output.edges.map((e) => ({
      cursor: e.cursor,
      node: buildEventOutput(e.node),
    }));

    return {
      edges,
      pageInfo: output.pageInfo,
      // for resolvers
      totalCount: -1,
      blockHash,
      chainId,
      maxHeight,
      minHeight,
      minimumDepth,
      requestKey,
      qualifiedEventName,
    };
  };
