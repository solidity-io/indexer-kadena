export const blocksTableColumns = [
  {
    cols: 3,
    key: 'height',
    label: 'Block Height'
  },
  {
    cols: 6,
    key: 'hash',
    label: 'Hash',
  },
  {
    cols: 3,
    center: true,
    key: 'chainId',
    label: 'Chain',
  },
  {
    cols: 3,
    key: 'todo',
    center: true,
    label: 'Total Fees (KDA)',
  },
  {
    cols: 3,
    center: true,
    key: 'transactions',
    label: 'Transactions',
  },
  {
    cols: 5,
    key: 'createdAt',
    label: 'Date',
  },
  {
    cols: 1,
    key: 'icon',
    label: '',
  },
]

export const blockTransactionsTableColumns = [
  {
    cols: 2,
    key: 'status',
    label: 'Status'
  },
  {
    cols: 8,
    key: 'requestkey',
    label: 'Request Key',
  },
  {
    cols: 14,
    key: 'code',
    label: 'Code',
  },
]
