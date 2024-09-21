import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const config = createConfig({
  transports: {
    // [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  chains: [sepolia],
  ssr: true,
});
