import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base as Base, sepolia as Sepolia } from 'wagmi/chains';
import {
  NODE_ENV,
  CHAINS,
  ALCHEMY_API_KEY,
  WALLETCONNECT_API_KEY,
} from './config';
import { defineChain } from 'viem';

let sepolia = Sepolia;
let base = Base;

if (ALCHEMY_API_KEY) {
  const sepoliaAlchemyRpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
  const baseAlchemyRpcUrl = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
  sepolia = {
    ...Sepolia,
    rpcUrls: {
      ...Sepolia.rpcUrls,
      default: {
        http: [sepoliaAlchemyRpcUrl as any],
      },
    },
  };
  base = {
    ...Base,
    rpcUrls: {
      ...Base.rpcUrls,
      default: {
        http: [baseAlchemyRpcUrl as any],
      },
    },
  };
}

export const local = defineChain({
  name: 'Local',
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

// const chains = CHAINS.map((chain) => {
//   const response = [];
//   if (chain === 'local') {
//     response.push(local);
//   }
//   if (chain === 'sepolia') {
//     response.push(sepolia);
//   }
//   if (chain === 'base') {
//     response.push(base);
//   }
//   return response;
// });

const config = getDefaultConfig({
  appName: 'Leonardo AI',
  projectId: WALLETCONNECT_API_KEY as string,
  chains: NODE_ENV === 'development' ? [sepolia] : [base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default config;
