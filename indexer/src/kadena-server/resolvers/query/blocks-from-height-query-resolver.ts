import { ResolverContext } from "../../config/apollo-server-config";
import { QueryResolvers } from "../../config/graphql-types";
import { buildBlockOutput } from "../output/build-block-output";

export const blocksFromHeightQueryResolver: QueryResolvers<ResolverContext>["blocksFromHeight"] =
  async (_parent, args, context) => {
    console.log("blocksFromHeightQueryResolver");
    const output = await context.blockRepository.getBlocksBetweenHeights(args);

    const edges = output.edges.map((e) => ({
      cursor: e.cursor,
      node: buildBlockOutput(e.node),
    }));

    return { edges, pageInfo: output.pageInfo };
  };
