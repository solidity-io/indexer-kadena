import { createClient, ExecutionResult, Sink } from 'graphql-ws';
import { getNewBlocksFromDepthSubscriptionQuery } from '../builders/new-blocks-from-depth-subscription.builder';
import WebSocket from 'ws';

interface Block {
  chainId: string;
  creationTime: string;
  difficulty: string;
  epoch: string;
  events: {
    totalCount: number;
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
    };
    edges: Array<{
      cursor: string;
      node: {
        chainId: string;
        height: number;
        id: string;
        moduleName: string;
        name: string;
        orderIndex: number;
        parameters: string;
        parameterText: string;
        qualifiedName: string;
        requestKey: string;
      };
    }>;
  };
  flags: number;
  hash: string;
  height: number;
  id: string;
  minerAccount: {
    accountName: string;
    balance: string;
    chainId: string;
    fungibleName: string;
    guard: {
      keys: string[];
      predicate: string;
      raw: string;
    };
    id: string;
  };
  neighbors: Array<{
    chainId: string;
    hash: string;
  }>;
  nonce: string;
  parent: {
    chainId: string;
  };
  payloadHash: string;
  powHash: string;
  target: string;
  transactions: {
    totalCount: number;
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
    };
    edges: Array<{
      cursor: string;
      node: {
        id: string;
      };
    }>;
  };
  weight: string;
}

interface SubscriptionResponse {
  newBlocksFromDepth: Array<Block>;
}

const wsUrl = process.env.WS_URL ?? 'ws://localhost:3001/graphql';

const SUBSCRIPTION_TIMEOUT = 90000;

describe('New Blocks From Depth Subscription', () => {
  it(
    'should receive new blocks with minimum depth',
    async () => {
      const client = createClient({
        url: wsUrl,
        webSocketImpl: WebSocket,
      });

      const subscription = getNewBlocksFromDepthSubscriptionQuery({
        minimumDepth: 1,
      });

      let unsubscribeFn: (() => void) | undefined;
      let timeoutId: NodeJS.Timeout | undefined;
      let messageCount = 0;

      // Create a promise that will resolve when we receive the second block
      const firstBlockPromise = new Promise<SubscriptionResponse>((resolve, reject) => {
        const sink: Sink<ExecutionResult> = {
          next: (data: ExecutionResult) => {
            messageCount++;
            // Only process the second message
            if (messageCount === 2 && data.data) {
              resolve(data.data as unknown as SubscriptionResponse);
              // Unsubscribe after receiving the block
              if (unsubscribeFn) {
                unsubscribeFn();
              }
              if (timeoutId) {
                clearTimeout(timeoutId);
              }
            }
          },
          error: error => {
            console.error('Subscription error:', error);
            reject(error);
            // Unsubscribe on error
            if (unsubscribeFn) {
              unsubscribeFn();
            }
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
          },
          complete: () => {},
        };

        unsubscribeFn = client.subscribe({ query: subscription }, sink);
      });

      try {
        // Wait for the first block with a timeout
        const result = (await Promise.race([
          firstBlockPromise,
          new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              if (unsubscribeFn) {
                unsubscribeFn();
              }
              reject(new Error('Timeout waiting for block'));
            }, SUBSCRIPTION_TIMEOUT);
          }),
        ])) as SubscriptionResponse;

        // Verify the block structure
        expect(result).toHaveProperty('newBlocksFromDepth');
        expect(Array.isArray(result.newBlocksFromDepth)).toBe(true);
        expect(result.newBlocksFromDepth.length).toBeGreaterThan(0);

        // Check each block in the array
        result.newBlocksFromDepth.forEach(block => {
          expect(block).toHaveProperty('chainId');
          expect(block).toHaveProperty('creationTime');
          expect(block).toHaveProperty('difficulty');
          expect(block).toHaveProperty('epoch');
          expect(block).toHaveProperty('events');
          expect(block).toHaveProperty('flags');
          expect(block).toHaveProperty('hash');
          expect(block).toHaveProperty('height');
          expect(block).toHaveProperty('id');
          expect(block).toHaveProperty('minerAccount');
          expect(block).toHaveProperty('neighbors');
          expect(block).toHaveProperty('nonce');
          expect(block).toHaveProperty('parent');
          expect(block).toHaveProperty('payloadHash');
          expect(block).toHaveProperty('powHash');
          expect(block).toHaveProperty('target');
          expect(block).toHaveProperty('transactions');
          expect(block).toHaveProperty('weight');

          // Check nested properties
          expect(block.events).toHaveProperty('totalCount');
          expect(block.events).toHaveProperty('pageInfo');
          expect(block.events).toHaveProperty('edges');
          expect(block.minerAccount).toHaveProperty('accountName');
          expect(block.minerAccount).toHaveProperty('balance');
          expect(block.minerAccount).toHaveProperty('guard');
          expect(block.transactions).toHaveProperty('totalCount');
          expect(block.transactions).toHaveProperty('pageInfo');
          expect(block.transactions).toHaveProperty('edges');
        });
      } finally {
        // Ensure cleanup in all cases
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (unsubscribeFn) {
          unsubscribeFn();
        }
        await client.dispose();
      }
    },
    SUBSCRIPTION_TIMEOUT,
  );

  it(
    'should receive new blocks with minimum depth and chainIds filter',
    async () => {
      const client = createClient({
        url: wsUrl,
        webSocketImpl: WebSocket,
      });

      const subscription = getNewBlocksFromDepthSubscriptionQuery({
        minimumDepth: 1,
        chainIds: ['2', '9'],
      });

      let unsubscribeFn: (() => void) | undefined;
      let timeoutId: NodeJS.Timeout | undefined;
      let messageCount = 0;

      // Create a promise that will resolve when we receive the second block
      const firstBlockPromise = new Promise<SubscriptionResponse>((resolve, reject) => {
        const sink: Sink<ExecutionResult> = {
          next: (data: ExecutionResult) => {
            messageCount++;
            // Only process the second message
            if (messageCount === 2 && data.data) {
              resolve(data.data as unknown as SubscriptionResponse);
              // Unsubscribe after receiving the block
              if (unsubscribeFn) {
                unsubscribeFn();
              }
              if (timeoutId) {
                clearTimeout(timeoutId);
              }
            }
          },
          error: error => {
            console.error('Subscription error:', error);
            reject(error);
            // Unsubscribe on error
            if (unsubscribeFn) {
              unsubscribeFn();
            }
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
          },
          complete: () => {},
        };

        unsubscribeFn = client.subscribe({ query: subscription }, sink);
      });

      try {
        // Wait for the first block with a timeout
        const result = (await Promise.race([
          firstBlockPromise,
          new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              if (unsubscribeFn) {
                unsubscribeFn();
              }
              reject(new Error('Timeout waiting for block'));
            }, SUBSCRIPTION_TIMEOUT);
          }),
        ])) as SubscriptionResponse;

        // Verify the block structure
        expect(result).toHaveProperty('newBlocksFromDepth');
        expect(Array.isArray(result.newBlocksFromDepth)).toBe(true);
        expect(result.newBlocksFromDepth.length).toBeGreaterThan(0);

        // Check each block in the array
        result.newBlocksFromDepth.forEach(block => {
          expect([2, 9]).toContain(block.chainId);
          expect(block).toHaveProperty('creationTime');
          expect(block).toHaveProperty('difficulty');
          expect(block).toHaveProperty('epoch');
          expect(block).toHaveProperty('events');
          expect(block).toHaveProperty('flags');
          expect(block).toHaveProperty('hash');
          expect(block).toHaveProperty('height');
          expect(block).toHaveProperty('id');
          expect(block).toHaveProperty('minerAccount');
          expect(block).toHaveProperty('neighbors');
          expect(block).toHaveProperty('nonce');
          expect(block).toHaveProperty('parent');
          expect(block).toHaveProperty('payloadHash');
          expect(block).toHaveProperty('powHash');
          expect(block).toHaveProperty('target');
          expect(block).toHaveProperty('transactions');
          expect(block).toHaveProperty('weight');
        });
      } finally {
        // Ensure cleanup in all cases
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (unsubscribeFn) {
          unsubscribeFn();
        }
        await client.dispose();
      }
    },
    SUBSCRIPTION_TIMEOUT,
  );
});
