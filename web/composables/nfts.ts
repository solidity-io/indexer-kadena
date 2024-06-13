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

const formatNftDatum = (datum: any) => {
  return {
    attributes: datum.attributes || [],
    collection: datum.artistName || "Unknown Collection",
    name: datum.title || datum.name || "Unknown Title",
    description: datum.description || "No description available.",
    createdAt: datum.creationDate || datum['create-date'] || null,
    image: datum.assetUrl || datum.thumbnailUrl || null,
  }
}

export const useNft = (contract?: any) => {
  if (!contract) {
    return {
      image: null,
      attributes: [],
      createdAt: null,
      name: "Unknown Title",
      collection: "Unknown Collection",
      description: "No description available.",
    }
  }

  const {
    data,
  } = JSON.parse(contract?.metadata);

  return formatNftDatum(data[0].datum);
}
