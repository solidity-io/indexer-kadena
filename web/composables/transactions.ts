// import { computed } from 'vue'

// const shortenAddress = (
//   address: string,
//   chars = 5
// ): string => {
//   if (!address) {
//     return ''
//   }

//   return `${address.slice(0, chars)}...${address.slice(
//     -chars
//   )}`
// }

export const useTransaction = (props: any): any => {
  const nodeLength = props.transfersByTransactionId.nodes.length || 0

  const transferIndex = Math.max(nodeLength - 1, 0)

  const {
    toAcct,
    fromAcct
  } = props.transfersByTransactionId.nodes[transferIndex]

  let publicKey = ''

  if (props.data) {
    const parsedData = JSON.parse(props?.data || '{}')

    const [ first ] = parsedData.keyset?.keys || parsedData.ks?.keys

    publicKey = first
  }

  return {
    publicKey,
    sender: fromAcct,
    id: props.id || 0,
    logs: props?.logs,
    receiver: toAcct,
    code: props.code,
    data: props?.data,
    result: props.result,
    blockId: props.blockId,
    createdAt: props.createdAt,
    requestKey: props.requestkey,
    continuation: props.continuation,
    events: props.eventsByTransactionId?.nodes || [],
    gasTransaction: props.transfersByTransactionId.nodes[0] || [],
    transfers: props.transfersByTransactionId.nodes.slice(1) || [],
    status: props.result.includes('\"status\":\"success\"') ? 'success' : 'error',

    // Metadata
    metadata: {
      ttl: props.ttl,
      gas: props.gas,
      nonce: props.nonce,
      sender: props.sender,
      chainId: props.chainid,
      gasLimit: props.gaslimit,
      gasPrice: props.gasprice,
    },
  }
}
