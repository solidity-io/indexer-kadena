/**
 * Fetches the precision value of a module from the blockchain.
 *
 * This function constructs a local call to the blockchain to get the precision value of a specified module.
 * The precision value indicates the number of decimal places the token supports.
 *
 * @param {string} network - The network identifier (e.g., 'mainnet').
 * @param {number} chainId - The ID of the blockchain chain.
 * @param {string} module - The name of the module for which precision is being fetched.
 * @returns {Promise<number | undefined>} A Promise that resolves to the precision value or undefined if an error occurs.
 */
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

/**
 * Fetches the manifest of a token from the blockchain.
 *
 * This function constructs a local call to the blockchain to get the manifest of a specified token.
 * The manifest contains metadata and other relevant information about the token.
 *
 * @param {string} network - The network identifier (e.g., 'mainnet').
 * @param {number} chainId - The ID of the blockchain chain.
 * @param {string} module - The name of the module containing the token.
 * @param {string} tokenId - The ID of the token for which the manifest is being fetched.
 * @returns {Promise<any>} A Promise that resolves to the manifest data or undefined if an error occurs.
 */
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

/**
 * Makes a local call to the blockchain API.
 *
 * This function performs a POST request to the blockchain, sending the provided body as the request payload.
 * It attempts to parse the response as JSON, but falls back to plain text if JSON parsing fails.
 *
 * @param {string} network - The network identifier (e.g., 'mainnet').
 * @param {number} chainId - The ID of the blockchain chain.
 * @param {string} body - The request body to be sent in the POST request.
 * @returns {Promise<{ textResponse: string | undefined; jsonResponse: { result: { data: any } } | undefined; response: Response; }>} 
 * A Promise that resolves to an object containing the text response, JSON response, and the original response object.
 */
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
