import { handleSingleQuery } from "../../../utils/raw-query";
import PactGateway, { GetNftsInfoParams } from "../../gateway/pact-gateway";

export default class PactApiGateway implements PactGateway {
  async getNftsInfo(data: GetNftsInfoParams) {
    const promises = data.map(async (nft) => {
      const query = {
        chainId: nft.chainId,
        code: `(marmalade-v2.ledger.get-token-info (token-id))`,
        data: [{ key: "token-id", value: nft.tokenId }],
      };
      const res = await handleSingleQuery(query);
      const result = JSON.parse(res.result ?? "{}");
      return {
        version: result.version ?? "unknown",
        uri: result.uri ?? "unknown",
        supply: result?.supply ? Number(result.supply) : 0,
        precision: result.precision ? Number(result.precision) : 0,
      };
    });

    const nfts = await Promise.all(promises);
    return nfts;
  }
}
