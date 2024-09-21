"use client";

import { config } from "@/configs/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as WagmiProviderPrimitive } from "wagmi";

const queryClient = new QueryClient();

function WagmiProvider({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <WagmiProviderPrimitive config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProviderPrimitive>
  );
}

export { WagmiProvider };