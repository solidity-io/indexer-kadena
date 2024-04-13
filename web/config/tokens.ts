export const trendingTokensTableColumns = [
  {
    cols: 1,
    key: 'ranking',
    label: '#',
  },
  {
    cols: 6,
    key: 'token',
    label: 'Token',
  },
  {
    cols: 4,
    key: 'price',
    label: 'Price'
  },
  {
    cols: 2,
    key: 'change',
    label: 'Change (%)',
  },
  {
    cols: 4,
    key: 'volume',
    label: 'Volume (24)',
  },
  {
    cols: 4,
    key: 'market',
    label: 'Market Cap',
  },

  {
    cols: 3,
    key: 'supply',
    label: 'Circulating Supply',
  },
]

export const tokenTransfersTableColumns = [
  {
    cols: 2,
    key: 'hash',
    label: 'Hash'
  },
  {
    center: true,
    cols: 2,
    key: 'method',
    label: 'Method',
  },
  {
    cols: 4,
    key: 'from',
    label: 'From',
  },
  {
    cols: 4,
    key: 'to',
    label: 'To',
  },
  {
    cols: 3,
    key: 'amount',
    label: 'Amount',
  },
  {
    cols: 3,
    key: 'token',
    label: 'Token',
  },
  {
    cols: 5,
    key: 'date',
    label: 'Date',
  },
  {
    cols: 1,
    center: true,
    key: 'icon',
    label: '',
  },
]

export const tokenDetailTransferTableColumns = [
  {
    cols: 2,
    key: 'hash',
    label: 'Hash'
  },
  {
    cols: 3,
    key: 'block',
    label: 'Block Height',
  },
  {
    center: true,
    cols: 2,
    key: 'method',
    label: 'Method',
  },
  {
    cols: 4,
    key: 'from',
    label: 'From',
  },
  {
    cols: 4,
    key: 'to',
    label: 'To',
  },
  {
    cols: 3,
    key: 'amount',
    label: 'Quantity',
  },
  {
    cols: 5,
    key: 'date',
    label: 'Date',
  },
  {
    cols: 1,
    center: true,
    key: 'icon',
    label: '',
  },
]

export const holdersTableColumns = [
  {
    cols: 1,
    key: 'ranking',
    label: '#'
  },
  {
    cols: 7,
    key: 'address',
    label: 'Address',
  },
  {
    cols: 5,
    key: 'quantity',
    label: 'Quantity',
  },
  {
    cols: 5,
    key: 'value',
    label: 'Value',
  },
  {
    cols: 6,
    key: 'percentage',
    label: 'Percentage',
  },
]
