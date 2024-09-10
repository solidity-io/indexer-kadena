import { BlockAttributes } from "../../../../models/block";
import zod from "zod";
import { BlockOutput } from "../../application/block-repository";
import { convertStringToDate } from "../../../utils/date";
import { calculateBlockDifficulty } from "../../../utils/difficulty";

const schema = zod.object({
  id: zod.number(),
  hash: zod.string(),
  chainId: zod.number(),
  creationTime: zod.string(),
  epochStart: zod.string(),
  featureFlags: zod.number(),
  height: zod.number(),
  nonce: zod.string(),
  payloadHash: zod.string(),
  weight: zod.string(),
  target: zod.string(),
  adjacents: zod.record(zod.any()),
  parent: zod.string(),
});

const getBase64ID = (hash: string): string => {
  const inputString = `Block:${hash.toString()}`;
  const base64ID = Buffer.from(inputString, "utf-8").toString("base64");
  return base64ID;
};

const validate = (row: any): BlockOutput => {
  const res = schema.parse(row);
  return {
    id: getBase64ID(res.hash),
    parentHash: res.parent,
    creationTime: convertStringToDate(res.creationTime),
    epoch: convertStringToDate(res.epochStart),
    flags: res.featureFlags.toString(),
    powHash: "...", // TODO (STREAMING)
    hash: res.hash,
    height: res.height,
    nonce: res.nonce,
    payloadHash: res.payloadHash,
    target: res.target,
    weight: res.weight,
    chainId: res.chainId,
    difficulty: calculateBlockDifficulty(res.target).toString(),
    neighbors: Object.entries(res.adjacents).map(([chainId, hash]) => ({
      chainId,
      hash,
    })),
  };
};

const JSONbig = require("json-bigint");

const mapFromSequelize = (blockModel: BlockAttributes): BlockOutput => {
  return {
    id: getBase64ID(blockModel.hash),
    hash: blockModel.hash,
    parentHash: blockModel.parent,
    chainId: blockModel.chainId,
    creationTime: convertStringToDate(blockModel.creationTime),
    powHash: "...", // TODO (STREAMING)
    difficulty: JSONbig.parse(calculateBlockDifficulty(blockModel.target)),
    epoch: convertStringToDate(blockModel.epochStart),
    flags: blockModel.featureFlags.toString(),
    height: blockModel.height,
    nonce: blockModel.nonce,
    payloadHash: blockModel.payloadHash,
    weight: blockModel.weight,
    target: blockModel.target,
    neighbors: Object.entries(blockModel.adjacents).map(([chainId, hash]) => ({
      chainId,
      hash,
    })),
  };
};

export const blockValidator = { validate, mapFromSequelize };
