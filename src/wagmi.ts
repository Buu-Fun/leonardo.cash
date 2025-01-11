import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, sepolia as Sepolia } from 'wagmi/chains';
import { NODE_ENV } from './config';

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
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: NODE_ENV === 'production' ? [base] : [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default config;
