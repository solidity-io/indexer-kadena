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

export const useBlocks = (props: any) => {
  // const transactionCount = computed((): 'success' | 'error' => {
  //   return props.result.includes('\"status\":\"success\"') ? 'success' : 'error'
  // })

  // const gas = computed(() => {
  //   return props.transfersByTransactionId.nodes[0]
  // })

  // const transfers = computed(() => {
  //   return props.transfersByTransactionId.nodes.slice(1)
  // })

  // const sender = computed(() => {
  //   if (transfers.value.length === 0) {
  //     return gas.value.fromAcct
  //   }

  //   return transfers.value[transfers.value.length - 1].fromAcct
  // })

  // const receiver = computed(() => {
  //   if (transfers.value.length === 0) {
  //     return gas.value.fromAcct
  //   }

  //   return transfers.value[transfers.value.length - 1].toAcct
  // })

  return {
    //
  }
}
