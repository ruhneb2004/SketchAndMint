"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Sketch Mint",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true,
  transports: {
    [mainnet.id]: http(
      `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`
    ),
    [sepolia.id]: http(
      `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`
    ),
  },
});
