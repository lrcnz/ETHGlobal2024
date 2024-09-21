/* eslint-disable @typescript-eslint/no-unused-vars */
import { Circuit } from "@/lib/box/circuit";
import { Action, Contracts } from "../types";
import { getTokenAddress, SHORT_MARKET, WETH_ADDRESS } from "@/configs/contracts";
import { CircuitData, CircuitOutput } from "@/lib/box/types";
import { CommonOutputPreview } from "./utils/common-output-preview";
import { PublicClient } from "viem";
import { WETH_ABI } from "./abis/weth";
import { ERC20_ABI } from "./abis/erc20";
import { SHORT_MARKET_ABI } from "./abis/short-market";

export class ShortMarket implements Action {
  readonly id = 'short-market';
  readonly riskLevel = "safe";
  readonly contractAddress = SHORT_MARKET;

  public getDescription(data: Circuit): string {
    const { inputToken } = data.details;
    
    if (!inputToken || inputToken.length !== 1) return "";

    return `Open ETH Short Position`;
  }

  public checkIfUseable(circuit: Circuit): boolean {
    const { inputToken } = circuit.details;

    if (!inputToken || inputToken.length !== 1) return false;

    const token = inputToken[0];

    return token === 'USDC';
  }

  public getOutputToken(data: CircuitData): CircuitOutput {
    const { inputToken } = data;

    return ['Short ETH'];
  }

  public getOutputPreviewElement (circuit: Circuit) {
    const Preview = () => {
      const inputToken = circuit.details?.inputToken?.[0];

      return <CommonOutputPreview tokens={[`Short ${inputToken}`]} />;
    }

    return Preview;
  }

  public getNextCircuit(data: CircuitData): Circuit[] {
    return [];
  }

  public async getContracts(amount: bigint, address: string, data: CircuitData, publicClient: PublicClient): Promise<Contracts> {
    const inputToken = data.inputToken?.[0];
    const isETH = inputToken === 'ETH';
    const result = [];

    if (isETH) {
      result.push({
        address: WETH_ADDRESS,
        abi: WETH_ABI,
        functionName: "deposit",
        value: amount
      });
    }

    const tokenAddress = isETH ? WETH_ADDRESS : getTokenAddress(inputToken);

    result.push({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [this.contractAddress, amount]
    });

    result.push({
      address: this.contractAddress,
      abi: SHORT_MARKET_ABI,
      functionName: "openShortPosition",
      args: [tokenAddress, amount, 1]
    });

    return result as Contracts;
  }

  public getDirectOutput(_amount: bigint, _data: CircuitData): bigint[] {
    return [BigInt(0)];
  }
}