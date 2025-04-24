import { createClient, ExecutionResult, Sink } from 'graphql-ws';
import { getEventsSubscriptionQuery } from '../builders/events-subscription.builder';
import WebSocket from 'ws';

interface Event {
  id: string;
  chainId: string;
  height: number;
  moduleName: string;
  name: string;
  orderIndex: number;
  parameters: string;
  qualifiedName: string;
  requestKey: string;
}

interface SubscriptionResponse {
  events: Event[];
}

const wsUrl = process.env.WS_URL ?? 'ws://localhost:3001/graphql';

const SUBSCRIPTION_TIMEOUT = 90000;

describe('Events Subscription', () => {
  it.only(
    'should receive events for a specific qualified event name',
    async () => {
      const client = createClient({
        url: wsUrl,
        webSocketImpl: WebSocket,
      });

      const subscription = getEventsSubscriptionQuery({
        qualifiedEventName: 'coin.TRANSFER',
      });

      let unsubscribeFn: (() => void) | undefined;
      let timeoutId: NodeJS.Timeout | undefined;

      // Create a promise that will resolve when we receive the first event
      const firstEventPromise = new Promise<SubscriptionResponse>((resolve, reject) => {
        const sink: Sink<ExecutionResult> = {
          next: (data: ExecutionResult) => {
            if (data.data) {
              resolve(data.data as unknown as SubscriptionResponse);
              // Unsubscribe after receiving the event
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
        // Wait for the first event with a timeout
        const result = (await Promise.race([
          firstEventPromise,
          new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              if (unsubscribeFn) {
                unsubscribeFn();
              }
              reject(new Error('Timeout waiting for event'));
            }, SUBSCRIPTION_TIMEOUT);
          }),
        ])) as SubscriptionResponse;

        // Verify the event structure
        expect(result).toHaveProperty('events');
        expect(Array.isArray(result.events)).toBe(true);
        expect(result.events.length).toBeGreaterThan(0);

        // Check each event in the array
        result.events.forEach(event => {
          expect(event).toHaveProperty('id');
          expect(event).toHaveProperty('chainId');
          expect(event).toHaveProperty('height');
          expect(event).toHaveProperty('moduleName');
          expect(event).toHaveProperty('name');
          expect(event).toHaveProperty('orderIndex');
          expect(event).toHaveProperty('parameters');
          expect(event).toHaveProperty('qualifiedName');
          expect(event).toHaveProperty('requestKey');
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

  it.only(
    'should receive events with chainId filter',
    async () => {
      const client = createClient({
        url: wsUrl,
        webSocketImpl: WebSocket,
      });

      const subscription = getEventsSubscriptionQuery({
        qualifiedEventName: 'coin.TRANSFER',
        chainId: '2',
      });

      let unsubscribeFn: (() => void) | undefined;
      let timeoutId: NodeJS.Timeout | undefined;

      // Create a promise that will resolve when we receive the first event
      const firstEventPromise = new Promise<SubscriptionResponse>((resolve, reject) => {
        const sink: Sink<ExecutionResult> = {
          next: (data: ExecutionResult) => {
            if (data.data) {
              resolve(data.data as unknown as SubscriptionResponse);
              // Unsubscribe after receiving the event
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
          complete: () => {
            // Subscription completed
          },
        };

        unsubscribeFn = client.subscribe({ query: subscription }, sink);
      });

      try {
        // Wait for the first event with a timeout
        const result = (await Promise.race([
          firstEventPromise,
          new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              if (unsubscribeFn) {
                unsubscribeFn();
              }
              reject(new Error('Timeout waiting for event'));
            }, SUBSCRIPTION_TIMEOUT);
          }),
        ])) as SubscriptionResponse;

        // Verify the event structure and chainId
        expect(result).toHaveProperty('events');
        expect(Array.isArray(result.events)).toBe(true);
        expect(result.events.length).toBeGreaterThan(0);

        // Check each event in the array
        result.events.forEach(event => {
          expect(event.chainId).toBe(2);
          expect(event).toHaveProperty('id');
          expect(event).toHaveProperty('height');
          expect(event).toHaveProperty('moduleName');
          expect(event).toHaveProperty('name');
          expect(event).toHaveProperty('orderIndex');
          expect(event).toHaveProperty('parameters');
          expect(event).toHaveProperty('qualifiedName');
          expect(event).toHaveProperty('requestKey');
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
    'should receive events with minimumDepth filter',
    async () => {
      const client = createClient({
        url: wsUrl,
        webSocketImpl: WebSocket,
      });

      const subscription = getEventsSubscriptionQuery({
        qualifiedEventName: 'coin.TRANSFER',
        minimumDepth: 1,
      });

      let unsubscribeFn: (() => void) | undefined;
      let timeoutId: NodeJS.Timeout | undefined;

      // Create a promise that will resolve when we receive the first event
      const firstEventPromise = new Promise<SubscriptionResponse>((resolve, reject) => {
        const sink: Sink<ExecutionResult> = {
          next: (data: ExecutionResult) => {
            if (data.data) {
              resolve(data.data as unknown as SubscriptionResponse);
              // Unsubscribe after receiving the event
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
          complete: () => {
            // Subscription completed
          },
        };

        unsubscribeFn = client.subscribe({ query: subscription }, sink);
      });

      try {
        // Wait for the first event with a timeout
        const result = (await Promise.race([
          firstEventPromise,
          new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              if (unsubscribeFn) {
                unsubscribeFn();
              }
              reject(new Error('Timeout waiting for event'));
            }, SUBSCRIPTION_TIMEOUT);
          }),
        ])) as SubscriptionResponse;

        // Verify the event structure
        expect(result).toHaveProperty('events');
        expect(Array.isArray(result.events)).toBe(true);
        expect(result.events.length).toBeGreaterThan(0);

        // Check each event in the array
        result.events.forEach(event => {
          expect(event.height).toBeGreaterThan(0);
          expect(event).toHaveProperty('id');
          expect(event).toHaveProperty('chainId');
          expect(event).toHaveProperty('moduleName');
          expect(event).toHaveProperty('name');
          expect(event).toHaveProperty('orderIndex');
          expect(event).toHaveProperty('parameters');
          expect(event).toHaveProperty('qualifiedName');
          expect(event).toHaveProperty('requestKey');
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
