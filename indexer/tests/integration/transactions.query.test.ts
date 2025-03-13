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

const resTwo = {
  data: {
    transactions: {
      pageInfo: {
        endCursor: 'MTcyNDc2MTg5',
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: 'MTcyNDc2MTky',
      },
      totalCount: 21,
      edges: [
        {
          cursor: 'MTcyNDc2MTky',
          node: {
            id: 'VHJhbnNhY3Rpb246WyJGSEQyaEVwQlltUzdDUjhsMUI2YmhyVk0zZHZLX0wxeXo5dUtLWFBBRFVRIiwicVVFdEhUZnpfOXo5cWl2dDRmZXROdHF0MDVwei15RktMdTJ3TWlHNFdyRSJd',
            hash: 'qUEtHTfz_9z9qivt4fetNtqt05pz-yFKLu2wMiG4WrE',
            cmd: {
              meta: {
                sender: 'k:b95ea3559d0bdab751891523dab34f5f57f473fdd00cb9d79a23b9414e4f4e33',
              },
              payload: {
                code: '"(free.radio02.add-received-with-chain \\"cc4f5cfffe205d7b\\" \\"U2FsdGVkX19SVUSGOXLII21FEVYX3X+5eqsnPJcA1PA=;;;;;oQTiyaTIRTnokdQjDZ8e6MXQyqQ5WZmgcwRJa5QmM2GngbpJCs4oG4M2Iaf0CXPxkuMplG4llknLmOwkG1CPOCVXnjoSEE+95ut7zpNwaVYTw7HJ711DJPgc1LiZEclWcKaOFRQ/Fax5t0EPnqLE5WwpGjWZEwlrdDlvx/XuJBI=\\" \\"0\\" )"',
              },
            },
            result: {
              badResult: null,
              goodResult: '"Write succeeded"',
              continuation: null,
            },
          },
        },
        {
          cursor: 'MTcyNDc2MTkx',
          node: {
            id: 'VHJhbnNhY3Rpb246WyJGSEQyaEVwQlltUzdDUjhsMUI2YmhyVk0zZHZLX0wxeXo5dUtLWFBBRFVRIiwiU2MweDVnWHdYVHFGd1B2LTRyUUx4VWlfYWNOa1owN3psYURsbFBfNWFzMCJd',
            hash: 'Sc0x5gXwXTqFwPv-4rQLxUi_acNkZ07zlaDllP_5as0',
            cmd: {
              meta: {
                sender: 'k:e1e4a7064bffaf7dbbf5ef5f7f3c025e5d7fe48614aa2e4d6c44ccc9dcd3d56b',
              },
              payload: {
                code: '"(free.radio02.close-send-receive \\"k:48e0917d48785f68572bc6506e049a713979772fa341aeb14e9ecae47d951f8c\\" [] [] )"',
              },
            },
            result: {
              badResult: null,
              goodResult: '""',
              continuation: null,
            },
          },
        },
        {
          cursor: 'MTcyNDc2MTkw',
          node: {
            id: 'VHJhbnNhY3Rpb246WyJGSEQyaEVwQlltUzdDUjhsMUI2YmhyVk0zZHZLX0wxeXo5dUtLWFBBRFVRIiwiV1pHdkFHQjFpVU12WENjMWRHbnc4QlZYUzJsa0NJdDhLTEN3QlRDNllVUSJd',
            hash: 'WZGvAGB1iUMvXCc1dGnw8BVXS2lkCIt8KLCwBTC6YUQ',
            cmd: {
              meta: {
                sender: 'k:6712f99b183edd481c76c1fd572b60f56620a799dd00d0a40e74a06ce1b09c77',
              },
              payload: {
                code: '"(free.radio02.add-received-with-chain \\"cc4f5cfffe205d7b\\" \\"U2FsdGVkX18vv0+U2aVuU/ZtRgGTo4a1ScURpWZG3Rc=;;;;;U2YBtMfdmgH65fGUlkFJdXwncaDF27GDpPBsGGVO16imgpDoJ4IHG5ZpOKxpJbV/DgsFgU/DSlfFIGIW6kIDXYcjja+icMQLZnkopKXrbOMYeNf9nEu3iOE1Gft4leAYHUqHhG9DBt9+1xOLzdxAOteuyeyhbtPb3xBK/RZilFQ=\\" \\"0\\" )"',
              },
            },
            result: {
              badResult: null,
              goodResult: '"Write succeeded"',
              continuation: null,
            },
          },
        },
        {
          cursor: 'MTcyNDc2MTg5',
          node: {
            id: 'VHJhbnNhY3Rpb246WyJGSEQyaEVwQlltUzdDUjhsMUI2YmhyVk0zZHZLX0wxeXo5dUtLWFBBRFVRIiwiRXQ0NWdTWGN4ZnF1bDU0Zi04TTVfaExTTjVObVYyVjhkXzVUNDlEYXlNYyJd',
            hash: 'Et45gSXcxfqul54f-8M5_hLSN5NmV2V8d_5T49DayMc',
            cmd: {
              meta: {
                sender: 'k:0e98a32914e0af5c3dc2b41f216a37091d1664b00b6a8e3a87d5e5022eeab4e3',
              },
              payload: {
                code: '"(free.radio02.direct-to-send \\"k:b3c65463af1f398a5465c15c4c9f221d3a5bb3efad52829715f088a7ee4bc7d3\\" )"',
              },
            },
            result: {
              badResult: null,
              goodResult: '"Write succeeded"',
              continuation: null,
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

  it('first: "20", after: "MTcyNDc2MTkz", blockHash: "FHD2hEpBYmS7CR8l1B6bhrVM3dvK_L1yz9uKKXPADUQ"', async () => {
    const query = gql`
      query {
        transactions(
          first: 20
          after: "MTcyNDc2MTkz"
          blockHash: "FHD2hEpBYmS7CR8l1B6bhrVM3dvK_L1yz9uKKXPADUQ"
        ) {
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
          totalCount
          edges {
            cursor
            node {
              id
              hash
              cmd {
                meta {
                  sender
                }
                payload {
                  ... on ExecutionPayload {
                    code
                  }
                }
              }
              result {
                ... on TransactionResult {
                  badResult
                  goodResult
                  continuation
                }
              }
            }
          }
        }
      }
    `;

    const data = await client.request(query);
    expect(resTwo.data).toMatchObject(data);
  });
});
