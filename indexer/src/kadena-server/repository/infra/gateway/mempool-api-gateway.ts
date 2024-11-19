import { getRequiredEnvString } from "../../../../utils/helpers";
import MempoolGateway from "../../gateway/mempool-gateway";
import zod from "zod";

const SYNC_BASE_URL = getRequiredEnvString("SYNC_BASE_URL");
const NETWORK_ID = getRequiredEnvString("SYNC_NETWORK");

const ZodSignature = zod.object({
  sig: zod.string(),
});

const ZodSignerClist = zod.object({
  args: zod.array(zod.union([zod.string(), zod.number()])), // The args can be strings or numbers
  name: zod.string(),
});

const ZodSigner = zod.object({
  pubKey: zod.string(),
  clist: zod.array(ZodSignerClist),
});

const ZodMeta = zod.object({
  creationTime: zod.number(),
  ttl: zod.number(),
  gasLimit: zod.number(),
  chainId: zod.string(),
  gasPrice: zod.number(),
  sender: zod.string(),
});

const ZodExecData = zod.object({
  "account-keyset": zod.object({
    pred: zod.string(),
    keys: zod.array(zod.string()),
  }),
  code: zod.string(),
});

const ZodPayloadExec = zod.object({
  exec: zod.object({
    data: ZodExecData,
  }),
});

const ZodCommand = zod.object({
  networkId: zod.string(),
  payload: ZodPayloadExec,
  signers: zod.array(ZodSigner),
  meta: ZodMeta,
  nonce: zod.string(),
});

const ZodContents = zod.object({
  hash: zod.string(),
  sigs: zod.array(ZodSignature),
  cmd: zod.string(), // This is a stringified JSON object
});

const ZodSchema = zod.object({
  tag: zod.string(),
  contents: ZodContents, //zod.union([, zod.string()]), // Could either be a string or parsed object
});

export type MempoolResponse = zod.infer<typeof ZodContents>;

export default class MempoolApiGateway implements MempoolGateway {
  async getPendingTransaction(
    requestKey: string,
    chainId: string,
  ): Promise<any> {
    const url = `${SYNC_BASE_URL}/${NETWORK_ID}/chain/${chainId}/mempool/lookup`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use base64
      body: JSON.stringify({ requestKey }),
    });
    const data = await res.json();
    const parsedData = ZodSchema.parse(data);

    return {
      hash: parsedData.contents.hash,
      cmd: parsedData.contents.cmd,
      sigs: parsedData.contents.sigs,
    };
  }
}
