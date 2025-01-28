import { withFilter } from "graphql-subscriptions";
import { ResolverContext } from "../../config/apollo-server-config";
import { SubscriptionResolvers } from "../../config/graphql-types";

import BlockModel from "../../../models/block"; // Sequelize model for blocks
import { Op } from "sequelize";
import { blockValidator } from "../../repository/infra/schema-validator/block-schema-validator";
import { BlockOutput } from "../../repository/application/block-repository";

async function* iteratorFn(
  chainIds: string[],
  context: ResolverContext,
): AsyncGenerator<BlockOutput[], void, unknown> {
  const startingTimestamp = new Date().getTime() / 1000;

  let lastBlockId: number | undefined;

  while (true) {
    const newBlocks = await getNewBlocks(
      chainIds,
      startingTimestamp,
      lastBlockId,
    );

    if (newBlocks.length > 0) {
      lastBlockId = newBlocks[0].id; // Update the last block ID
      yield newBlocks.map((block) => blockValidator.mapFromSequelize(block));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function getNewBlocks(
  chainIds: string[],
  date: number,
  lastBlockId?: number,
) {
  return BlockModel.findAll({
    where: {
      ...(lastBlockId && { id: { [Op.gt]: lastBlockId } }),
      creationTime: { [Op.gt]: date },
      ...(chainIds.length && { chainId: { [Op.in]: chainIds } }),
    },
    limit: 100,
    order: [["id", "DESC"]],
  });
}

export const newBlocksSubscriptionResolver: SubscriptionResolvers<ResolverContext>["newBlocks"] =
  {
    subscribe: async (_parent, args, context) => {
      const chainIds = args.chainIds ?? [];

      const iterator = withFilter(
        () => iteratorFn(chainIds, context),
        (payload, variables) => {
          let subscribedChainIds;
          if (variables) {
            subscribedChainIds = variables.chainIds;
          } else {
            subscribedChainIds = [];
          }
          console.log("subscribedChainIds", subscribedChainIds);
          return (
            !subscribedChainIds.length ||
            subscribedChainIds.includes(payload.chainId)
          );
        },
      )();

      return {
        [Symbol.asyncIterator]: () => iterator,
      };
    },
    resolve: (payload: any) => payload,
  };
