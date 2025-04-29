import { EventAttributes } from '../../models/event';
import { PairService } from '../pair-service';

const MODULE_NAMES = ['kdlaunch.kdswap-exchange', 'sushiswap.sushi-exchange'];

/**
 * Process pair creation events from transaction events
 * @param events Array of events from a transaction
 */
export async function processPairCreationEvents(events: EventAttributes[]): Promise<void> {
  const pairCreationEvents = events.filter(
    event => MODULE_NAMES.includes(event.module) && event.name === 'CREATE_PAIR',
  );

  if (pairCreationEvents.length > 0) {
    const pairParams = pairCreationEvents.map(event => ({
      moduleName: event.module,
      name: event.name,
      parameterText: JSON.stringify(event.params),
      parameters: JSON.stringify(event.params),
      qualifiedName: event.qualname,
      chainId: event.chainId,
    }));
    await PairService.createPairs(pairParams);
  }
}
