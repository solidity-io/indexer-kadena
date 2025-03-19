import { GraphQLClient, gql } from 'graphql-request';
const API_URL = 'http://localhost:3001/graphql';

const client = new GraphQLClient(API_URL);

const resOne = {
  data: {
    tokens: {
      edges: [
        {
          cursor: 'YXJrYWRlLnRva2VuLDEy',
          node: {
            id: 'VG9rZW46W2Fya2FkZS50b2tlbiwxMl0=',
            name: 'arkade.token',
            chainId: '12',
          },
        },
        {
          cursor: 'YXJrYWRlLnRva2VuLDEz',
          node: {
            id: 'VG9rZW46W2Fya2FkZS50b2tlbiwxM10=',
            name: 'arkade.token',
            chainId: '13',
          },
        },
        {
          cursor: 'YXJrYWRlLnRva2VuLDE0',
          node: {
            id: 'VG9rZW46W2Fya2FkZS50b2tlbiwxNF0=',
            name: 'arkade.token',
            chainId: '14',
          },
        },
        {
          cursor: 'YXJrYWRlLnRva2VuLDE1',
          node: {
            id: 'VG9rZW46W2Fya2FkZS50b2tlbiwxNV0=',
            name: 'arkade.token',
            chainId: '15',
          },
        },
        {
          cursor: 'YXJrYWRlLnRva2VuLDE2',
          node: {
            id: 'VG9rZW46W2Fya2FkZS50b2tlbiwxNl0=',
            name: 'arkade.token',
            chainId: '16',
          },
        },
        {
          cursor: 'YXJrYWRlLnRva2VuLDE3',
          node: {
            id: 'VG9rZW46W2Fya2FkZS50b2tlbiwxN10=',
            name: 'arkade.token',
            chainId: '17',
          },
        },
        {
          cursor: 'YXJrYWRlLnRva2VuLDE4',
          node: {
            id: 'VG9rZW46W2Fya2FkZS50b2tlbiwxOF0=',
            name: 'arkade.token',
            chainId: '18',
          },
        },
        {
          cursor: 'YXJrYWRlLnRva2VuLDE5',
          node: {
            id: 'VG9rZW46W2Fya2FkZS50b2tlbiwxOV0=',
            name: 'arkade.token',
            chainId: '19',
          },
        },
        {
          cursor: 'ZnJlZS5haXIsMQ==',
          node: {
            id: 'VG9rZW46W2ZyZWUuYWlyLDFd',
            name: 'free.air',
            chainId: '1',
          },
        },
        {
          cursor: 'ZnJlZS5hbmVkYWssMA==',
          node: {
            id: 'VG9rZW46W2ZyZWUuYW5lZGFrLDBd',
            name: 'free.anedak',
            chainId: '0',
          },
        },
      ],
    },
  },
};

describe('Tokens query', () => {
  it('first: 10, after: "YXJrYWRlLnRva2VuLDEx"', async () => {
    const query = gql`
      query {
        tokens(first: 10, after: "YXJrYWRlLnRva2VuLDEx") {
          edges {
            cursor
            node {
              id
              name
              chainId
            }
          }
        }
      }
    `;

    const data = await client.request(query);
    expect(resOne.data).toMatchObject(data);
  });
});
