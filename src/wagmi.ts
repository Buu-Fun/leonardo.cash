import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, sepolia as Sepolia } from 'wagmi/chains';
import { CHAIN } from './config';

const sepolia = {
  ...Sepolia,
  rpcUrls: {
    ...Sepolia.rpcUrls,
    default: {
      http: ['https://ethereum-sepolia-rpc.publicnode.com'],
    },
  },
};

const config = getDefaultConfig({
  appName: 'Leonardo AI',
  projectId: 'leonardo-ai',
  chains: CHAIN === 'base' ? [base] : [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default config;
