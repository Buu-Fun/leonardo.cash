import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { ALCHEMY_API_KEY, CHAINS, WALLETCONNECT_API_KEY } from './config';
import { defineChain } from 'viem';
import { sepolia as Sepolia, base as Base } from 'viem/chains';

type DefinedChain = ReturnType<typeof defineChain>;

const local: DefinedChain = defineChain({
  name: 'local',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  id: 1337,
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
  testnet: true,
});

const sepolia: DefinedChain = defineChain({
  ...Sepolia,
  name: 'sepolia',
  rpcUrls: {
    default: {
      http: [`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`],
    },
  },
});

const base: DefinedChain = defineChain({
  ...Base,
  name: 'base',
  rpcUrls: {
    default: {
      http: [`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`],
    },
  },
});

const allChains = [local, sepolia, base];

const chains = allChains.filter((chain) =>
  CHAINS.includes(chain.name),
) as DefinedChain[];

if (chains.length === 0) {
  throw new Error('No chains found');
}

const config = getDefaultConfig({
  appName: 'Leonardo AI',
  projectId: WALLETCONNECT_API_KEY as string,
  chains: chains as any,
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export const defaultChain = chains[0];

export default config;
