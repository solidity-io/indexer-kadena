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

  const pairUpdateEvents = events.filter(
    event => MODULE_NAMES.includes(event.module) && event.name === 'UPDATE',
  );

  if (pairUpdateEvents.length > 0) {
    console.log('pairUpdateEvents', pairUpdateEvents);
    const updateParams = pairUpdateEvents.map(event => ({
      moduleName: event.module,
      name: event.name,
      parameterText: JSON.stringify(event.params),
      parameters: JSON.stringify(event.params),
      qualifiedName: event.qualname,
      chainId: event.chainId,
    }));
    await PairService.updatePairs(updateParams);
  }

  const swapEvents = events.filter(
    event => MODULE_NAMES.includes(event.module) && event.name === 'SWAP',
  );

  if (swapEvents.length > 0) {
    console.log('swapEvents', swapEvents);
    const swapParams = swapEvents.map(event => ({
      moduleName: event.module,
      name: event.name,
      parameterText: JSON.stringify(event.params),
      parameters: JSON.stringify(event.params),
      qualifiedName: event.qualname,
      chainId: event.chainId,
    }));
    await PairService.processSwaps(swapParams);
  }

  const liquidityEvents = events.filter(
    event =>
      MODULE_NAMES.includes(event.module) &&
      (event.name === 'ADD_LIQUIDITY' || event.name === 'REMOVE_LIQUIDITY'),
  );

  if (liquidityEvents.length > 0) {
    console.log('liquidityEvents', liquidityEvents);
    const liquidityParams = liquidityEvents.map(event => ({
      moduleName: event.module,
      name: event.name,
      parameterText: JSON.stringify(event.params),
      parameters: JSON.stringify(event.params),
      qualifiedName: event.qualname,
      chainId: event.chainId,
    }));
    await PairService.processLiquidityEvents(liquidityParams);
  }
}
