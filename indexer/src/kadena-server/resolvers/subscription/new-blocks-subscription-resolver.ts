import { ResolverContext } from "../../config/apollo-server-config";
import { SubscriptionResolvers } from "../../config/graphql-types";
import { BlockOutput } from "../../repository/application/block-repository";
import { buildBlockOutput } from "../output/build-block-output";

async function* iteratorFn(
  chainIds: string[],
  context: ResolverContext,
): AsyncGenerator<BlockOutput[], void, unknown> {
  const startingTimestamp = new Date().getTime() / 1000;

  let lastBlockId: number | undefined;

  while (context.signal) {
    const newBlocks = await context.blockRepository.getLatestBlocks({
      creationTime: startingTimestamp,
      lastBlockId,
      chainIds,
    });

    if (newBlocks.length > 0) {
      lastBlockId = Number(newBlocks[0].id);
      yield newBlocks.map((b) => buildBlockOutput(b));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export const newBlocksSubscriptionResolver: SubscriptionResolvers<ResolverContext>["newBlocks"] =
  {
    subscribe: (_root, args, context) => {
      return iteratorFn(args.chainIds ?? [], context);
    },
    resolve: (payload: any) => payload,
  };
