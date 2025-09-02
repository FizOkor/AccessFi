import { createConfig, http } from "wagmi"
import { defineChain } from "viem"

export const shardeumTestnet = defineChain({
  id: 8080,
  name: "Shardeum Unstablenet",
  nativeCurrency: {
    decimals: 18,
    name: "Shardeum",
    symbol: "SHM",
  },
  rpcUrls: {
    default: {
      http: ["https://api-unstable.shardeum.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Shardeum Explorer",
      url: "https://explorer-unstable.shardeum.org",
    },
  },
  testnet: true,
})

export const config = createConfig({
  chains: [shardeumTestnet],
  transports: {
    [shardeumTestnet.id]: http(),
  },
})