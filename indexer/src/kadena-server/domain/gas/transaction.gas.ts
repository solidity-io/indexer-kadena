import { createTransaction, IUnsignedCommand } from "@kadena/client";
import { composePactCommand } from "@kadena/client/fp";
import { UserInput } from "./types.gas";
import { hash as hashFunction } from "@kadena/cryptography-utils";
import { GasLimitEstimationError } from "../../errors/gas-limit-estimation-error";

export const buildTransactionPayload = (
  input: UserInput,
  networkId: string,
): IUnsignedCommand => {
  let transaction: IUnsignedCommand;

  switch (input.type) {
    case "full-transaction":
      transaction = {
        cmd: input.cmd,
        hash: input.hash,
        sigs: input.sigs.map((s) => ({ sig: s })),
      };
      break;
    case "stringified-command":
      transaction = {
        cmd: input.cmd,
        hash: hashFunction(input.cmd),
        sigs: input.sigs?.map((s) => ({ sig: s })) || [],
      };
      break;
    case "full-command":
      transaction = createTransaction(
        composePactCommand(
          { payload: input.payload },
          { meta: input.meta },
          { signers: input.signers },
          { networkId },
        )({
          meta: {
            gasLimit: 10000,
            gasPrice: 1.0e-8,
          },
        }),
      );
      break;
    case "partial-command":
      if (!input.meta && "chainId" in input) {
        input.meta = { chainId: input.chainId };
      }

      transaction = createTransaction(
        composePactCommand(
          { payload: input.payload },
          { meta: input.meta },
          { signers: input.signers },
          { networkId },
        )({
          meta: {
            gasLimit: 10000,
            gasPrice: 1.0e-8,
          },
        }),
      );
      break;
    case "payload":
      transaction = createTransaction(
        composePactCommand(
          { payload: input.payload },
          { meta: { chainId: input.chainId } },
        )({
          meta: {
            gasLimit: 10000,
            gasPrice: 1.0e-8,
          },
        }),
      );
      break;
    case "code":
      transaction = createTransaction(
        composePactCommand(
          {
            payload: {
              exec: {
                code: input.code,
                data: {},
              },
            },
          },
          { meta: { chainId: input.chainId } },
        )({
          meta: {
            gasLimit: 10000,
            gasPrice: 1.0e-8,
          },
        }),
      );
      break;
    default:
      throw new GasLimitEstimationError(
        "Something went wrong generating the transaction.",
      );
  }

  return transaction;
};
