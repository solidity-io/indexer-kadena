import { ResolverContext } from "../../../config/apollo-server-config";
import { BlockEventsConnectionResolvers } from "../../../config/graphql-types";
import zod from "zod";

const schema = zod.object({ blockHash: zod.string() });

export const totalCountBlockEventsConnectionResolver: BlockEventsConnectionResolvers<ResolverContext>["totalCount"] =
  async (parent, _args, context) => {
    console.log("totalCountBlockEventsConnectionResolver");

    const { blockHash } = schema.parse(parent);

    const total = await context.eventRepository.getTotalCountOfBlockEvents(
      blockHash
    );

    return total;
  };
