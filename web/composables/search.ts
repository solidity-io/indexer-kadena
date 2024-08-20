import { debounce } from 'chart.js/helpers';
import { gql } from 'nuxt-graphql-request/utils';

const allQuery = gql`
  query SearchAll($searchTerm: String!, $limit: Int!, $heightFilter: Int) {
    searchAll(searchTerm: $searchTerm, limit: $limit, heightFilter: $heightFilter) {
      blocks {
        chainId
        hash
        height
        parent
        transactionsCount
      }
      tokens {
        type
        module
        chainId
      }
      transactions {
        sender
        requestkey
        result
        metadata
        chainId
      }
      addresses {
        account
      }
    }
  }
`

const searchBlocksQuery = gql`
  query SearchBlocks($searchTerm: String!, $limit: Int!, $heightFilter: Int) {
    searchAll(searchTerm: $searchTerm, limit: $limit, heightFilter: $heightFilter) {
      blocks {
        chainId
        hash
        height
        parent
        transactionsCount
      }
    }
  }
`;

const searchTransactionsQuery = gql`
  query SearchTransactions($searchTerm: String!, $limit: Int!) {
    searchAll(searchTerm: $searchTerm, limit: $limit) {
      transactions {
        sender
        requestkey
        result
        metadata
        chainId
      }
    }
  }
`;

const searchAddressQuery = gql`
  query SearchUniqueAddresses($searchTerm: String!, $limit: Int!) {
    searchAll(searchTerm: $searchTerm, limit: $limit) {
      addresses {
        account
      }
    }
  }
`;

const searchFungibleTokensQuery = gql`
  query SearchFungibleTokens($searchTerm: String!, $limit: Int!) {
    searchAll(searchTerm: $searchTerm, limit: $limit) {
      tokens {
        type
        module
        chainId
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

      const { searchAll } = await $graphql.default.request(data.filter.query, variables);

      if (value === data.query) {
        data.searched = searchAll;
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
