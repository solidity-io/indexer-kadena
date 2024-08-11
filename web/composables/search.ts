import { debounce } from 'chart.js/helpers';
import { gql } from 'nuxt-graphql-request/utils';

const allQuery = gql`
  query SearchAll($searchTerm: String!, $limit: Int!, $heightFilter: Int) {
    blocks: allBlocks(
      last: $limit,
      filter: {
        or: [
          { hash: { includesInsensitive: $searchTerm } },
          { parent: { includesInsensitive: $searchTerm } },
          { payloadHash: { includesInsensitive: $searchTerm } },
          { transactionsHash: { includesInsensitive: $searchTerm } },
          { outputsHash: { includesInsensitive: $searchTerm } },
          { height: { equalTo: $heightFilter } }
        ]
      }
    ) {
      nodes {
        id
        hash
        parent
        chainId
        height
        creationTime
        payloadHash
        transactionsHash
        outputsHash
        weight
        epochStart
        chainwebVersion
      }
    }

    transactions: allTransactions(
      last: $limit,
      filter: {
        or: [
          { requestkey: { includesInsensitive: $searchTerm } },
          { hash: { includesInsensitive: $searchTerm } },
          { txid: { includesInsensitive: $searchTerm } },
          { pactid: { includesInsensitive: $searchTerm } },
          { sender: { includesInsensitive: $searchTerm } }
        ]
      }
    ) {
      nodes {
        id
        requestkey
        hash
        txid
        pactid
        sender
        chainId
        result
        gas
        gaslimit
        gasprice
      }
    }

    addresses: allBalances(
      first: $limit,
      filter: {
        account: { includesInsensitive: $searchTerm }
      },
      orderBy: [ACCOUNT_ASC]
    ) {
      nodes {
        account
        chainId
        balance
        module
        qualname
        tokenId
        hasTokenId
      }
    }

    tokens: allContracts(
      first: $limit,
      filter: {
        type: { equalTo: "fungible" },
        module: { includesInsensitive: $searchTerm }
      }
    ) {
      nodes {
        id
        network
        chainId
        module
        metadata
        tokenId
        precision
      }
    }
  }
`

const searchBlocksQuery = gql`
  query SearchBlocks($searchTerm: String!, $limit: Int!, $heightFilter: Int) {
    blocks: allBlocks(
      last: $limit,
      filter: {
        or: [
          { hash: { includesInsensitive: $searchTerm } },
          { parent: { includesInsensitive: $searchTerm } },
          { payloadHash: { includesInsensitive: $searchTerm } },
          { transactionsHash: { includesInsensitive: $searchTerm } },
          { outputsHash: { includesInsensitive: $searchTerm } },
          { height: { equalTo: $heightFilter } }
        ]
      }
    ) {
      nodes {
        id
        hash
        parent
        chainId
        height
        creationTime
        payloadHash
        transactionsHash
        outputsHash
        weight
        epochStart
        chainwebVersion
      }
    }
  }
`;

const searchTransactionsQuery = gql`
  query SearchTransactions($searchTerm: String!, $limit: Int!) {
    transactions: allTransactions(
      last: $limit,
      filter: {
        or: [
          { requestkey: { includesInsensitive: $searchTerm } },
          { hash: { includesInsensitive: $searchTerm } },
          { txid: { includesInsensitive: $searchTerm } },
          { pactid: { includesInsensitive: $searchTerm } },
          { sender: { includesInsensitive: $searchTerm } }
        ]
      }
    ) {
      nodes {
        id
        requestkey
        hash
        txid
        pactid
        sender
        chainId
        result
        gas
        gaslimit
        gasprice
      }
    }
  }
`;

const searchAddressQuery = gql`
  query SearchUniqueAddresses($searchTerm: String!, $limit: Int!) {
    addresses: allBalances(
      first: $limit,
      filter: {
        account: { includesInsensitive: $searchTerm }
      },
      orderBy: [ACCOUNT_ASC]
    ) {
      nodes {
        account
        chainId
        balance
        module
        qualname
        tokenId
        hasTokenId
      }
    }
  }
`;

const searchFungibleTokensQuery = gql`
  query SearchFungibleTokens($searchTerm: String!, $limit: Int!) {
    tokens: allContracts(
      first: $limit,
      filter: {
        type: { equalTo: "fungible" },
        module: { includesInsensitive: $searchTerm }
      }
    ) {
      nodes {
        id
        network
        chainId
        module
        metadata
        tokenId
        precision
      }
    }
  }
`;

const filters = [
  {
    value: 'all',
    label: 'All filters',
    query: allQuery,
  },
  {
    value: 'blocks',
    label: 'Blocks',
    query: searchBlocksQuery,
  },
  {
    value: 'transactions',
    label: 'Transactions',
    query: searchTransactionsQuery,
  },
  {
    value: 'address',
    label: 'Addresses',
    query: searchAddressQuery,
  },
  {
    value: 'tokens',
    label: 'Tokens',
    query: searchFungibleTokensQuery,
  },
];

export function useSearch () {
  const data = reactive({
    query: '',
    open: false,
    error: null,
    loading: false,
    searched: null,
    filters,
    filter: filters[0],
  });

  const { $graphql } = useNuxtApp();

  const search = debounce(async ([value]: any) => {
    if (!value) {
      data.searched = null;
      return;
    }

    data.loading = true;
    data.error = null;

    console.log('fucking value', value);

    try {
      const variables = {
        searchTerm: value,
        limit: 5, // You can adjust this limit as needed
      } as any;

      const heightFilter = parseInt(value);

      if (!isNaN(heightFilter)) {
        if (Number.isSafeInteger(heightFilter)) {
          variables.heightFilter = heightFilter;
        }
      }

      const queryResult = await $graphql.default.request(data.filter.query, variables);

      console.log('foo', queryResult);
      if (value === data.query) {
        data.searched = queryResult;
      }
    } catch (error) {
      console.error('Search error:', error);
      data.error = 'An error occurred while searching. Please try again.';
    } finally {
      data.loading = false;
    }
  }, 500);

  const close = () => {
    data.open = false
  }

  const cleanup = () => {
    data.query = ''
    data.searched = null
    close()
  }

  return {
    data,
    close,
    search,
    cleanup,
  };
}
