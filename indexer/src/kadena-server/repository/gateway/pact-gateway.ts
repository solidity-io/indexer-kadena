export interface NftInfo {
  version: string;
  supply: number;
  precision: number;
  uri: string;
}

export type GetNftsInfoParams = Array<{ tokenId: string; chainId: string }>;

export default interface PactGateway {
  getNftsInfo(data: GetNftsInfoParams): Promise<NftInfo[]>;
}
