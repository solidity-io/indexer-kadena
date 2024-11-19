import { ResolverContext } from "../../config/apollo-server-config";
import { QueryResolvers } from "../../config/graphql-types";
import { buildTransferOutput } from "../output/build-transfer-output";

export const transfersQueryResolver: QueryResolvers<ResolverContext>["transfers"] =
  async (_parent, args, context) => {
    console.log("transfersQueryResolver");
    const {
      after,
      before,
      first,
      last,
      accountName,
      blockHash,
      chainId,
      fungibleName,
      requestKey,
    } = args;
    const output = await context.transferRepository.getTransfers({
      blockHash,
      accountName,
      chainId,
      fungibleName,
      requestKey,
      first,
      last,
      before,
      after,
    });

    const edges = output.edges.map((e) => ({
      cursor: e.cursor,
      node: buildTransferOutput(e.node),
    }));

    return {
      edges,
      pageInfo: output.pageInfo,
      // for resolvers
      totalCount: -1,
      accountName,
      blockHash,
      chainId,
      fungibleName,
      requestKey,
    };
  };
