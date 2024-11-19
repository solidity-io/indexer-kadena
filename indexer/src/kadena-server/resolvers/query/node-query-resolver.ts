import { ResolverContext } from "../../config/apollo-server-config";
import { QueryResolvers } from "../../config/graphql-types";
import { getNode } from "../node-utils";

export const nodeQueryResolver: QueryResolvers<ResolverContext>["node"] =
  async (_args, parent, context) => {
    console.log("nodeQueryResolver");
    return getNode(context, parent.id);
  };
