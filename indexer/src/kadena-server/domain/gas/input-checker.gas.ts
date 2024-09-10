import { GasLimitEstimationError } from "../../errors/gas-limit-estimation-error";
import { IGasLimitEstimationInput } from "./parser.gas";
import {
  CodeInput,
  FullCommandInput,
  FullTransactionInput,
  PartialCommandInput,
  PayloadInput,
  StringifiedCommandInput,
  UserInput,
} from "./types.gas";

export function determineInputType(input: IGasLimitEstimationInput): UserInput {
  if ("cmd" in input && "hash" in input && "sigs" in input) {
    return {
      type: "full-transaction",
      preflight: true,
      signatureVerification: true,
      ...input,
    } as FullTransactionInput;
  } else if ("cmd" in input) {
    return {
      type: "stringified-command",
      preflight: true,
      signatureVerification: false,
      ...input,
    } as StringifiedCommandInput;
  } else if ("payload" in input && "meta" in input && "signers" in input) {
    return {
      type: "full-command",
      preflight: "networkId" in input ? true : false,
      signatureVerification: false,
      ...input,
    } as FullCommandInput;
  } else if (
    "payload" in input &&
    ("meta" in input || ("signers" in input && "chainId" in input))
  ) {
    return {
      type: "partial-command",
      preflight: "networkId" in input ? true : false,
      signatureVerification: false,
      ...input,
    } as PartialCommandInput;
  } else if ("payload" in input && "chainId" in input) {
    return {
      type: "payload",
      preflight: false,
      signatureVerification: false,
      ...input,
    } as PayloadInput;
  } else if ("code" in input && "chainId" in input) {
    return {
      type: "code",
      preflight: false,
      signatureVerification: false,
      ...input,
    } as CodeInput;
  }

  throw new GasLimitEstimationError(
    "Unknown input type. Please see the README for the accepted input format.",
  );
}
