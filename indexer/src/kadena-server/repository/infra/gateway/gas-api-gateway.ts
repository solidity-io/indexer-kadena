import { createClient, IUnsignedCommand } from "@kadena/client";
import { GasLimitEstimation } from "../../../config/graphql-types";
import { GasLimitEstimationError } from "../../../errors/gas-limit-estimation-error";
import GasGateway, { EstimeGasOutput } from "../../gateway/gas-gateway";
import { UserInput } from "../../../domain/gas/types.gas";
import { getRequiredEnvString } from "../../../../utils/helpers";

const SYNC_BASE_URL = getRequiredEnvString("SYNC_BASE_URL");

export default class GasApiGateway implements GasGateway {
  async estimateGas(
    input: UserInput,
    transaction: IUnsignedCommand,
    networkId: string,
  ): Promise<GasLimitEstimation> {
    const configuration = {
      preflight: input.preflight,
      signatureVerification: input.signatureVerification,
    };

    try {
      const client = createClient(({ chainId }) => {
        return `${SYNC_BASE_URL}/${networkId}/chain/${chainId}/pact`;
      });
      const result = await client.local(transaction, configuration);

      if (result.result.status === "failure") {
        throw result.result.error;
      }

      const response: EstimeGasOutput = {
        amount: result.gas,
        inputType: input.type,
        usedPreflight: input.preflight,
        usedSignatureVerification: input.signatureVerification,
        transaction: JSON.stringify(transaction),
      };

      return response;
    } catch (error) {
      throw new GasLimitEstimationError(
        "Chainweb Node was unable to estimate the gas limit",
        error,
      );
    }
  }
}
