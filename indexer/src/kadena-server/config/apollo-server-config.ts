import DataLoader from 'dataloader';
import BlockRepository, { BlockOutput } from '../repository/application/block-repository';
import TransactionRepository, {
  TransactionOutput,
} from '../repository/application/transaction-repository';
import BalanceRepository from '../repository/application/balance-repository';
import EventRepository from '../repository/application/event-repository';
import TransferRepository from '../repository/application/transfer-repository';
import NetworkRepository from '../repository/application/network-repository';
import PoolRepository from '../repository/application/pool-repository';
import { PubSub } from 'graphql-subscriptions';
import BlockDbRepository from '../repository/infra/repository/block-db-repository';
import TransactionDbRepository from '../repository/infra/repository/transaction-db-repository';
import BalanceDbRepository from '../repository/infra/repository/balance-db-repository';
import EventDbRepository from '../repository/infra/repository/event-db-repository';
import TransferDbRepository from '../repository/infra/repository/transfer-db-repository';
import NetworkDbRepository from '../repository/infra/repository/network-db-repository';
import PoolDbRepository from '../repository/infra/repository/pool-db-repository';
import GasGateway from '../repository/gateway/gas-gateway';
import GasApiGateway from '../repository/infra/gateway/gas-api-gateway';
import MempoolGateway from '../repository/gateway/mempool-gateway';
import MempoolApiGateway from '../repository/infra/gateway/mempool-api-gateway';
import PactGateway from '../repository/gateway/pact-gateway';
import PactApiGateway from '../repository/infra/gateway/pact-api-gateway';
import { LiquidityPositionRepository } from '../repository/application/liquidity-position-repository';
import LiquidityPositionDbRepository from '../repository/infra/repository/liquidity-position-db-repository';

export const publishSubscribe = new PubSub();

export interface ResolverContext {
  getBlocksByHashesLoader: DataLoader<string, BlockOutput>;
  getBlocksByTransactionIdsLoader: DataLoader<string, BlockOutput>;
  getBlocksByEventIdsLoader: DataLoader<string, BlockOutput>;
  getTransactionsByEventIdsLoader: DataLoader<string, TransactionOutput>;
  balanceRepository: BalanceRepository;
  blockRepository: BlockRepository;
  eventRepository: EventRepository;
  transferRepository: TransferRepository;
  transactionRepository: TransactionRepository;
  networkRepository: NetworkRepository;
  poolRepository: PoolRepository;
  gasGateway: GasGateway;
  mempoolGateway: MempoolGateway;
  pactGateway: PactGateway;
  pubSub: PubSub;
  signal: AbortSignal;
  liquidityPositionRepository: LiquidityPositionRepository;
}

export const createGraphqlContext = () => {
  const blockRepository = new BlockDbRepository();
  const transactionRepository = new TransactionDbRepository();
  const context = {
    blockRepository,
    transactionRepository,
    balanceRepository: new BalanceDbRepository(),
    eventRepository: new EventDbRepository(),
    transferRepository: new TransferDbRepository(),
    networkRepository: new NetworkDbRepository(),
    poolRepository: new PoolDbRepository(),
    gasGateway: new GasApiGateway(),
    mempoolGateway: new MempoolApiGateway(),
    pactGateway: new PactApiGateway(),
    pubSub: publishSubscribe,
    signal: new AbortController().signal,
    liquidityPositionRepository: new LiquidityPositionDbRepository(),
  };

  return Promise.resolve({
    ...context,
    getBlocksByHashesLoader: new DataLoader(hashes =>
      blockRepository.getBlockByHashes(hashes as string[]),
    ),
    getBlocksByEventIdsLoader: new DataLoader(eventIds =>
      blockRepository.getBlocksByEventIds(eventIds as string[]),
    ),
    getTransactionsByEventIdsLoader: new DataLoader(eventIds =>
      transactionRepository.getTransactionsByEventIds(eventIds as string[]),
    ),
    getBlocksByTransactionIdsLoader: new DataLoader(hashes =>
      blockRepository.getBlocksByTransactionIds(hashes as string[]),
    ),
  });
};
