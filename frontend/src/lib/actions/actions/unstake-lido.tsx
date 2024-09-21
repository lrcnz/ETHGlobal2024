import { Address, PublicClient } from "viem";
import { Action, Contracts } from "../types";
import { LIDO } from "./abis/lido";
import { ST_ETH_ADDRESS } from "@/configs/contracts";
import { Circuit } from "@/lib/box/circuit";
import { CommonOutputPreview } from "./utils/common-output-preview";
import { CircuitData, CircuitOutput } from "@/lib/box/types";

export class UnstakeLidoAction implements Action {
  readonly id = "unstake-lido";
  readonly riskLevel = "safe";
  readonly contractAddress = ST_ETH_ADDRESS;

  public getDescription(data: Circuit): string {
    const { inputToken } = data.details;

    if (!inputToken || inputToken.length !== 1) throw new Error("Invalid input token");

    return `Unstake ${inputToken} to Lido`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getOutputPreviewElement(_circuit: Circuit) {
    const Preview = () => {
      return <CommonOutputPreview tokens={["ETH"]} />;
    }

    return Preview;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getOutputToken(_data: CircuitData): CircuitOutput {
    return ["ETH"];
  }

  public checkIfUseable(circuit: Circuit): boolean {
    const { inputToken } = circuit.details;
    // only useable if input is ETH
    return !!inputToken && inputToken.length === 1 && inputToken[0] === "stETH";
  }

  public getAPY(data: CircuitData): number {
    return 0;
  }

  public getNextCircuit(data: CircuitData): Circuit[] {
    const { inputToken } = data;

    if (!inputToken || inputToken.length !== 1) throw new Error("Invalid input token");

    return [
      new Circuit({ inputToken: ["ETH"] }),
    ];
  }

  public async getContracts(amount: bigint): Promise<Contracts> {
    return [
      {
        address: this.contractAddress,
        abi: LIDO,
        functionName: "deposit",
        args: [],
        value: amount,
      }
    ];
  }

  public async getSimulateOutput(
    amount: bigint,
    address: string,
    _data: CircuitData,
    publicClient: PublicClient,
  ): Promise<bigint[]> {
    const contracts = await this.getContracts(amount);

    const result = await publicClient.simulateContract({
      ...contracts[0],
      account: address as Address
    });

    return [BigInt(result.result)];
  }
}