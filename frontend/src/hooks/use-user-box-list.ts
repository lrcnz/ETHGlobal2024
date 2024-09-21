import { useQuery } from "@tanstack/react-query";
import { useWalletInformation } from "./use-wallet-information";

export function useUserBoxList () {
  const wallet = useWalletInformation();
  const address =wallet?.data?.address;

  return useQuery({
    queryKey: ["boxs", wallet?.data?.address],
    queryFn: async () => {
      const response = await fetch(`/api/box/creator/${address}`).then((res) => res.json());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return response.map((item: any) => ({
        id: item.id,
        name: item.name,
        content: JSON.parse(item.content),
        creatorAddress: item.creatorAddress,
        apy: Number(item.apy || '0')
      }))
    },
    enabled: !!wallet?.data?.address
  })
}