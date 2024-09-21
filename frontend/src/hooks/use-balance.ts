import { getTokenAddress } from "@/configs/contracts";
import { ERC20_ABI } from "@/lib/actions/actions/abis/erc20";
import { useMemo } from "react";
import { Address } from "viem";
import { useReadContract, useBalance as useWagmiBalance } from "wagmi";
import { useWalletInformation } from "./use-wallet-information";

export function useBalance(token?: string) {
  const wallet = useWalletInformation();
  const address = wallet?.data?.address;

  const tokenAddress = getTokenAddress(token) as Address | undefined;

  const ethBalance = useWagmiBalance({
    address: address,
    query: { enabled: !!address && token === 'ETH', }
  });
  const erc20Balance = useReadContract({
    abi: ERC20_ABI,
    address: tokenAddress as Address,
    functionName: "balanceOf",
    args: [address as Address],
    query: { enabled: !!address && token !== 'ETH' },
  });
  const erc20Decimals = useReadContract({
    abi: ERC20_ABI,
    address: tokenAddress as Address,
    functionName: "decimals",
    query: { enabled: !!address && token !== 'ETH' },
  });

  return useMemo(() => {
    if (token === 'ETH') {
      return {
        isLoading: ethBalance.isLoading || ethBalance.isRefetchError,
        balance: ethBalance.data?.value,
        decimals: ethBalance.data?.decimals
      };
    }

    return {
      isLoading: erc20Balance.isLoading || erc20Balance.isRefetchError || erc20Decimals.isLoading || erc20Decimals.isRefetchError,
      balance: erc20Balance.data,
      decimals: erc20Decimals.data
    }
  }, [token, erc20Balance.data, erc20Balance.isLoading, erc20Balance.isRefetchError, erc20Decimals.isLoading, erc20Decimals.isRefetchError, erc20Decimals.data, ethBalance.isLoading, ethBalance.isRefetchError, ethBalance.data?.value, ethBalance.data?.decimals]);
}
