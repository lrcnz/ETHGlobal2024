import { Action, Contracts } from "../types";
import { Token, ChainId, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { Pair, Route, Trade } from "@uniswap/v2-sdk"
import { Address, parseUnits, PublicClient } from "viem";
import { UNI_SWAP_PAIR } from "./abis/uniswap-pair";
import { UNISWAP_INTERFACE } from "./abis/uniswap-interface";
import { ERC20_ABI } from "./abis/erc20";
import { CircuitData } from "@/lib/box/types";
import {
  SWAP_CONTRACT,
  ST_ETH_ADDRESS, UNI_WETH_ADDRESS, USDC_ADDRESS, USDT_ADDRESS
} from "@/configs/contracts";
import { Circuit } from "@/lib/box/circuit";
import { useMemo } from "react";
import { useCircuitData } from "@/app/(pages)/box/create/hooks/use-circuit-data";
import { useSetCircuitData } from "@/app/(pages)/box/create/hooks/use-set-circuit-data";
import { TokenFilter } from "@/app/(pages)/box/create/components/token-filter";

const weth = new Token(ChainId.SEPOLIA, UNI_WETH_ADDRESS, 18, "WETH");
const stETH = new Token(ChainId.SEPOLIA, ST_ETH_ADDRESS, 18, "stETH");
const usdc = new Token(ChainId.SEPOLIA, USDC_ADDRESS, 6, "USDC");
const usdt = new Token(ChainId.SEPOLIA, USDT_ADDRESS, 6, "USDT");

const PAIR_ADDRESS: Record<string, string> = {
  "stETH-WETH": "0x3F5a1F590034Bdf7fa8f02D21e6F95625DA79330",
  "WETH-USDC": "0xC4b215aFEa0333350B5807a734042f785715Ab4a",
  "USDT-USDC": "0x1f01DC7394B6eD5AfeEe969d3F7B7De17e5a958e"
};

const pairs: [string, string][] = [
  ["stETH", "WETH"],
  ["WETH", "USDC"],
  ["USDT", "USDC"]
];

function getToken(token: string) {
  switch (token) {
    case "stETH":
      return stETH;
    case "ETH":
    case "WETH":
      return weth;
    case "USDC":
      return usdc;
    case "USDT":
      return usdt;
    default:
      return undefined;
  }
}

async function createPair(tokenA: Token, tokenB: Token, publicClient: PublicClient): Promise<[Address, Pair]> {
  // const pairAddress = Pair.getAddress(tokenA, tokenB)
  const symbolA = tokenA.symbol as string;
  const symbolB = tokenB.symbol as string;

  const pairAddress: Address = (PAIR_ADDRESS[`${symbolA}-${symbolB}`] || PAIR_ADDRESS[`${symbolB}-${symbolA}`]) as Address;

  const reserves = await publicClient.readContract({
    address: pairAddress,
    abi: UNI_SWAP_PAIR,
    functionName: "getReserves",
  })
  const [reserve0, reserve1] = reserves

  const tokens = [tokenA, tokenB]
  const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]]
  const pair = new Pair(CurrencyAmount.fromRawAmount(token0, reserve0.toString()), CurrencyAmount.fromRawAmount(token1, reserve1.toString()))

  return [pairAddress, pair] as const
}

export class SwapAction implements Action {
  readonly id = "swap";
  readonly riskLevel = "safe";
  readonly contractAddress = SWAP_CONTRACT;

  public getDescriptionElement(circuit: Circuit) {
    const Description = () => {
      const [data] = useCircuitData(circuit);
      const inputToken = data?.inputToken?.[0];
      const outputToken = data?.outputToken?.[0];
      const [, setData] = useSetCircuitData(circuit);

      const handleSetOutputToken = (token: string) => {
        setData({ outputToken: [token], actionId: this.id });
      }

      const availableOutputToken = useMemo(() => {
        if (!inputToken) return [];

        return this.getAvailableOutputToken(inputToken);
      }, [inputToken]);

      return (
        <div className="flex items-center gap-1">
          Swap {inputToken} to <TokenFilter tokens={availableOutputToken} onChange={handleSetOutputToken} value={outputToken} />
        </div>
      );
    }

    return Description;
  }

  public getDescription(data: Circuit): string {
    const { inputToken, outputToken } = data.details;

    if (!inputToken || inputToken.length !== 1) return "";
    if (!outputToken || outputToken.length !== 1) return "";

    return `Swap ${inputToken[0]} to ${outputToken[0]}`;
  }

  private getAvailableOutputToken(token: string) {
    const availablePairs = pairs.filter(pair => pair[0] === token || pair[1] === token);

    // never useable, just for ts check
    if (availablePairs.length === 0) return [];

    return availablePairs.flatMap(pair => pair.filter(m => m !== token)).map((i) => i === 'WETH' ? 'ETH' : i);
  }

  public getNextCircuit(data: CircuitData) {
    const { outputToken } = data;

    if (!outputToken) return [];

    return [
      new Circuit({ inputToken: [outputToken[0]] }),
    ]
  }

  public checkIfUseable(data: Circuit) {
    const { inputToken } = data.details;

    if (!inputToken || inputToken.length !== 1) return false;

    const token = inputToken[0];

    const availablePairs = pairs.filter(pair => pair[0] === token || pair[1] === token);

    return availablePairs.length > 0;
  }

  public async getContracts (
    amount: bigint,
    address: string,
    data: CircuitData,
    publicClient: PublicClient
  ): Promise<Contracts> {
    const getTxParams = async (token0: Token, token1: Token, amount: bigint) => {
      const [pairAddress, pair] = await createPair(token0, token1, publicClient);
      const router = new Route([pair], token0, token1)
      const trade = new Trade(router, CurrencyAmount.fromRawAmount(token0, amount.toString()), TradeType.EXACT_INPUT)

      const slippageTolerance = new Percent("500", "10000") // 5%

      const amountOutMin = trade.minimumAmountOut(slippageTolerance).toExact() // needs to be converted to e.g. decimal string
      const path = [token0.address, token1.address]
      const to = address;
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time

      return [
        amount,
        parseUnits(amountOutMin, token1.decimals),
        path,
        to,
        deadline
      ];
    }

    const { inputToken, outputToken } = data;

    if (!outputToken || !inputToken || inputToken.length !== 1 || outputToken.length !== 1) return [];

    const isInputTokenETH = inputToken[0] === "ETH";
    const isOutputTokenETH = outputToken[0] === "ETH";

    const inputTokenData = getToken(isInputTokenETH ? "WETH" : inputToken[0]);
    const outputTokenData = getToken(isOutputTokenETH ? "WETH" : outputToken[0]);

    if (!outputTokenData || !inputTokenData) return [];

    const txParams = await getTxParams(inputTokenData, outputTokenData, amount);
    const result = [];

    if (inputTokenData.symbol !== 'WETH') {
      // push approve
      result.push({
        address: inputTokenData.address as Address,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [this.contractAddress, amount]
      });
    }

    console.log(isInputTokenETH, isOutputTokenETH);

    // input is eth and output is token
    if (isInputTokenETH && !isOutputTokenETH) {
      result.push({
        address: this.contractAddress,
        abi: UNISWAP_INTERFACE,
        functionName: "swapExactETHForTokens",
        args: txParams.slice(1),
        value: amount
      });
    }

    // input is token and output is eth
    if (!isInputTokenETH && isOutputTokenETH) {
      result.push({
        address: this.contractAddress,
        abi: UNISWAP_INTERFACE,
        functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
        args: txParams
      });
    }

    // input is token and output is token
    if (!isInputTokenETH && !isOutputTokenETH) {
      result.push({
        address: this.contractAddress,
        abi: UNISWAP_INTERFACE,
        functionName: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
        args: txParams
      });
    }

    return result as Contracts;
  }

  public async getSimulateOutput(
    amount: bigint,
    address: string,
    data: CircuitData,
    publicClient: PublicClient
  ): Promise<bigint[]> {
    const getTxParams = async (token0: Token, token1: Token, amount: bigint) => {
      const [pairAddress, pair] = await createPair(token0, token1, publicClient);
      console.log(pairAddress, token0.symbol, token1.symbol);
      const router = new Route([pair], token0, token1)
      const trade = new Trade(router, CurrencyAmount.fromRawAmount(token0, amount.toString()), TradeType.EXACT_INPUT)

      const slippageTolerance = new Percent("50", "10000") // 0.5%

      const amountOutMin = trade.minimumAmountOut(slippageTolerance).toExact() // needs to be converted to e.g. decimal string
      const path = [token0.address, token1.address]
      const to = address;
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time

      console.log(amountOutMin)

      return [
        amount,
        parseUnits(amountOutMin, token1.decimals),
        path,
        to,
        deadline
      ] as const;
    }

    const { outputToken, inputToken } = data;

    if (!outputToken || !inputToken || inputToken.length !== 1 || outputToken.length !== 1) return [BigInt(0)];

    const isInputTokenETH = inputToken[0] === "ETH";
    const isOutputTokenETH = outputToken[0] === "ETH";

    const inputTokenData = getToken(isInputTokenETH ? "WETH" : inputToken[0]);
    const outputTokenData = getToken(isOutputTokenETH ? "WETH" : outputToken[0]);

    if (!outputTokenData || !inputTokenData) return [BigInt(0)];

    const txParams = await getTxParams(inputTokenData, outputTokenData, amount);

    return [txParams[1]];
  }
}