import { getRequiredEnvString } from "../../../../utils/helpers";
import { TransactionOutput } from "../../application/transaction-repository";
import zod from "zod";

const NETWORK_ID = getRequiredEnvString("SYNC_NETWORK");

const getBase64ID = (blockHash: string, requestKey: string): string => {
  const inputString = `Transaction:[\"${blockHash}\",\"${requestKey}\"]`;
  const base64ID = Buffer.from(inputString, "utf-8").toString("base64");
  return base64ID;
};

const schema = zod.object({
  id: zod.number(),
  hashTransaction: zod.string(),
  sigs: zod.array(zod.any()),
  continuation: zod.any(),
  eventCount: zod.number(),
  gas: zod.string(),
  height: zod.number(),
  logs: zod.string(),
  code: zod.any(),
  data: zod.any(),
  pactId: zod.string().nullable(),
  proof: zod.string().nullable(),
  step: zod.number().nullable(),
  rollback: zod.boolean(),
  nonceTransaction: zod.string(),
  blockHash: zod.string(),
  requestKey: zod.string(),
  result: zod.any(),
});

function validate(row: any): TransactionOutput {
  const res = schema.parse(row);
  const isSuccess = res.result.status === "success";
  return {
    id: getBase64ID(res.blockHash, res.requestKey),
    transactionId: res.id.toString(),
    blockHeight: res.height,
    blockHash: res.blockHash,
    hash: res.hashTransaction,
    sigs: res.sigs,
    result: {
      // TransactionMempoolInfo
      status: "", // TODO

      // TransactionResult
      badResult: !isSuccess ? res.result.data : null,
      continuation: res.continuation.toString(),
      eventCount: res.eventCount,

      gas: res.gas,
      goodResult: isSuccess ? res.result.data : null,
      logs: res.logs,
    },
    cmd: {
      payload: {
        // ExecutionPayload
        code: res.code,

        // ContinuationPayload and ExecutionPayload
        data: JSON.stringify(res.data),

        // ContinuationPayload
        pactId: res.pactId,
        proof: res.proof,
        rollback: res.rollback,
        step: res.step,
      },
      networkId: NETWORK_ID,
      nonce: row.nonceTransaction,
    },
  };
}

export const transactionValidator = { validate };
