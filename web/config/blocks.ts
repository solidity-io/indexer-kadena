import { blockchainTooltipData } from "./tooltips"

export const blocksTableColumns = [
  {
    isFixed: true,
    cols: 1,
    key: 'icon',
    label: '',
  },
  {
    cols: 3,
    key: 'height',
    label: 'Block Height',
    description: blockchainTooltipData.block.blockHeight
  },
  {
    cols: 6,
    key: 'hash',
    label: 'Hash',
    description: blockchainTooltipData.block.overview.hash
  },
  {
    cols: 3,
    center: true,
    key: 'chainId',
    label: 'Chain',
    description: blockchainTooltipData.block.chain
  },
  {
    cols: 3,
    key: 'fees',
    center: true,
    label: 'Total Fees (KDA)',
    description: blockchainTooltipData.block.overview.totalFees
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
    description: blockchainTooltipData.block.creationTime
  },
]

export const blockTransactionsTableColumns = [
  {
    cols: 2,
    key: 'status',
    label: 'Status',
    description: blockchainTooltipData.block.transactions.status
  },
  {
    cols: 8,
    key: 'requestkey',
    label: 'Request Key',
    description: blockchainTooltipData.block.transactions.requestKey
  },
  {
    cols: 14,
    key: 'code',
    label: 'Code',
    description: blockchainTooltipData.block.transactions.code
  },
]
