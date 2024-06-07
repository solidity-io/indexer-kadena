import { TransactionAttributes } from "../../models/transaction";
import { TransferAttributes } from "../../models/transfer";
import { getManifest, getPrecision, } from "../../utils/pact";
import { saveContract } from "../syncService";

/**
 * Filters and processes NFT transfer events from a payload's event data. It identifies NFT transfer events based on
 * predefined criteria (e.g., event name and parameter structure), and constructs transfer attribute objects for each.
 *
 * @param eventsData The array of event data from a transaction payload.
 * @param payloadHash The hash of the payload containing these events.
 * @param transactionAttributes Transaction attributes associated with the events.
 * @param receiptInfo Receipt information associated with the events.
 * @returns An array of transfer attributes specifically for NFT transfers.
 */
export function getNftTransfers(
  network: string,
  chainId: number,
  eventsData: any,
  payloadHash: string | undefined,
  transactionAttributes: TransactionAttributes,
  receiptInfo: any
) {
  const TRANSFER_NFT_SIGNATURE = "TRANSFER";
  const TRANSFER_NFT_PARAMS_LENGTH = 4;

  const transferNftSignature = (eventData: any) =>
    eventData.name == TRANSFER_NFT_SIGNATURE &&
    eventData.params.length == TRANSFER_NFT_PARAMS_LENGTH &&
    typeof eventData.params[0] == "string" &&
    typeof eventData.params[1] == "string" &&
    typeof eventData.params[2] == "string" &&
    typeof eventData.params[3] == "number";

  const transferPromises = eventsData
    .filter(transferNftSignature)
    .map(async (eventData: any): Promise<TransferAttributes> => {
      const params = eventData.params;
      const tokenId = params[0];
      const from_acct = params[1];
      const to_acct = params[2];
      const amount = params[3];

      const modulename = eventData.module.namespace
        ? `${eventData.module.namespace}.${eventData.module.name}`
        : eventData.module.name;

      console.log("Token ID:", tokenId);

      const manifestData = await getManifest(
        network,
        chainId,
        modulename,
        tokenId
      );
      let contractId;
      if (manifestData) {
        contractId = await saveContract(network, chainId, modulename, contractId, "poly-fungible", tokenId, manifestData);
      } else {
        console.log("No manifest URI found for token ID:", tokenId);
      }

      return {
        amount: amount,
        payloadHash: payloadHash,
        chainId: transactionAttributes.chainId,
        from_acct: from_acct,
        modulehash: eventData.moduleHash,
        modulename: modulename,
        requestkey: receiptInfo.reqKey,
        to_acct: to_acct,
        network: network,
        hasTokenId: true,
        tokenId: tokenId,
        type: "poly-fungible",
        contractId: contractId,
      } as TransferAttributes;
    }) as TransferAttributes[];
  return Promise.all(transferPromises);
}

/**
 * Filters and processes coin transfer events from a payload's event data. Similar to `getNftTransfers`, but focuses on
 * coin-based transactions. It identifies events that represent coin transfers and constructs transfer attribute objects.
 *
 * @param eventsData The array of event data from a transaction payload.
 * @param payloadHash The hash of the payload containing these events.
 * @param transactionAttributes Transaction attributes associated with the events.
 * @param receiptInfo Receipt information associated with the events.
 * @returns An array of transfer attributes specifically for coin transfers.
 */
export function getCoinTransfers(
  network: string,
  eventsData: any,
  payloadHash: string,
  transactionAttributes: TransactionAttributes,
  receiptInfo: any
) {
  const TRANSFER_COIN_SIGNATURE = "TRANSFER";
  const TRANSFER_COIN_PARAMS_LENGTH = 3;

  const transferCoinSignature = (eventData: any) =>
    eventData.name == TRANSFER_COIN_SIGNATURE &&
    eventData.params.length == TRANSFER_COIN_PARAMS_LENGTH &&
    typeof eventData.params[0] == "string" &&
    typeof eventData.params[1] == "string" &&
    typeof eventData.params[2] == "number";

  const transferPromises = eventsData
    .filter(transferCoinSignature)
    .map(async (eventData: any): Promise<TransferAttributes> => {
      const modulename = eventData.module.namespace
        ? `${eventData.module.namespace}.${eventData.module.name}`
        : eventData.module.name;
      const chainId = transactionAttributes.chainId;

      const precisionData = await getPrecision(
        network,
        chainId,
        modulename
      );

      let contractId;
      if (precisionData) {
        contractId = await saveContract(network, chainId, modulename, contractId, "fungible", null, null, precisionData);
      } else {
        console.log("No precision found for module:", modulename);
      }

      const params = eventData.params;
      const from_acct = params[0];
      const to_acct = params[1];
      const amount = params[2];
      return {
        amount: amount,
        payloadHash: payloadHash,
        chainId: transactionAttributes.chainId,
        from_acct: from_acct,
        modulehash: eventData.moduleHash,
        modulename: eventData.module.namespace
          ? `${eventData.module.namespace}.${eventData.module.name}`
          : eventData.module.name,
        requestkey: receiptInfo.reqKey,
        to_acct: to_acct,
        network: network,
        hasTokenId: false,
        tokenId: undefined,
        type: "fungible",
        contractId: undefined,
      } as TransferAttributes;
    }) as TransferAttributes[];
  return Promise.all(transferPromises);
}