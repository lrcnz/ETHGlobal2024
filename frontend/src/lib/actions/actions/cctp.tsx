/* eslint-disable @typescript-eslint/no-unused-vars */
import { Circuit } from "@/lib/box/circuit";
import { Action } from "../types";
import { CircuitData, CircuitInput } from "@/lib/box/types";

export class CctpAction implements Action {
  readonly id = "Cctp";
  readonly riskLevel = "safe";

  public getDescription(_data: Circuit): string {
    return `Bridge tokens from Base to Ethereum`;
  }

  public getNextCircuit(_data: CircuitData): Circuit[] {
    return [];
  }

  public checkIfUseable(_circuit: Circuit): boolean {
    return true;
  }

  public getOutputToken(data: CircuitData): CircuitInput {
    if (!data.inputToken) return [];

    return [data.inputToken[0]];
  }
}
