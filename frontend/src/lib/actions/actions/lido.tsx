import { Address, PublicClient } from "viem";
import { Action, Contracts, Logic } from "../types";
import { LIDO } from "./abis/lido";
import { ST_ETH_ADDRESS } from "@/configs/contracts";
import { Circuit } from "@/lib/box/circuit";
import { CommonOutputPreview } from "./utils/common-output-preview";
import { CircuitData, CircuitOutput } from "@/lib/box/types";

export class LidoAction implements Action {
  readonly id = "lido";
  readonly riskLevel = "safe";
  readonly contractAddress = ST_ETH_ADDRESS;

  public getDescription(data: Circuit): string {
    const { inputToken } = data.details;

    if (!inputToken || inputToken.length !== 1) throw new Error("Invalid input token");

    return `Deposit ${inputToken} to Lido`;
  }

  public getOutputPreviewElement(_circuit: Circuit) {
    const Preview = () => {
      return <CommonOutputPreview tokens={["stETH"]} />;
    }

    return Preview;
  }

  public getOutputToken(_data: CircuitData): CircuitOutput {
    return ["stETH"];
  }

  public checkIfUseable(circuit: Circuit): boolean {
    const { inputToken } = circuit.details;
    // only useable if input is ETH
    return !!inputToken && inputToken.length === 1 && inputToken[0] === "ETH";
  }

  public getAPY(data: CircuitData): number {
    const { inputToken } = data;

    if (inputToken && inputToken[0] === "ETH") {
      return 0.028;
    }

    return 0;
  }

  public getNextCircuit(data: CircuitData): Circuit[] {
    const { inputToken } = data;

    if (!inputToken || inputToken.length !== 1) throw new Error("Invalid input token");

    return [
      new Circuit({ inputToken: ["stETH"] }),
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