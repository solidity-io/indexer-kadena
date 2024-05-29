export const useNftMetadata = (metadata: string) => {
  if(!metadata) {
    return {}
  }

  const parsedMetadata = JSON.parse(metadata)

  return parsedMetadata.data[0]
}
