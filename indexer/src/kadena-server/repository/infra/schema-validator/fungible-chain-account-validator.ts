import zod from "zod";
import { FungibleChainAccountOutput } from "../../application/block-repository";

const getBase64IDChain = (
  chainId: number,
  fungibleName: string,
  accountName: string,
): string => {
  const inputString = `FungibleChainAccount:[\"${chainId}\",\"${fungibleName}\",\"${accountName}\"]`;
  const base64ID = Buffer.from(inputString, "utf-8").toString("base64");
  return base64ID;
};

const fungibleChainSchema = zod.object({
  id: zod.number(),
  accountName: zod.string(),
  module: zod.string(),
  chainId: zod.number(),
  balance: zod.string(),
});

const validate = (row: any): FungibleChainAccountOutput => {
  const res = fungibleChainSchema.parse(row);
  return {
    id: getBase64IDChain(res.chainId, res.module, res.accountName),
    accountName: res.accountName,
    fungibleName: res.module,
    chainId: res.chainId.toString(),
    balance: Number(res.balance),
    guard: {
      keys: row.guard.keys,
      predicate: row.guard.predicate,
      raw: JSON.stringify({
        keys: row.guard.keys,
        predicate: row.guard.predicate,
      }),
    },
  };
};

export const fungibleChainAccountValidator = {
  validate,
};
