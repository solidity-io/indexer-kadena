export async function getPrecision(
  network: string,
  chainId: number,
  module: string
): Promise<number | undefined> {
  const now = new Date();

  const createBody = (hash: string = ""): string =>
    `{"cmd":"{\\"signers\\":[],\\"meta\\":{\\"creationTime\\":${now.getTime()},\\"ttl\\":600,\\"chainId\\":\\"${chainId}\\",\\"gasPrice\\":1.0e-8,\\"gasLimit\\":2500,\\"sender\\":\\"sender00\\"},\\"nonce\\":\\"CW:${now.toUTCString()}\\",\\"networkId\\":\\"${network}\\",\\"payload\\":{\\"exec\\":{\\"code\\":\\"(${module}.precision)\\",\\"data\\":{}}}}","hash":"${hash}","sigs":[]}`;

  const { textResponse } = await callLocal(network, chainId, createBody());

  const hashFromResponse = textResponse?.split(" ").splice(-1, 1)[0];

  const { jsonResponse } = await callLocal(
    network,
    chainId,
    createBody(hashFromResponse)
  );

  const precision = jsonResponse?.result.data;

  if (precision !== undefined) {
    return precision;
  } else {
    console.log(`Error fetching precision for module ${module}`);
  }
}

export async function getManifest(
  network: string,
  chainId: number,
  module: string,
  tokenId: string
): Promise<any> {
  const now = new Date();

  const createBody = (hash: string = ""): string =>
    `{"cmd":"{\\"signers\\":[],\\"meta\\":{\\"creationTime\\":${now.getTime()},\\"ttl\\":600,\\"chainId\\":\\"${chainId}\\",\\"gasPrice\\":1.0e-8,\\"gasLimit\\":2500,\\"sender\\":\\"sender00\\"},\\"nonce\\":\\"CW:${now.toUTCString()}\\",\\"networkId\\":\\"${network}\\",\\"payload\\":{\\"exec\\":{\\"code\\":\\"(${module}.get-manifest \\\\\\"${tokenId}\\\\\\")\\",\\"data\\":{}}}}","hash":"${hash}","sigs":[]}`;

  const { textResponse } = await callLocal(network, chainId, createBody());

  const hashFromResponse = textResponse?.split(" ").splice(-1, 1)[0];

  const { jsonResponse } = await callLocal(
    network,
    chainId,
    createBody(hashFromResponse)
  );

  const manifest = jsonResponse?.result.data;

  if (manifest !== undefined) {
    return manifest;
  } else {
    console.log(`Error fetching manifest for token ID ${tokenId}`);
  }
}

export async function callLocal(
  network: string,
  chainId: number,
  body: string
): Promise<{
  textResponse: string | undefined;
  jsonResponse: { result: { data: any } } | undefined;
  response: Response;
}> {
  const response = await fetch(
    `https://api.chainweb.com/chainweb/0.0/${network}/chain/${chainId}/pact/api/v1/local?signatureVerification=false`,
    {
      headers: {
        accept: "application/json;charset=utf-8, application/json",
        "cache-control": "no-cache",
        "content-type": "application/json;charset=utf-8",
        pragma: "no-cache",
      },
      body,
      method: "POST",
    }
  );

  let jsonResponse;
  let textResponse;

  try {
    jsonResponse = (await response.clone().json()) as {
      result: { data: any };
    };
  } catch (e) {
    textResponse = await response.text();
  }
  return { textResponse, jsonResponse, response };
}