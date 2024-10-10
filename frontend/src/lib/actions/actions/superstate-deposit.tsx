/* eslint-disable @typescript-eslint/no-unused-vars */
import { Circuit } from "@/lib/box/circuit";
import { Action } from "../types";
import { CircuitData, CircuitInput } from "@/lib/box/types";

export class SuperstateDepositAction implements Action {
  readonly id = "superstate-deposit";
  readonly riskLevel = "safe";

  public getDescription(_data: Circuit): string {
    return "Deposit into Superstate’s USTB"
  }

  public getNextCircuit(_data: CircuitData): Circuit[] {
    return [];
  }

  public checkIfUseable(circuit: Circuit): boolean {
    const inputToken = circuit.details?.inputToken?.[0];

    return inputToken === 'USDC';
  }

  public getOutputToken(_data: CircuitData): CircuitInput {
    return ['USTB'];
  }
}
