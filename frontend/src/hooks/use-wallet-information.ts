"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserToken } from "./use-user-token";

export function useWalletInformation() {
  const token = useUserToken()?.[0];

  const { data } = useQuery({
    queryKey: ["user-information", token?.userId],
    queryFn: async () => {
      const res = await fetch(
        `/api/wallet/${token?.userId}`,
        { headers: { "token": token.userToken } }
      );

      return res.json();
    },
    enabled: !!token?.userToken
  });

  return data;
}