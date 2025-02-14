import { Block } from '../../config/graphql-types';
import { EventOutput } from '../../repository/application/event-repository';

export const buildEventOutput = (event: EventOutput) => {
  return {
    ...event,
    // for resolvers
    block: {} as Block,
  };
};
