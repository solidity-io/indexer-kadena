import zod from "zod";
import { SignerOutput } from "../../application/transaction-repository";

const schema = zod.object({
  requestKey: zod.string(),
  publicKey: zod.string(),
  address: zod.string().nullable(),
  signerOrderIndex: zod.number(),
  clist: zod
    .array(zod.object({ args: zod.array(zod.any()), name: zod.string() }))
    .nullable(),
});

export const getBase64SignerID = (
  requestKey: string,
  orderIndex: number,
): string => {
  const inputString = `Signer:[\"${requestKey}\",\"${orderIndex}\"]`;
  const base64ID = Buffer.from(inputString, "utf-8").toString("base64");
  return base64ID;
};

function validate(row: any): SignerOutput {
  const res = schema.parse(row);
  return {
    id: getBase64SignerID(res.requestKey, res.signerOrderIndex),
    pubkey: res.publicKey,
    address: res.address,
    orderIndex: res.signerOrderIndex,
    scheme: "",
    clist: (res.clist ?? []).map((c) => ({
      args: JSON.stringify(c.args),
      name: c.name,
    })),
  };
}

export const signerMetaValidator = { validate };
