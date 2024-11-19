import zod from "zod";
import { TransactionMetaOutput } from "../../application/transaction-repository";
import { convertStringToDate } from "../../../utils/date";

const schema = zod.object({
  chainId: zod.number(),
  creationTime: zod.string(),
  gasLimit: zod.string(),
  gasPrice: zod.string(),
  sender: zod.string(),
  ttl: zod.string(),
});

function validate(row: any): TransactionMetaOutput {
  const res = schema.parse(row);
  return {
    chainId: res.chainId,
    creationTime: convertStringToDate(res.creationTime),
    gasLimit: res.gasLimit,
    gasPrice: Number(res.gasPrice),
    sender: res.sender,
    ttl: res.ttl,
  };
}

export const transactionMetaValidator = { validate };
