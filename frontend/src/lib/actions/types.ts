import { AbiStateMutability, MulticallContracts, Narrow, PublicClient } from "viem";
import { WriteContractFunctionParameters } from "viem/experimental";
import { Circuit } from "../box/circuit";
import { CircuitData, CircuitOutput } from "../box/types";

export interface TokenWithBalance {
  token: string;
  balance: number;
}

export type RiskLevel = 'safe' | 'medium' | 'risk';
export const RISK_LEVELS: RiskLevel[] = ['safe', 'medium', 'risk'];

export type Logic = 'and' | 'or';

export type Contracts<
  contracts extends
  readonly unknown[] = readonly WriteContractFunctionParameters[],
> = MulticallContracts<
  Narrow<contracts>,
  { mutability: AbiStateMutability }
>

export interface Action {
  readonly id: string;
  readonly riskLevel: RiskLevel;

  getDescriptionElement?: (circuit: Circuit) => () => JSX.Element;
  // For display the action description in the UI
  getDescription(data: Circuit): string;
  // For get the output config of the action
  getOutputPreviewElement?: (circuit: Circuit) => () => JSX.Element;
  // For get the actual output token of the action
  getOutputToken?(data: CircuitData): CircuitOutput;
  // For get the next circuit data
  getNextCircuit(data: CircuitData): Circuit[];
  // For check if the action is useable
  checkIfUseable(circuit: Circuit): boolean;
  onSelect?(circuit: Circuit): void;
  // For get the APY of the action
  getAPY?(data: CircuitData): number;
  getContracts?(
    amount: bigint,
    address: string,
    data: CircuitData,
    publicClient: PublicClient
  ): Promise<Contracts>;
  // For get the simulate output of the action
  getSimulateOutput?(
    amount: bigint,
    address: string,
    data: CircuitData,
    publicClient: PublicClient
  ): Promise<bigint[]>;
  // For get the direct output of the action
  getDirectOutput?(
    amount: bigint,
    data: CircuitData,
  ): bigint[]
}
