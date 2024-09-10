import { ResolverContext } from "../../../config/apollo-server-config";
import { TransactionResultResolvers } from "../../../config/graphql-types";
import { buildEventOutput } from "../../output/build-event-output";

export const eventsTransactionResultResolver: TransactionResultResolvers<ResolverContext>["events"] =
  async (parent, args, context) => {
    console.log("eventsTransactionResultResolver", parent.transactionId);

    const { first, after, before, last } = args;

    const output = await context.eventRepository.getTransactionEvents({
      transactionId: parent.transactionId,
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
      transactionId: parent.transactionId,
      totalCount: -1,
    };
  };
