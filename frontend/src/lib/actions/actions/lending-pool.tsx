import { Circuit } from "@/lib/box/circuit";
import { Action, Contracts } from "../types";
import { CircuitData, CircuitOutput } from "@/lib/box/types";
import { CommonOutputPreview } from "./utils/common-output-preview";
import { PublicClient } from "viem";
import { EZ_ETH_ADDRESS, LENDING_POOL, USDT_ADDRESS } from "@/configs/contracts";
import { LENDING_POOL_ABI } from "./abis/lend-pool";
import { ERC20_ABI } from "./abis/erc20";

export class LendingPool implements Action {
  readonly id = 'lending-pool';
  readonly riskLevel = "risk";
  readonly contractAddress = LENDING_POOL;

  public getDescription(data: Circuit): string {
    const { inputToken } = data.details;
    
    if (!inputToken || inputToken.length !== 1) return "";

    return `Lend ${inputToken[0]} to Borrow USDC`;
  }

  public checkIfUseable(circuit: Circuit): boolean {
    const { inputToken } = circuit.details;

    if (!inputToken || inputToken.length !== 1) return false;

    const token = inputToken[0];

    return token === 'ezETH' || token === 'stETH';
  }

  public getAPY(data: CircuitData): number {
    return 0.01;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getOutputToken(data: CircuitData): CircuitOutput {
    return ['USDC'];
  }

  public getOutputPreviewElement () {
    const Preview = () => {
      return <CommonOutputPreview tokens={['USDC']} />;
    }

    return Preview;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getNextCircuit(data: CircuitData): Circuit[] {
    return [
      new Circuit({ inputToken: ['USDC'] }),
    ];
  }

  public async getContracts(amount: bigint, address: string, data: CircuitData, publicClient: PublicClient): Promise<Contracts> {
    const price = await publicClient.readContract({
      address: this.contractAddress,
      abi: LENDING_POOL_ABI,
      functionName: "getCalculatedPrice",
      args: [EZ_ETH_ADDRESS]
    });

    const estimateReceive = amount * price / BigInt(1e18) * BigInt(60) / BigInt(100) / BigInt(1e12);

    return [
      {
        address: EZ_ETH_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [this.contractAddress, amount]
      },
      {
        address: this.contractAddress,
        abi: LENDING_POOL_ABI,
        functionName: "deposit",
        args: [EZ_ETH_ADDRESS, amount, address]
      },
      {
        address: this.contractAddress,
        abi: LENDING_POOL_ABI,
        functionName: 'borrow',
        args: [USDT_ADDRESS, estimateReceive, address],
      }
    ]
  }

  public async getSimulateOutput(
    amount: bigint,
    address: string,
    data: CircuitData,
    publicClient: PublicClient
  ): Promise<bigint[]> {
    const price = await publicClient.readContract({
      address: this.contractAddress,
      abi: LENDING_POOL_ABI,
      functionName: "getCalculatedPrice",
      args: [EZ_ETH_ADDRESS]
    });

    const estimateReceive = amount * price / BigInt(1e18) * BigInt(60) / BigInt(100);

    return [estimateReceive]
  }
}