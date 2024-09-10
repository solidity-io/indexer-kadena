import { ResolverContext } from "../../../config/apollo-server-config";
import { BlockResolvers } from "../../../config/graphql-types";
import { buildEventOutput } from "../../output/build-event-output";

export const eventsBlockResolver: BlockResolvers<ResolverContext>["events"] =
  async (parent, args, context) => {
    console.log("eventsBlockResolver");
    const { hash } = parent;
    const { first, after, before, last } = args;

    const output = await context.eventRepository.getBlockEvents({
      hash,
      first,
      after,
      before,
      last,
    });

    const edges = output.edges.map((e) => ({
      cursor: e.cursor,
      node: buildEventOutput(e.node),
    }));

    return {
      edges,
      pageInfo: output.pageInfo,
      // for resolvers
      blockHash: hash,
      totalCount: -1,
    };
  };
