import { IUnsignedCommand } from '@kadena/types';
import { GasLimitEstimation } from '../../config/graphql-types';
import { UserInput } from '../../domain/gas/types.gas';

export type EstimeGasOutput = GasLimitEstimation;

export default interface GasGateway {
  estimateGas(
    params: UserInput,
    transaction: IUnsignedCommand,
    networkId: string,
  ): Promise<EstimeGasOutput>;
}
