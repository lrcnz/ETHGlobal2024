/* eslint-disable @typescript-eslint/no-unused-vars */
import { Circuit } from "@/lib/box/circuit";
import { Action } from "../types";
import { CircuitData, CircuitInput } from "@/lib/box/types";

export class SuperstateWithdrawAction implements Action {
  readonly id = "superstate-withdraw";
  readonly riskLevel = "safe";

  public getDescription(_data: Circuit): string {
    return "Withdraw from Superstate’s USTB"
  }

  public getNextCircuit(_data: CircuitData): Circuit[] {
    return [];
  }

  public checkIfUseable(circuit: Circuit): boolean {
    const inputToken = circuit.details?.inputToken?.[0];

    return inputToken === 'USTB';
  }

  public getOutputToken(_data: CircuitData): CircuitInput {
    return ['USDC'];
  }
}
