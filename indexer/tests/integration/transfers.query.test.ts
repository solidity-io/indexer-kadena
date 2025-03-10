import { GraphQLClient, gql } from 'graphql-request';
const API_URL = 'http://localhost:3001/graphql';

const client = new GraphQLClient(API_URL);

const resOne = {
  data: {
    transfers: {
      totalCount: 2,
      edges: [
        {
          node: {
            amount: '34',
            receiverAccount: 'k:7577a017eab7067e194fea639dae351406bc139425c7a170ceb4026f829b0816',
            senderAccount: 'ef46137232f1cb9acebf717f94a5a9083e96db16957da79ed0d1df29b0bb4ff8',
            moduleName: 'n_ebe54249b2e9d68f5060961f3c419f8288d18dc2.unitt',
          },
        },
        {
          node: {
            amount: '0.001766',
            receiverAccount: 'k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3',
            senderAccount: 'k:c55bf5b9f84c33616c31806402f66576b4e59ae4b90830636e38c746a44069fc',
            moduleName: 'coin',
          },
        },
      ],
    },
  },
};

describe('Transfers Query', () => {
  it('requestKey: "RNxoNCcQriEZU3p_qLSiJAo7Bi-0-Oe7NkjkPFOKr70"', async () => {
    const query = gql`
      query {
        transfers(requestKey: "RNxoNCcQriEZU3p_qLSiJAo7Bi-0-Oe7NkjkPFOKr70") {
          totalCount
          edges {
            node {
              amount
              receiverAccount
              senderAccount
              moduleName
            }
          }
        }
      }
    `;

    const data = await client.request(query);
    expect(resOne.data).toMatchObject(data);
  });
});
