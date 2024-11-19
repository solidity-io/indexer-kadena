import { ChainId } from "@kadena/types";

export interface IBaseInput {
  preflight: boolean;
  signatureVerification: boolean;
}

export type FullTransactionInput = IBaseInput & {
  type: "full-transaction";
  cmd: string;
  hash: string;
  sigs: string[];
  networkId?: string;
};

export type StringifiedCommandInput = IBaseInput & {
  type: "stringified-command";
  cmd: string;
  sigs?: string[];
  networkId?: string;
};

export type FullCommandInput = IBaseInput & {
  type: "full-command";
  payload: any;
  meta: any;
  signers: any[];
  networkId?: string;
};

export type PartialCommandInput = IBaseInput & {
  type: "partial-command";
  payload: any;
  meta?: any;
  signers?: any[];
  chainId?: ChainId;
  networkId?: string;
};

export type PayloadInput = IBaseInput & {
  type: "payload";
  payload: any;
  chainId: ChainId;
  networkId?: string;
};

export type CodeInput = IBaseInput & {
  type: "code";
  code: string;
  chainId: ChainId;
  networkId?: string;
};

export type UserInput =
  | FullTransactionInput
  | StringifiedCommandInput
  | FullCommandInput
  | PartialCommandInput
  | PayloadInput
  | CodeInput;
