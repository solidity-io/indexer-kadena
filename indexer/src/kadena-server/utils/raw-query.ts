import { dirtyReadClient } from '@kadena/client-utils/core';
import type { ChainId } from '@kadena/types';
import { PactQuery, PactQueryData, PactQueryResponse } from '../config/graphql-types';
import { getRequiredEnvString } from '../../utils/helpers';
import { PactCommandError } from '../errors/pact-command-error';

const HOST_URL = getRequiredEnvString('NODE_API_URL');
const NETWORK_ID = getRequiredEnvString('SYNC_NETWORK');

async function sendRawQuery(
  code: string,
  chainId: string,
  data?: PactQueryData[] | null,
): Promise<string> {
  try {
    const result = await dirtyReadClient({
      host: HOST_URL,
      defaults: {
        networkId: NETWORK_ID,
        meta: { chainId: chainId as ChainId },
        payload: {
          exec: {
            code,
            data:
              data?.reduce(
                (acc, obj) => {
                  acc[obj.key] = obj.value;
                  return acc;
                },
                {} as Record<string, unknown>,
              ) || {},
          },
        },
      },
    })().execute();

    return JSON.stringify(result);
  } catch (error) {
    throw new PactCommandError('Pact Command failed with error', error);
  }
}

async function sendQuery(query: PactQuery): Promise<PactQueryResponse> {
  const { code, chainId, data } = query;
  try {
    const result = await sendRawQuery(code, chainId, data);
    return {
      status: 'success',
      result,
      error: null,
      chainId: chainId,
      code: code,
    };
  } catch (error: unknown) {
    const err = error as PactCommandError;
    const pactErrorMessage = err.pactError?.message || JSON.stringify(err.pactError || error);

    return {
      status: 'error',
      result: null,
      error: pactErrorMessage,
      chainId: chainId,
      code: code,
    };
  }
}

function createTimeout(query: PactQuery, timeoutMs: number): Promise<PactQueryResponse> {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve({
        status: 'timeout',
        result: null,
        error: 'The query took too long to execute and was aborted',
        chainId: query.chainId,
        code: query.code,
      });
    }, timeoutMs),
  );
}

export async function handleSingleQuery(query: PactQuery): Promise<PactQueryResponse> {
  const timeoutPromise = createTimeout(query, 10000);

  const sendQueryPromise = sendQuery(query);

  return Promise.race([sendQueryPromise, timeoutPromise]);
}
