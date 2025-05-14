/**
 * Implementation of the PactGateway interface for interacting with Pact smart contracts
 *
 * This file provides a concrete implementation of the PactGateway interface that
 * communicates directly with the Kadena blockchain using Pact query operations.
 * It specializes in retrieving NFT information from Marmalade v2 contracts.
 */

import { INonFungibleTokenBalance } from '@/kadena-server/repository/application/balance-repository';
import { handleSingleQuery } from '../../../../utils/raw-query';
import PactGateway, { NftInfo } from '../../gateway/pact-gateway';

/**
 * Concrete implementation of the PactGateway interface
 *
 * This class implements the PactGateway interface by executing Pact queries
 * against the Kadena blockchain. It uses the handleSingleQuery utility to
 * manage communication with the blockchain node.
 */
export default class PactApiGateway implements PactGateway {
  /**
   * Retrieves detailed information about multiple NFTs from the blockchain
   *
   * This implementation fetches NFT data by executing multiple Pact queries against
   * the Marmalade v2 NFT standard contracts. For each NFT, it makes three separate queries:
   * 1. get-token-info: Retrieves basic token metadata (URI, supply, precision)
   * 2. get-version: Retrieves the token's version information
   * 3. details: Retrieves account-specific information like balance and guard
   *
   * The method processes all queries in parallel for efficiency, then combines
   * the results into a unified NFT information object.
   *
   * @param data - Array of NFT identifiers to query
   * @param account - Account address to check balances for
   * @returns Promise resolving to an array of NFT information objects
   */
  async getNftsInfo(account: string, nfts: INonFungibleTokenBalance[]) {
    const promises = nfts.map(async nft => {
      const result =
        nft.module === 'marmalade-v2.ledger'
          ? await this.getTokenInfoV2(nft.chainId, nft.tokenId, account)
          : await this.getTokenInfoV1(nft.chainId, nft.tokenId, account);
      return result;
    });

    const nftsInfo = await Promise.all(promises);
    return nftsInfo;
  }

  private async getTokenInfoV1(
    chainId: string,
    tokenId: string,
    account: string,
  ): Promise<NftInfo> {
    const query = {
      chainId: chainId,
      code: `(marmalade.ledger.get-policy-info \"${tokenId}\")`,
    };
    const res = await handleSingleQuery(query);
    const result = JSON.parse(res.result ?? '{}');

    const detailsQuery = {
      chainId: chainId,
      code: `(marmalade.ledger.details "${tokenId}" "${account}")`,
    };
    const detailsRes = await handleSingleQuery(detailsQuery);
    const detailsResult = JSON.parse(detailsRes.result ?? '{}');

    return {
      version: 'v1',
      uri:
        result.token?.manifest?.uri?.data && result.token?.manifest?.uri?.scheme
          ? `data:${result.token.manifest.uri.scheme},${result.token.manifest.uri.data}`
          : 'unknown',
      supply: result?.token?.supply ? Number(result.token.supply) : 0,
      precision: result?.token?.precision?.int ? Number(result.token?.precision.int) : 0,
      balance: detailsResult.balance ? Number(detailsResult.balance) : 0,
      guard: {
        keys: detailsResult?.guard?.keys ?? [],
        predicate: detailsResult?.guard?.pred ?? '',
        raw: JSON.stringify({
          keys: detailsResult?.guard?.keys ?? [],
          predicate: detailsResult?.guard?.pred ?? '',
        }),
      },
    };
  }

  private async getTokenInfoV2(
    chainId: string,
    tokenId: string,
    account: string,
  ): Promise<NftInfo> {
    const query = {
      chainId: chainId,
      code: `(marmalade-v2.ledger.get-token-info \"${tokenId}\")`,
    };
    const res = await handleSingleQuery(query);
    const result = JSON.parse(res.result ?? '{}');

    const balanceQuery = {
      chainId: chainId,
      code: `(marmalade-v2.ledger.details "${tokenId}" "${account}")`,
    };
    const balanceRes = await handleSingleQuery(balanceQuery);
    const balanceResult = JSON.parse(balanceRes.result ?? '{}');

    return {
      version: 'v2',
      uri: result.uri ?? 'unknown',
      supply: result?.supply ? Number(result.supply) : 0,
      precision: result?.precision?.int ? Number(result.precision.int) : 0,
      balance: balanceResult.balance ? Number(balanceResult.balance) : 0,
      guard: {
        keys: balanceResult?.guard?.keys ?? [],
        predicate: balanceResult?.guard?.pred ?? '',
        raw: JSON.stringify({
          keys: balanceResult?.guard?.keys ?? [],
          predicate: balanceResult?.guard?.pred ?? '',
        }),
      },
    };
  }
}
