/* eslint-disable @typescript-eslint/no-unused-vars */
import { RENZO } from "./abis/renzo";
import { Action, Contracts, Logic } from "../types";
import { LIDO } from "./abis/lido";
import { EZ_ETH_ADDRESS, ST_ETH_ADDRESS } from "@/configs/contracts";
import { Circuit } from "@/lib/box/circuit";
import { CircuitData } from "@/lib/box/types";
import { CommonOutputPreview } from "./utils/common-output-preview";

export class UnstakeRenzoAction implements Action {
  readonly id = 'unstake-zenzo';
  readonly riskLevel = "safe";
  readonly contractAddress = EZ_ETH_ADDRESS

  public getDescription(data: Circuit) {
    const inputToken = data.details.inputToken?.[0];

    if (!inputToken) return '';

    return `UnStake ${inputToken} on Zenzo`;
  }

  public getOutputPreviewElement (circuit: Circuit) {
    const Preview = () => {
      return <CommonOutputPreview tokens={['stETH']} />;
    }

    return Preview;
  }

  public getOutputToken(_data: CircuitData) {
    return ['stETH'];
  }

  public getNextCircuit(data: CircuitData) {
    return [
      new Circuit({ inputToken: ['stETH'] }),
    ];
  }

  public checkIfUseable(circuit: Circuit) {
    const inputToken = circuit.details.inputToken;

    return !!inputToken && inputToken.length === 1 && inputToken[0] === 'ezETH';
  }

  public async getContracts(amount: bigint): Promise<Contracts> {
    return [
      {
        address: ST_ETH_ADDRESS,
        abi: LIDO,
        functionName: "approve",
        args: [this.contractAddress, amount],
      },
      {
        address: this.contractAddress,
        abi: RENZO,
        functionName: "deposit",
        args: [amount],
      }
    ]
  }
}