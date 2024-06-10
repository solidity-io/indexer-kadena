export const useNftMetadata = (metadata?: string) => {
  if(!metadata) {
    return {
      image: null,
      id: 'unknown',
      name: 'unknown',
      isUnknown: true,
      collection: 'unknown',
    }
  }

  const parsedMetadata = JSON.parse(metadata)

  return parsedMetadata.data[0].datum
}
