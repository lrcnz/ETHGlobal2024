import { Circuit } from "@/lib/box/circuit";
import { Action, Contracts } from "../types";
import { getTokenAddress, SHORT_MARKET, WETH_ADDRESS } from "@/configs/contracts";
import { CircuitData, CircuitOutput } from "@/lib/box/types";
import { CommonOutputPreview } from "./utils/common-output-preview";
import { PublicClient } from "viem";
import { SHORT_MARKET_ABI } from "./abis/short-market";

export class CloseShortMarket implements Action {
  readonly id = 'close-short-market';
  readonly riskLevel = "risk";
  readonly contractAddress = SHORT_MARKET;

  public getDescription(data: Circuit): string {
    const { inputToken } = data.details;
    
    if (!inputToken || inputToken.length !== 1) return "";

    return `Close ${inputToken[0]} Short Position`;
  }

  public checkIfUseable(circuit: Circuit): boolean {
    const { inputToken } = circuit.details;

    if (!inputToken || inputToken.length !== 1) return false;

    const token = inputToken[0];

    return token === 'ETH';
  }

  public getOutputToken(data: CircuitData): CircuitOutput {
    const { inputToken } = data;

    return [`Short ${inputToken?.[0]}`];
  }

  public getOutputPreviewElement (circuit: Circuit) {
    const Preview = () => {
      const inputToken = circuit.details?.inputToken?.[0];

      return <CommonOutputPreview tokens={[`Short ${inputToken}`]} />;
    }

    return Preview;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getNextCircuit(data: CircuitData): Circuit[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getContracts(amount: bigint, address: string, data: CircuitData, publicClient: PublicClient): Promise<Contracts> {
    const inputToken = data.inputToken?.[0];
    const isETH = inputToken === 'ETH';
    const result = [];

    const tokenAddress = isETH ? WETH_ADDRESS : getTokenAddress(inputToken);

    result.push({
      address: this.contractAddress,
      abi: SHORT_MARKET_ABI,
      functionName: "closePosition",
      args: [tokenAddress, address]
    });

    return result as Contracts;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getDirectOutput(_amount: bigint, _data: CircuitData): bigint[] {
    return [BigInt(0)];
  }
}