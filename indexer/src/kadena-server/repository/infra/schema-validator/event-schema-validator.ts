import { EventOutput } from "../../application/event-repository";
import zod from "zod";

const schema = zod.object({
  id: zod.number(),
  name: zod.string(),
  blockHash: zod.string(),
  requestKey: zod.string(),
  chainId: zod.number(),
  orderIndex: zod.number(),
  moduleName: zod.string(),
  height: zod.number(),
  parameters: zod.array(zod.any()),
});

const getBase64ID = (
  hash: string,
  orderIndex: number,
  requestKey: string,
): string => {
  const inputString = `Event:[\"${hash}\",\"${orderIndex}\",\"${requestKey}\"]`;
  const base64ID = Buffer.from(inputString, "utf-8").toString("base64");
  return base64ID;
};

function validate(row: any): EventOutput {
  const res = schema.parse(row);
  return {
    id: getBase64ID(res.blockHash, res.orderIndex, res.requestKey),
    eventId: res.id.toString(),
    orderIndex: res.orderIndex,
    name: res.name,
    requestKey: res.requestKey,
    chainId: res.chainId,
    moduleName: res.moduleName,
    height: res.height,
    qualifiedName: `${res.moduleName}.${res.name}`,
    parameters: JSON.stringify(res.parameters),
  };
}

export const eventValidator = { validate };
