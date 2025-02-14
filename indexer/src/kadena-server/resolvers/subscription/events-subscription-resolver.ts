import { ResolverContext } from "../../config/apollo-server-config";
import { SubscriptionResolvers } from "../../config/graphql-types";
import { EventOutput } from "../../repository/application/event-repository";
import { buildEventOutput } from "../output/build-event-output";

async function* iteratorFn(
  context: ResolverContext,
  qualifiedEventName: string,
  chainId?: string | null,
  minimumDepth?: number | null,
): AsyncGenerator<EventOutput[] | undefined, void, unknown> {
  let lastEventId = await context.eventRepository.getLastEventId();
  while (context.signal) {
    const newEvents = await context.eventRepository.getLastEvents({
      qualifiedEventName,
      lastEventId,
      chainId,
      minimumDepth,
    });

    if (newEvents.length > 1) {
      lastEventId = Number(newEvents[0].id);
      yield newEvents.map((e) => buildEventOutput(e));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export const eventsSubscriptionResolver: SubscriptionResolvers<ResolverContext>["events"] =
  {
    subscribe: (__root, args, context) => {
      return iteratorFn(
        context,
        args.qualifiedEventName,
        args.chainId,
        args.minimumDepth,
      );
    },
    resolve: (payload: any) => payload,
  };
