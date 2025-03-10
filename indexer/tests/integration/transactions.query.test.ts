import { GraphQLClient, gql } from 'graphql-request';
const API_URL = 'http://localhost:3001/graphql';

const client = new GraphQLClient(API_URL);

const resOne = {
  data: {
    transactions: {
      edges: [
        {
          cursor: 'MTg=',
          node: {
            hash: 'LIbJxv2_SLmuyVOWawHAvad2og4QAjIgeHQPSrz8w2M',
            cmd: {
              networkId: 'mainnet01',
              nonce: '2024-12-07 10:31:13.728821 UTC',
              payload: {},
            },
            result: {
              logs: 'KuauAJsfwwyh9rftv8_sfxQ064wjr_MU_eNBpSCmgHs',
              continuation:
                '{"step":0,"yield":{"data":{"amount":337.1879699,"receiver":"99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a","source-chain":"10","receiver-guard":{"keys":["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"],"pred":"keys-all"}},"source":"10","provenance":{"moduleHash":"klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s","targetChainId":"0"}},"pactId":"LIbJxv2_SLmuyVOWawHAvad2og4QAjIgeHQPSrz8w2M","executed":null,"stepCount":2,"continuation":{"def":"coin.transfer-crosschain","args":["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a","99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a",{"keys":["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"],"pred":"keys-all"},"0",337.1879699]},"stepHasRollback":false}',
              goodResult:
                '{"amount":337.1879699,"receiver":"99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a","source-chain":"10","receiver-guard":{"keys":["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"],"pred":"keys-all"}}',
            },
          },
        },
        {
          cursor: 'MTc=',
          node: {
            hash: 'GPexixjsj9u7tFpTOzTqGGnMjF-GK51ealjUDyQcqTA',
            cmd: {
              networkId: 'mainnet01',
              nonce: '2024-12-07T10:30:54.914Z',
              payload: {},
            },
            result: {
              logs: 'sv0JVxMnf6Mpd3VwMFbYXgnklV8DwVc-F_Uyye1sO5g',
              continuation: null,
              goodResult: '"Write succeeded"',
            },
          },
        },
      ],
    },
  },
};

describe('Transactions Query', () => {
  it('blockHash: "Qzi58vcpW97du01srIwxpwSQUPDRNBnl2EKyubP-IWw"', async () => {
    const query = gql`
      query {
        transactions(blockHash: "Qzi58vcpW97du01srIwxpwSQUPDRNBnl2EKyubP-IWw") {
          edges {
            cursor
            node {
              hash
              cmd {
                networkId
                nonce
                payload {
                  ... on ContinuationPayload {
                    data
                    pactId
                    proof
                    rollback
                    step
                  }
                }
              }
              result {
                ... on TransactionResult {
                  logs
                  continuation
                  goodResult
                }
              }
            }
          }
        }
      }
    `;

    const data = await client.request(query);
    expect(resOne.data).toMatchObject(data);
  });
});
