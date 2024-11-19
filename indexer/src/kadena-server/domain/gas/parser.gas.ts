import zod from "zod";
import { GasLimitEstimationError } from "../../errors/gas-limit-estimation-error";

const schema = zod.object({
  cmd: zod.string().optional(),
  hash: zod.string().optional(),
  sigs: zod.array(zod.string()).optional(),
  payload: zod.string().optional(),
  meta: zod.string().optional(),
  signers: zod.array(zod.string()).optional(),
  chainId: zod.string().optional(),
  code: zod.string().optional(),
});

export type IGasLimitEstimationInput = zod.infer<typeof schema>;

export function parseInput(input: string): IGasLimitEstimationInput {
  try {
    const parsed = JSON.parse(input);
    return schema.parse(parsed);
  } catch (e) {
    throw new GasLimitEstimationError(
      "Unable to parse input as JSON. Please see the README for the accepted input format.",
    );
  }
}
