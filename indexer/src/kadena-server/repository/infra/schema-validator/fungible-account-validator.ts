import { FungibleAccountOutput } from "../../application/balance-repository";
import zod from "zod";
import { BalanceAttributes } from "../../../../models/balance";

const fungibleSchema = zod.object({
  id: zod.number(),
  account: zod.string(),
  module: zod.string(),
});

const totalBalanceSchema = zod.object({
  totalBalance: zod.string(),
});

const getBase64ID = (fungibleName: string, accountName: string): string => {
  const inputString = `FungibleAccount:[\"${fungibleName}\",\"${accountName}\"]`;
  const base64ID = Buffer.from(inputString, "utf-8").toString("base64");
  return base64ID;
};

const validate = (row: any): Omit<FungibleAccountOutput, "totalBalance"> => {
  const res = fungibleSchema.parse(row);
  return {
    id: getBase64ID(res.module, res.account),
    accountName: res.account,
    fungibleName: res.module,
  };
};

const validateTotalBalance = (row: any): string => {
  const res = totalBalanceSchema.parse(row);
  return res.totalBalance;
};

const mapFromSequelize = (
  balanceModel: BalanceAttributes,
): Omit<FungibleAccountOutput, "totalBalance"> => {
  return {
    id: getBase64ID(balanceModel.module, balanceModel.account),
    accountName: balanceModel.account,
    fungibleName: balanceModel.module,
  };
};

export const fungibleAccountValidator = {
  validate,
  validateTotalBalance,
  mapFromSequelize,
};
